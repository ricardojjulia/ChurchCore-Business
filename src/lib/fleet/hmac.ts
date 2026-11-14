/**
 * COUNCIL-2026-016 fleet_api.auth — HMAC-SHA256 request signing and verification.
 *
 *   signature = hex(HMAC-SHA256(secret, `${timestamp}.${raw_body}`))
 *   headers   = X-Fleet-Timestamp (unix seconds), X-Fleet-Signature (lowercase hex)
 *   window    = reject if |now - timestamp| > 300s
 *
 * Secrets are per product: env `FLEET_PROVISIONING_SECRET_<PRODUCT_KEY>` on the control plane
 * (each product holds its own value as `FLEET_PROVISIONING_SECRET`). Missing secrets fail closed.
 *
 * DEPENDENCY-FREE BY DESIGN: this file will move into `@churchcore/fleet-signup/server`.
 * It may import only Node built-ins. Do not import from `@/…` or any npm package here.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

export const FLEET_TIMESTAMP_HEADER = "X-Fleet-Timestamp";
export const FLEET_SIGNATURE_HEADER = "X-Fleet-Signature";
export const FLEET_SIGNATURE_WINDOW_SECONDS = 300;
/** Secrets shorter than this are treated as missing (fail closed on weak configuration). */
export const FLEET_SECRET_MIN_LENGTH = 32;

export class FleetSecretMissingError extends Error {
  constructor(public readonly envVar: string) {
    super(`Fleet provisioning secret ${envVar} is not configured (or shorter than ${FLEET_SECRET_MIN_LENGTH} chars).`);
    this.name = "FleetSecretMissingError";
  }
}

/** `ChurchCore-LMS` → `CHURCHCORE_LMS`. */
export function productEnvKey(product: string): string {
  return product.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

export function provisioningSecretEnvVar(product: string): string {
  return `FLEET_PROVISIONING_SECRET_${productEnvKey(product)}`;
}

/** Returns the product's secret or throws FleetSecretMissingError. Never returns a default. */
export function getProvisioningSecret(
  product: string,
  env: Record<string, string | undefined> = process.env
): string {
  const name = provisioningSecretEnvVar(product);
  const value = (env[name] ?? "").trim();
  if (value.length < FLEET_SECRET_MIN_LENGTH) throw new FleetSecretMissingError(name);
  return value;
}

export function computeFleetSignature(secret: string, timestamp: string, rawBody: string): string {
  return createHmac("sha256", secret).update(`${timestamp}.${rawBody}`, "utf8").digest("hex");
}

export interface SignedFleetHeaders {
  [FLEET_TIMESTAMP_HEADER]: string;
  [FLEET_SIGNATURE_HEADER]: string;
}

export function signFleetRequest(
  rawBody: string,
  secret: string,
  nowSeconds: number = Math.floor(Date.now() / 1000)
): SignedFleetHeaders {
  if (!secret || secret.length < FLEET_SECRET_MIN_LENGTH) {
    throw new FleetSecretMissingError("FLEET_PROVISIONING_SECRET");
  }
  const timestamp = String(Math.floor(nowSeconds));
  return {
    [FLEET_TIMESTAMP_HEADER]: timestamp,
    [FLEET_SIGNATURE_HEADER]: computeFleetSignature(secret, timestamp, rawBody),
  };
}

export type FleetVerifyFailure =
  | "missing_secret"
  | "missing_headers"
  | "malformed_timestamp"
  | "stale_timestamp"
  | "malformed_signature"
  | "bad_signature";

export type FleetVerifyResult = { ok: true } | { ok: false; reason: FleetVerifyFailure };

export interface VerifyFleetSignatureInput {
  rawBody: string;
  timestamp: string | null | undefined;
  signature: string | null | undefined;
  secret: string | null | undefined;
  nowSeconds?: number;
  windowSeconds?: number;
}

const TIMESTAMP_RX = /^\d{1,12}$/;
const SIGNATURE_RX = /^[0-9a-f]{64}$/;

/** Verifies a fleet request. Constant-time comparison; fails closed on every malformed input. */
export function verifyFleetSignature(input: VerifyFleetSignatureInput): FleetVerifyResult {
  const { rawBody, timestamp, signature, secret } = input;
  const now = input.nowSeconds ?? Math.floor(Date.now() / 1000);
  const window = input.windowSeconds ?? FLEET_SIGNATURE_WINDOW_SECONDS;

  if (!secret || secret.length < FLEET_SECRET_MIN_LENGTH) return { ok: false, reason: "missing_secret" };
  if (!timestamp || !signature) return { ok: false, reason: "missing_headers" };
  if (!TIMESTAMP_RX.test(timestamp)) return { ok: false, reason: "malformed_timestamp" };
  if (Math.abs(now - Number(timestamp)) > window) return { ok: false, reason: "stale_timestamp" };

  const provided = signature.trim().toLowerCase();
  if (!SIGNATURE_RX.test(provided)) return { ok: false, reason: "malformed_signature" };

  const expected = Buffer.from(computeFleetSignature(secret, timestamp, rawBody), "hex");
  const actual = Buffer.from(provided, "hex");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return { ok: false, reason: "bad_signature" };
  }
  return { ok: true };
}
