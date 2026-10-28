import fs from "node:fs";
import { NextResponse } from "next/server";

interface PlanItem {
  name: string;
  title: string;
  localPath: string;
  repo: string;
}

const PACKAGE_PLAN_REGISTRY: Record<
  string,
  { name: string; repo_name: string; repo: string; plans: PlanItem[] }
> = {
  "churchcore-chms": {
    name: "ChurchCore ChMS",
    repo_name: "ChurchCore",
    repo: "ricardojjulia/ChurchCore",
    plans: [
      {
        name: "docs/mvp-100-plan.md",
        title: "MVP 100 Launch Plan",
        localPath: "/Users/rjulia/ChurchCore/docs/mvp-100-plan.md",
        repo: "ricardojjulia/ChurchCore",
      },
      {
        name: "DEVELOPMENT_PLAN.md",
        title: "Master Development Plan",
        localPath: "/Users/rjulia/ChurchCore/DEVELOPMENT_PLAN.md",
        repo: "ricardojjulia/ChurchCore",
      },
    ],
  },
  "churchcore-lms": {
    name: "ChurchCore LMS",
    repo_name: "ChurchCore-LMS",
    repo: "ricardojjulia/ChurchCore-LMS",
    plans: [
      {
        name: "docs/mvp-100-plan.md",
        title: "MVP 100 Implementation Plan",
        localPath: "/Users/rjulia/ChurchCore LMS/docs/mvp-100-plan.md",
        repo: "ricardojjulia/ChurchCore-LMS",
      },
    ],
  },
  "churchcore-academy": {
    name: "ChurchCore Academy",
    repo_name: "ChurchCore Academy",
    repo: "ricardojjulia/ChurchCore-Academy",
    plans: [
      {
        name: "docs/mvp-100-plan.md",
        title: "MVP 100 Readiness Plan",
        localPath: "/Users/rjulia/ChurchCore Academy/docs/mvp-100-plan.md",
        repo: "ricardojjulia/ChurchCore-Academy",
      },
    ],
  },
  "churchcore-care": {
    name: "ChurchCore Care",
    repo_name: "ChurchCore Care",
    repo: "ricardojjulia/ChurchCoreCare",
    plans: [
      {
        name: "docs/mvp-100-plan.md",
        title: "MVP 100 Plan",
        localPath: "/Users/rjulia/ChurchCore Care/docs/mvp-100-plan.md",
        repo: "ricardojjulia/ChurchCoreCare",
      },
    ],
  },
  "churchcore-orthos": {
    name: "ChurchCore Orthos",
    repo_name: "ChurchCore Orthos",
    repo: "ricardojjulia/ChurchCore-Orthos",
    plans: [
      {
        name: "docs/mvp-100-plan.md",
        title: "MVP 100 Execution Plan",
        localPath: "/Users/rjulia/ChurchCore Orthos/docs/mvp-100-plan.md",
        repo: "ricardojjulia/ChurchCore-Orthos",
      },
    ],
  },
  "faithfull-scholars": {
    name: "FaithFull Scholars",
    repo_name: "FaithFullScholars",
    repo: "ricardojjulia/FaithFullScholars",
    plans: [
      {
        name: "docs/mvp-100-plan.md",
        title: "MVP 100 Execution Plan",
        localPath: "/Users/rjulia/FaithFullScholars/docs/mvp-100-plan.md",
        repo: "ricardojjulia/FaithFullScholars",
      },
    ],
  },
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("product_id") || "churchcore-chms";
  const docIndex = Number(searchParams.get("doc_index") || "0");

  const pkg =
    PACKAGE_PLAN_REGISTRY[productId] || PACKAGE_PLAN_REGISTRY["churchcore-chms"];
  const safeIndex =
    docIndex >= 0 && docIndex < pkg.plans.length ? docIndex : 0;
  const target = pkg.plans[safeIndex];

  let content = "";
  let source = "local";

  if (fs.existsSync(target.localPath)) {
    try {
      content = fs.readFileSync(target.localPath, "utf8");
    } catch {
      content = "";
    }
  }

  if (!content) {
    source = "github_remote";
    const rawUrl = `https://raw.githubusercontent.com/${target.repo}/main/${target.name}`;
    try {
      const headers: Record<string, string> = {
        "User-Agent": "ChurchCore-Sovereign-Control-Plane/2.0",
      };
      if (process.env.GITHUB_TOKEN) {
        headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
      }
      const res = await fetch(rawUrl, { headers, cache: "no-store" });
      if (res.ok) {
        content = await res.text();
      } else {
        content = `# ${target.title}\n\nPlan document located in \`${target.repo}/${target.name}\`. Configure \`GITHUB_TOKEN\` in Vercel environment variables for private repository ingestion.`;
      }
    } catch {
      content = `# ${target.title}\n\nUnable to fetch \`${target.repo}/${target.name}\`.`;
    }
  }

  return NextResponse.json({
    success: true,
    product_id: productId,
    product_name: pkg.name,
    repo_name: pkg.repo_name,
    doc_index: safeIndex,
    source,
    plans: pkg.plans.map((p) => ({
      name: p.name,
      title: p.title,
      path: p.localPath,
      exists: true,
    })),
    active_document: {
      name: target.name,
      title: target.title,
      path: target.localPath,
      size: content.length,
      content,
    },
  });
}

