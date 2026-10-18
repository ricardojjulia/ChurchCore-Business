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
import json
import webbrowser
import html
import urllib.parse
import threading
import time
from deliberation_engine import (
    handle_deliberation,
    get_engine_status,
    save_engine_config,
    test_engine_connection
)

PORT = 3333
DASHBOARD_DIR = os.path.dirname(os.path.abspath(__file__))
WORKSPACE_DIR = os.path.dirname(DASHBOARD_DIR)

sys.path.insert(0, os.path.join(WORKSPACE_DIR, 'scripts'))
import importlib.util
sync_script = os.path.join(WORKSPACE_DIR, 'scripts', 'control-plane-sync.py')
try:
    spec = importlib.util.spec_from_file_location("control_plane_sync", sync_script)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    sync_control_plane = getattr(mod, "sync_control_plane", None)
    get_edge_timestamps = getattr(mod, "get_edge_timestamps", None)
except Exception as e:
    print(f"[-] Warning: Failed to load control-plane-sync: {e}")
    sync_control_plane = None
    get_edge_timestamps = None

class TelemetryWatcherThread(threading.Thread):
    def __init__(self, interval=15):
        super().__init__(daemon=True)
        self.interval = interval
        self.running = True
        self.last_stamps = {}

    def run(self):
        if not get_edge_timestamps or not sync_control_plane:
            return
        time.sleep(3)  # brief initial delay
        try:
            self.last_stamps = get_edge_timestamps()
        except Exception:
            self.last_stamps = {}

        while self.running:
            time.sleep(self.interval)
            try:
                curr = get_edge_timestamps()
                changed = [pid for pid, ts in curr.items() if self.last_stamps.get(pid) != ts]
                if changed:
                    print(f"\n[⚡ TELEMETRY WATCHER] Detected new incoming telemetry from: {', '.join(changed)}")
                    self.last_stamps = curr
                    sync_control_plane(verbose=False)
                    print(f"[⚡ TELEMETRY WATCHER] Successfully digested incoming telemetry into fleet-data.json.\n")
            except Exception as e:
                pass


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

        # Engine status endpoint
        if clean_path == '/api/engine-status':
            status = get_engine_status()
            resp_bytes = json.dumps(status).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(resp_bytes)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(resp_bytes)
            return

        # Fleet Telemetry Ingestion & Status endpoints
        if clean_path in ['/api/sync-telemetry', '/api/digest-telemetry']:
            result = {'success': False}
            if sync_control_plane:
                try:
                    payload = sync_control_plane(verbose=False)
                    result = {
                        'success': True,
                        'message': 'Telemetry successfully digested across all 6 product pillars.',
                        'generated_at': payload.get('generated_at') if payload else None,
                        'summary': payload.get('summary') if payload else None
                    }
                except Exception as e:
                    result = {'success': False, 'error': str(e)}
            else:
                result = {'success': False, 'error': 'Control plane sync engine not loaded'}
            resp_bytes = json.dumps(result).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(resp_bytes)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(resp_bytes)
            return

        if clean_path == '/api/fleet-status':
            fleet_file = os.path.join(DASHBOARD_DIR, 'fleet-data.json')
            status = {'status': 'unknown'}
            if os.path.exists(fleet_file):
                try:
                    with open(fleet_file, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        status = {
                            'status': 'ok',
                            'generated_at': data.get('generated_at'),
                            'summary': data.get('summary', {})
                        }
                except Exception as e:
                    status = {'status': 'error', 'error': str(e)}
            resp_bytes = json.dumps(status).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(resp_bytes)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(resp_bytes)
            return

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

    def do_POST(self):
        clean_path = self.path.split('?', 1)[0].split('#', 1)[0]
        if clean_path in ['/api/sync-telemetry', '/api/digest-telemetry']:
            result = {'success': False}
            if sync_control_plane:
                try:
                    payload = sync_control_plane(verbose=False)
                    result = {
                        'success': True,
                        'message': 'Telemetry successfully digested across all 6 product pillars.',
                        'generated_at': payload.get('generated_at') if payload else None,
                        'summary': payload.get('summary') if payload else None
                    }
                except Exception as e:
                    result = {'success': False, 'error': str(e)}
            else:
                result = {'success': False, 'error': 'Control plane sync engine not loaded'}
            resp_bytes = json.dumps(result).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(resp_bytes)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(resp_bytes)
            return

        if clean_path in ['/api/deliberate', '/api/save-config', '/api/test-connection']:
            try:
                content_length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(content_length).decode('utf-8')
                req_data = json.loads(body) if body else {}

                if clean_path == '/api/deliberate':
                    result = handle_deliberation(req_data)
                elif clean_path == '/api/save-config':
                    result = save_engine_config(req_data)
                elif clean_path == '/api/test-connection':
                    api_key = req_data.get('api_key')
                    pro_model = req_data.get('pro_model')
                    flash_model = req_data.get('flash_model')
                    result = test_engine_connection(api_key, pro_model, flash_model)
                else:
                    result = {'success': False, 'error': 'Unknown route'}

                resp_bytes = json.dumps(result).encode('utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Content-Length', str(len(resp_bytes)))
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(resp_bytes)
                return
            except Exception as e:
                err_bytes = json.dumps({'success': False, 'error': str(e)}).encode('utf-8')
                self.send_response(500)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Content-Length', str(len(err_bytes)))
                self.end_headers()
                self.wfile.write(err_bytes)
                return

        self.send_error(404, "Endpoint not found")

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

    # Start continuous background telemetry watcher
    watcher = TelemetryWatcherThread(interval=15)
    watcher.start()
    print("[+] Continuous telemetry watcher thread started (15s polling).")
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
