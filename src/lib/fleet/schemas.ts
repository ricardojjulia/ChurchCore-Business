/**
 * Zod schemas for the COUNCIL-2026-016 fleet_api contract (fleet-tenancy.json `fleet_api`).
 */

import { z } from "zod";
import {
  BILLING_STATUSES,
  CREATE_BILLING_STATUSES,
  FLEET_PRODUCTS,
  LIFECYCLE_ACTIONS,
  PLAN_KEYS,
  TENANT_STATUSES,
  validateSlug,
} from "@/lib/fleet/spec";

function isIanaTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export const SlugSchema = z.string().superRefine((val, ctx) => {
  const res = validateSlug(val);
  if (!res.ok) ctx.addIssue({ code: z.ZodIssueCode.custom, message: res.reason });
});

/** fleet_api.create_request, exactly. */
export const FleetCreateRequestSchema = z
  .object({
    fleet_tenant_id: z.string().uuid(),
    slug: SlugSchema,
    display_name: z.string().trim().min(2).max(120),
    plan: z.enum(PLAN_KEYS),
    billing_status: z.enum(CREATE_BILLING_STATUSES),
    admin: z.object({
      email: z.string().trim().email().max(254),
      name: z.string().trim().min(1).max(120),
    }).strict(),
    timezone: z.string().max(64).refine(isIanaTimeZone, "timezone must be an IANA time zone"),
    country: z.string().regex(/^[A-Z]{2}$/, "country must be ISO-3166-1 alpha-2 (uppercase)"),
    contract_ref: z.string().trim().min(1).max(200).nullable(),
  })
  .strict();
export type FleetCreateRequest = z.infer<typeof FleetCreateRequestSchema>;

/**
 * Operator console input: create_request plus the target product. `fleet_tenant_id` is optional
 * (minted when absent; supplied to retry a provision_failed tenant idempotently).
 */
export const OperatorProvisionSchema = FleetCreateRequestSchema.extend({
  product: z.enum(FLEET_PRODUCTS),
  fleet_tenant_id: z.string().uuid().optional(),
  contract_ref: z.string().trim().min(1).max(200).nullable().default(null),
}).strict();
export type OperatorProvisionInput = z.infer<typeof OperatorProvisionSchema>;

/** fleet_api.create_response (extra keys tolerated, required keys enforced). */
export const FleetCreateResponseSchema = z.object({
  fleet_tenant_id: z.string().uuid(),
  app_tenant_id: z.string().min(1).max(200),
  tenant_status: z.enum(TENANT_STATUSES),
  billing_status: z.enum(BILLING_STATUSES),
});
export type FleetCreateResponse = z.infer<typeof FleetCreateResponseSchema>;

/** GET /api/fleet/tenants/{id} and lifecycle action responses (spec leaves the shape open). */
export const FleetStatusResponseSchema = z.object({
  fleet_tenant_id: z.string().uuid().optional(),
  app_tenant_id: z.string().min(1).max(200).optional(),
  tenant_status: z.enum(TENANT_STATUSES).optional(),
  billing_status: z.enum(BILLING_STATUSES).optional(),
  plan: z.enum(PLAN_KEYS).optional(),
});

export const LifecycleActionSchema = z.enum(LIFECYCLE_ACTIONS);
export const OperatorTenantActionSchema = z
  .object({
    fleet_tenant_id: z.string().uuid(),
    action: z.enum([...LIFECYCLE_ACTIONS, "refresh"]),
  })
  .strict();
