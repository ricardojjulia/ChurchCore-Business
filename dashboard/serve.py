#!/usr/bin/env python3
"""
ChurchCore Sovereign Control Plane: Local Dashboard Server
Serves the Executive Cockpit locally at http://localhost:3333,
including live documentation, markdown dossiers, and telemetry files.
"""

import http.server
import socketserver
import os
import sys
import webbrowser
import html
import urllib.parse

PORT = 3333
DASHBOARD_DIR = os.path.dirname(os.path.abspath(__file__))
WORKSPACE_DIR = os.path.dirname(DASHBOARD_DIR)

DOSSIER_HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} — ChurchCore Dossier</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <style>
    :root {{
      --bg: #090d16;
      --card-bg: #0f172a;
      --border: #1e293b;
      --text: #f1f5f9;
      --text-muted: #94a3b8;
      --accent: #6366f1;
      --gold: #f59e0b;
    }}
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 0;
    }}
    header {{
      position: sticky;
      top: 0;
      z-index: 50;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--border);
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }}
    .header-left {{
      display: flex;
      align-items: center;
      gap: 12px;
    }}
    .badge {{
      background: rgba(99, 102, 241, 0.15);
      color: #818cf8;
      border: 1px solid rgba(99, 102, 241, 0.3);
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }}
    .filename {{
      font-size: 14px;
      font-weight: 600;
      color: var(--text);
    }}
    .header-actions {{
      display: flex;
      gap: 10px;
    }}
    .btn {{
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
      border: 1px solid var(--border);
      background: #1e293b;
      color: #cbd5e1;
    }}
    .btn:hover {{
      background: #334155;
      color: #fff;
    }}
    .btn-gold {{
      background: rgba(245, 158, 11, 0.15);
      border-color: rgba(245, 158, 11, 0.4);
      color: #fbbf24;
    }}
    .btn-gold:hover {{
      background: rgba(245, 158, 11, 0.25);
      color: #fef3c7;
    }}
    .container {{
      max-width: 920px;
      margin: 32px auto;
      padding: 0 20px 60px;
    }}
    .content-card {{
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    }}
    #markdown-body h1, #markdown-body h2, #markdown-body h3, #markdown-body h4 {{
      color: #fff;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-top: 28px;
      margin-bottom: 12px;
      line-height: 1.3;
    }}
    #markdown-body h1 {{ font-size: 28px; border-bottom: 1px solid var(--border); padding-bottom: 12px; margin-top: 0; }}
    #markdown-body h2 {{ font-size: 20px; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 8px; }}
    #markdown-body h3 {{ font-size: 16px; color: #cbd5e1; }}
    #markdown-body p {{ margin-bottom: 16px; color: #cbd5e1; }}
    #markdown-body ul, #markdown-body ol {{ margin-bottom: 16px; padding-left: 24px; color: #cbd5e1; }}
    #markdown-body li {{ margin-bottom: 6px; }}
    #markdown-body blockquote {{
      border-left: 4px solid var(--gold);
      background: rgba(245, 158, 11, 0.08);
      padding: 12px 18px;
      border-radius: 0 8px 8px 0;
      margin: 16px 0;
      color: #fef3c7;
      font-size: 14px;
    }}
    #markdown-body hr {{
      border: 0;
      border-top: 1px solid var(--border);
      margin: 28px 0;
    }}
    #markdown-body code {{
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      background: #1e293b;
      padding: 2px 6px;
      border-radius: 4px;
      color: #e2e8f0;
    }}
    #markdown-body pre {{
      background: #020617;
      border: 1px solid #1e293b;
      border-radius: 10px;
      padding: 16px;
      overflow-x: auto;
      margin-bottom: 16px;
    }}
    #markdown-body pre code {{
      background: transparent;
      padding: 0;
      color: #93c5fd;
    }}
    #markdown-body table {{
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 13px;
    }}
    #markdown-body th, #markdown-body td {{
      padding: 10px 14px;
      border: 1px solid var(--border);
      text-align: left;
    }}
    #markdown-body th {{
      background: #1e293b;
      font-weight: 600;
      color: #fff;
    }}
    #markdown-body tr:nth-child(even) {{
      background: rgba(255,255,255,0.02);
    }}
    #markdown-body a {{
      color: #818cf8;
      text-decoration: underline;
    }}
    #raw-view {{
      display: none;
      white-space: pre-wrap;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: #cbd5e1;
      background: #020617;
      padding: 24px;
      border-radius: 12px;
      border: 1px solid var(--border);
      overflow-x: auto;
    }}
  </style>
</head>
<body>
  <header>
    <div class="header-left">
      <a href="/" class="btn" title="Back to Control Plane">← Dashboard</a>
      <span class="badge">Marketing & Strategy Dossier</span>
      <span class="filename">{filename}</span>
    </div>
    <div class="header-actions">
      <button class="btn" id="btn-toggle-raw" onclick="toggleRaw()">📄 Toggle Raw MD</button>
      <button class="btn btn-gold" id="btn-copy" onclick="copyMarkdown()">📋 Copy Markdown</button>
      <a href="?raw=true" download="{filename}" class="btn">⬇️ Download</a>
    </div>
  </header>

  <div class="container">
    <div class="content-card">
      <div id="markdown-body"></div>
      <div id="raw-view">{escaped_content}</div>
    </div>
  </div>

  <script>
    const rawContent = document.getElementById('raw-view').textContent;
    if (window.marked) {{
      document.getElementById('markdown-body').innerHTML = marked.parse(rawContent);
    }} else {{
      document.getElementById('markdown-body').innerHTML = '<pre>' + rawContent + '</pre>';
    }}

    function toggleRaw() {{
      const mb = document.getElementById('markdown-body');
      const rv = document.getElementById('raw-view');
      const btn = document.getElementById('btn-toggle-raw');
      if (rv.style.display === 'block') {{
        rv.style.display = 'none';
        mb.style.display = 'block';
        btn.textContent = '📄 Toggle Raw MD';
      }} else {{
        rv.style.display = 'block';
        mb.style.display = 'none';
        btn.textContent = '👁️ Rendered View';
      }}
    }}

    function copyMarkdown() {{
      navigator.clipboard.writeText(rawContent).then(() => {{
        const btn = document.getElementById('btn-copy');
        const orig = btn.innerHTML;
        btn.innerHTML = '✅ Copied!';
        setTimeout(() => {{ btn.innerHTML = orig; }}, 2000);
      }});
    }}
  </script>
</body>
</html>
"""

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DASHBOARD_DIR, **kwargs)

    def translate_path(self, path):
        clean_path = path.split('?', 1)[0].split('#', 1)[0]
        clean_path = urllib.parse.unquote(clean_path)
        if clean_path.startswith('/docs/'):
            return os.path.join(WORKSPACE_DIR, clean_path.lstrip('/'))
        if clean_path.startswith('/scripts/'):
            return os.path.join(WORKSPACE_DIR, clean_path.lstrip('/'))
        return super().translate_path(path)

    def do_GET(self):
        clean_path = self.path.split('?', 1)[0].split('#', 1)[0]
        parsed_url = urllib.parse.urlparse(self.path)
        query_params = urllib.parse.parse_qs(parsed_url.query)

        # Check if requesting markdown file
        if clean_path.endswith('.md'):
            file_path = self.translate_path(clean_path)
            if os.path.exists(file_path) and os.path.isfile(file_path):
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()

                    # If ?raw=true or not accepting html (e.g. curl), return raw text
                    accept = self.headers.get('Accept', '')
                    if 'raw' in query_params or 'text/html' not in accept:
                        encoded = content.encode('utf-8')
                        self.send_response(200)
                        self.send_header('Content-Type', 'text/plain; charset=utf-8')
                        self.send_header('Content-Length', str(len(encoded)))
                        self.end_headers()
                        self.wfile.write(encoded)
                        return
                    else:
                        filename = os.path.basename(file_path)
                        title = filename.replace('-preso.md', '').replace('.md', '').replace('-', ' ').title()
                        html_out = DOSSIER_HTML_TEMPLATE.format(
                            title=title,
                            filename=filename,
                            escaped_content=html.escape(content)
                        ).encode('utf-8')
                        self.send_response(200)
                        self.send_header('Content-Type', 'text/html; charset=utf-8')
                        self.send_header('Content-Length', str(len(html_out)))
                        self.end_headers()
                        self.wfile.write(html_out)
                        return
                except Exception as e:
                    self.send_error(500, f"Error reading markdown file: {e}")
                    return

        super().do_GET()

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def main():
    os.chdir(DASHBOARD_DIR)
    url = f"http://localhost:{PORT}"
    
    print("=" * 70)
    print("  CHURCHCORE SOVEREIGN CONTROL PLANE: EXECUTIVE DASHBOARD")
    print("=" * 70)
    print(f"[+] Serving dashboard from: {DASHBOARD_DIR}")
    print(f"[+] Docs directory linked: {os.path.join(WORKSPACE_DIR, 'docs')}")
    print(f"[+] Local URL: {url}")
    print("=" * 70)
    print("Press Ctrl+C to stop the server.\n")

    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[-] Dashboard server stopped.")
            sys.exit(0)

if __name__ == "__main__":
    main()
