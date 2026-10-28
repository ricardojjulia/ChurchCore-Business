import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await context.params;
  const relPath = slug.join("/");

  // Prevent path traversal outside docs/
  const docsRoot = path.resolve(process.cwd(), "docs");
  const targetPath = path.resolve(docsRoot, relPath);
  if (!targetPath.startsWith(docsRoot) || !fs.existsSync(targetPath)) {
    return new NextResponse("Document not found", { status: 404 });
  }

  const content = fs.readFileSync(targetPath, "utf8");
  const url = new URL(req.url);
  if (url.searchParams.has("raw")) {
    return new NextResponse(content, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const filename = path.basename(targetPath);
  const title = filename.replace(/\.md$/i, "").replace(/-/g, " ");
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} — ChurchCore Dossier</title>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <style>
    body { font-family: 'Inter', -apple-system, sans-serif; background: #090d16; color: #f1f5f9; margin: 0; line-height: 1.6; }
    header { position: sticky; top: 0; background: rgba(15, 23, 42, 0.95); border-bottom: 1px solid #1e293b; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; }
    .btn { padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; color: #f8fafc; background: #1e293b; border: 1px solid #334155; text-decoration: none; }
    .container { max-width: 920px; margin: 32px auto; padding: 0 20px 60px; }
    .card { background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 40px; }
    pre { background: #020617; padding: 16px; border-radius: 8px; overflow-x: auto; }
    code { font-family: monospace; color: #93c5fd; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border: 1px solid #1e293b; padding: 8px 12px; text-align: left; }
    a { color: #818cf8; }
  </style>
</head>
<body>
  <header>
    <div><a href="/" class="btn">← Back to Executive Cockpit</a> <strong style="margin-left:12px">${escapeHtml(filename)}</strong></div>
    <div><a href="?raw=true" class="btn">Raw Markdown</a></div>
  </header>
  <div class="container">
    <div class="card" id="md-out"></div>
    <pre id="md-raw" style="display:none">${escapeHtml(content)}</pre>
  </div>
  <script>
    const raw = document.getElementById('md-raw').textContent;
    document.getElementById('md-out').innerHTML = window.marked ? marked.parse(raw) : '<pre>' + raw + '</pre>';
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

