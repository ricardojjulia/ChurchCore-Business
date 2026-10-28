export const HUB_REPO = "ricardojjulia/ChurchCore-Business";

export const PRODUCT_REPO_MAP: Array<{
  product_id: string;
  name: string;
  repo: string;
}> = [
  {
    product_id: "churchcore-chms",
    name: "ChurchCore ChMS",
    repo: "ricardojjulia/ChurchCore",
  },
  {
    product_id: "churchcore-lms",
    name: "ChurchCore LMS",
    repo: "ricardojjulia/ChurchCore-LMS",
  },
  {
    product_id: "churchcore-academy",
    name: "ChurchCore Academy",
    repo: "ricardojjulia/ChurchCore-Academy",
  },
  {
    product_id: "churchcore-care",
    name: "ChurchCore Care",
    repo: "ricardojjulia/ChurchCoreCare",
  },
  {
    product_id: "churchcore-orthos",
    name: "ChurchCore Orthos",
    repo: "ricardojjulia/ChurchCore-Orthos",
  },
  {
    product_id: "faithfull-scholars",
    name: "FaithFull Scholars",
    repo: "ricardojjulia/FaithFullScholars",
  },
];

export const ALLOWED_COUNCIL_REPOS = new Set<string>([
  HUB_REPO,
  ...PRODUCT_REPO_MAP.map((r) => r.repo),
]);

function cleanEnv(val: string | undefined): string {
  if (!val) return "";
  return val.trim().replace(/^["']|["']$/g, "").trim();
}

export function getGitHubToken(): string {
  return (
    cleanEnv(process.env.GITHUB_TOKEN) ||
    cleanEnv(process.env.GH_TOKEN) ||
    cleanEnv(process.env.GITHUB_PAT)
  );
}

function getGitHubHeaders(): Record<string, string> {
  const token = getGitHubToken();
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "ChurchCore-Sovereign-Control-Plane-Council/2.0",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export function resolveCanonicalRepo(target: string): string {
  const cleaned = target.trim();
  if (ALLOWED_COUNCIL_REPOS.has(cleaned)) {
    return cleaned;
  }
  if (
    cleaned.toLowerCase() === "churchcore-business" ||
    cleaned.toLowerCase() === "hub"
  ) {
    return HUB_REPO;
  }
  const matched = PRODUCT_REPO_MAP.find(
    (r) =>
      r.product_id.toLowerCase() === cleaned.toLowerCase() ||
      r.repo.toLowerCase() === cleaned.toLowerCase() ||
      r.name.toLowerCase() === cleaned.toLowerCase()
  );
  if (matched) {
    return matched.repo;
  }
  throw new Error(
    `Target repository '${target}' is outside the governed ChurchCore 7-repo boundary.`
  );
}

export interface RepoFilePayload {
  repo: string;
  path: string;
  branch: string;
  exists: boolean;
  sha?: string;
  content?: string;
  htmlUrl?: string;
}

/**
 * Pulls a file from a governed GitHub repository via the GitHub Contents API.
 */
export async function pullRepoFile(
  targetRepo: string,
  filePath: string,
  branch = "main"
): Promise<RepoFilePayload> {
  const repo = resolveCanonicalRepo(targetRepo);
  const cleanPath = filePath.replace(/^\/+/, "");
  const url = `https://api.github.com/repos/${repo}/contents/${cleanPath}?ref=${encodeURIComponent(
    branch
  )}`;

  const res = await fetch(url, {
    method: "GET",
    headers: getGitHubHeaders(),
    cache: "no-store",
  });

  if (res.status === 404) {
    return { repo, path: cleanPath, branch, exists: false };
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(
      `GitHub API pull failed (${res.status}) for ${repo}:${cleanPath}: ${errText.slice(
        0,
        240
      )}`
    );
  }

  const data = (await res.json()) as {
    sha: string;
    content?: string;
    encoding?: string;
    html_url?: string;
  };

  const decoded =
    data.content && data.encoding === "base64"
      ? Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf8")
      : "";

  return {
    repo,
    path: cleanPath,
    branch,
    exists: true,
    sha: data.sha,
    content: decoded,
    htmlUrl: data.html_url,
  };
}

export interface UpsertRepoFileResult {
  repo: string;
  path: string;
  branch: string;
  commitSha: string;
  commitUrl: string;
  action: "created" | "updated";
}

/**
 * Commits and pushes a file to a governed GitHub repository via the GitHub Contents API.
 */
export async function upsertRepoFile(params: {
  targetRepo: string;
  filePath: string;
  content: string;
  commitMessage: string;
  branch?: string;
}): Promise<UpsertRepoFileResult> {
  const token = getGitHubToken();
  if (!token) {
    throw new Error(
      "GITHUB_TOKEN is not configured. Configure GITHUB_TOKEN to enable Council repository push operations."
    );
  }

  const repo = resolveCanonicalRepo(params.targetRepo);
  const branch = params.branch || "main";
  const cleanPath = params.filePath.replace(/^\/+/, "");

  const existing = await pullRepoFile(repo, cleanPath, branch);

  const url = `https://api.github.com/repos/${repo}/contents/${cleanPath}`;
  const body: Record<string, unknown> = {
    message: params.commitMessage,
    content: Buffer.from(params.content, "utf8").toString("base64"),
    branch,
    committer: {
      name: "ChurchCore Sovereign Council",
      email: "admin@churchcore.io",
    },
  };

  if (existing.exists && existing.sha) {
    body.sha = existing.sha;
  }

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      ...getGitHubHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(
      `GitHub API push failed (${res.status}) for ${repo}:${cleanPath}: ${errText.slice(
        0,
        280
      )}`
    );
  }

  const data = (await res.json()) as {
    commit?: { sha?: string; html_url?: string };
  };

  return {
    repo,
    path: cleanPath,
    branch,
    commitSha: data.commit?.sha || "unknown",
    commitUrl:
      data.commit?.html_url || `https://github.com/${repo}/commits/${branch}`,
    action: existing.exists ? "updated" : "created",
  };
}

/**
 * Creates a branch from the default branch tip and opens a Pull Request with the Council's changes.
 */
export async function createCouncilPullRequest(params: {
  targetRepo: string;
  branchName: string;
  baseBranch?: string;
  filePath: string;
  content: string;
  commitMessage: string;
  prTitle: string;
  prBody: string;
}): Promise<{
  repo: string;
  branchName: string;
  commitSha: string;
  prNumber: number;
  prUrl: string;
}> {
  const token = getGitHubToken();
  if (!token) {
    throw new Error(
      "GITHUB_TOKEN is not configured. Configure GITHUB_TOKEN to enable Council pull request operations."
    );
  }

  const repo = resolveCanonicalRepo(params.targetRepo);
  const baseBranch = params.baseBranch || "main";
  const headers = {
    ...getGitHubHeaders(),
    "Content-Type": "application/json",
  };

  // 1. Get SHA of baseBranch
  const refRes = await fetch(
    `https://api.github.com/repos/${repo}/git/ref/heads/${encodeURIComponent(
      baseBranch
    )}`,
    { headers, cache: "no-store" }
  );
  if (!refRes.ok) {
    throw new Error(
      `Failed to read base branch '${baseBranch}' on ${repo} (${refRes.status}).`
    );
  }
  const refData = (await refRes.json()) as { object: { sha: string } };

  // 2. Create or update target branch
  const createRefRes = await fetch(
    `https://api.github.com/repos/${repo}/git/refs`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        ref: `refs/heads/${params.branchName}`,
        sha: refData.object.sha,
      }),
    }
  );
  if (!createRefRes.ok && createRefRes.status !== 422) {
    const errText = await createRefRes.text();
    throw new Error(
      `Failed to create branch '${params.branchName}' on ${repo}: ${errText.slice(
        0,
        200
      )}`
    );
  }

  // 3. Upsert file on the new branch
  const upsertResult = await upsertRepoFile({
    targetRepo: repo,
    filePath: params.filePath,
    content: params.content,
    commitMessage: params.commitMessage,
    branch: params.branchName,
  });

  // 4. Open Pull Request
  const prRes = await fetch(`https://api.github.com/repos/${repo}/pulls`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      title: params.prTitle,
      body: params.prBody,
      head: params.branchName,
      base: baseBranch,
    }),
  });

  if (!prRes.ok) {
    const errText = await prRes.text();
    throw new Error(
      `Failed to open PR on ${repo} (${prRes.status}): ${errText.slice(0, 240)}`
    );
  }

  const prData = (await prRes.json()) as { number: number; html_url: string };
  return {
    repo,
    branchName: params.branchName,
    commitSha: upsertResult.commitSha,
    prNumber: prData.number,
    prUrl: prData.html_url,
  };
}

/**
 * Triggers a repository_dispatch event on a governed repository so its GitHub Actions workflows run.
 */
export async function triggerRepoDispatch(params: {
  targetRepo: string;
  eventType: string;
  clientPayload?: Record<string, unknown>;
}): Promise<{ repo: string; dispatched: boolean; eventType: string }> {
  const token = getGitHubToken();
  if (!token) {
    throw new Error("GITHUB_TOKEN is not configured for repository_dispatch.");
  }

  const repo = resolveCanonicalRepo(params.targetRepo);
  const res = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
    method: "POST",
    headers: {
      ...getGitHubHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event_type: params.eventType,
      client_payload: params.clientPayload || {},
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(
      `GitHub repository_dispatch failed (${res.status}) on ${repo}: ${errText.slice(
        0,
        200
      )}`
    );
  }

  return {
    repo,
    dispatched: true,
    eventType: params.eventType,
  };
}

/**
 * Inspects a repository's live GitHub metadata, latest commit, and governance files.
 */
export async function inspectRepoGovernanceState(targetRepo: string): Promise<{
  repo: string;
  authenticated: boolean;
  defaultBranch: string;
  latestCommitSha: string | null;
  latestCommitMessage: string | null;
  latestCommitDate: string | null;
  hasTelemetryJson: boolean;
  hasAcknowledgmentsMd: boolean;
}> {
  const repo = resolveCanonicalRepo(targetRepo);
  const headers = getGitHubHeaders();

  const [repoRes, commitsRes, telemetryFile, ackFile] = await Promise.all([
    fetch(`https://api.github.com/repos/${repo}`, {
      headers,
      cache: "no-store",
    }),
    fetch(`https://api.github.com/repos/${repo}/commits?per_page=1`, {
      headers,
      cache: "no-store",
    }),
    pullRepoFile(repo, "docs/control-plane/telemetry.json").catch(() => ({
      exists: false,
    })),
    pullRepoFile(repo, "docs/council/ACKNOWLEDGMENTS.md").catch(() => ({
      exists: false,
    })),
  ]);

  const repoJson = repoRes.ok
    ? ((await repoRes.json()) as { default_branch?: string })
    : {};
  const commitsJson = commitsRes.ok
    ? ((await commitsRes.json()) as Array<{
        sha?: string;
        commit?: { message?: string; author?: { date?: string } };
      }>)
    : [];

  const latest = commitsJson[0];

  return {
    repo,
    authenticated: Boolean(getGitHubToken()),
    defaultBranch: repoJson.default_branch || "main",
    latestCommitSha: latest?.sha || null,
    latestCommitMessage: latest?.commit?.message?.split("\n")[0] || null,
    latestCommitDate: latest?.commit?.author?.date || null,
    hasTelemetryJson: telemetryFile.exists,
    hasAcknowledgmentsMd: ackFile.exists,
  };
}
