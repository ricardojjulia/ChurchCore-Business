#!/usr/bin/env node
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const REPOS = [
  "ricardojjulia/ChurchCore",
  "ricardojjulia/ChurchCore-LMS",
  "ricardojjulia/ChurchCore-Academy",
  "ricardojjulia/ChurchCoreCare",
  "ricardojjulia/ChurchCore-Orthos",
  "ricardojjulia/FaithFullScholars",
];

function getEnvSecret() {
  if (process.env.GITHUB_WEBHOOK_SECRET) {
    return process.env.GITHUB_WEBHOOK_SECRET.trim();
  }
  if (fs.existsSync(".env.local")) {
    const raw = fs.readFileSync(".env.local", "utf8");
    const m = raw.match(/^GITHUB_WEBHOOK_SECRET=(.+)$/m);
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  }
  throw new Error("GITHUB_WEBHOOK_SECRET not found in environment or .env.local");
}

const secret = getEnvSecret();
const webhookUrl = "https://churchcore-control-plane.vercel.app/api/webhooks/github";

for (const repo of REPOS) {
  try {
    const existingRaw = execFileSync(
      "gh",
      ["api", `repos/${repo}/hooks`, "--method", "GET"],
      { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }
    );
    const hooks = JSON.parse(existingRaw);
    const match = hooks.find((h) => h.config && h.config.url === webhookUrl);

    const payload = JSON.stringify({
      name: "web",
      active: true,
      events: ["push", "pull_request", "deployment_status"],
      config: {
        url: webhookUrl,
        content_type: "json",
        secret,
        insecure_ssl: "0",
      },
    });

    if (match) {
      execFileSync(
        "gh",
        ["api", `repos/${repo}/hooks/${match.id}`, "--method", "PATCH", "--input", "-"],
        { input: payload, stdio: ["pipe", "pipe", "pipe"] }
      );
      console.log(`[UPDATED] Webhook #${match.id} on ${repo} -> ${webhookUrl}`);
    } else {
      const createdRaw = execFileSync(
        "gh",
        ["api", `repos/${repo}/hooks`, "--method", "POST", "--input", "-"],
        { input: payload, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }
      );
      const created = JSON.parse(createdRaw);
      console.log(`[CREATED] Webhook #${created.id} on ${repo} -> ${webhookUrl}`);
    }
  } catch (err) {
    console.warn(`[WARN] Could not register webhook on ${repo}: ${err.message.split("\n")[0]}`);
  }
}

