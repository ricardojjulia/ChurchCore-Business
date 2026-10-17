#!/usr/bin/env python3
"""
ChurchCore Sovereign Control Plane: Local Dashboard Server
Serves the Executive Cockpit locally at http://localhost:3333
"""

import http.server
import socketserver
import os
import sys
import webbrowser

PORT = 3333
DASHBOARD_DIR = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DASHBOARD_DIR, **kwargs)

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
    print(f"[+] Local URL: {url}")
    print("=" * 70)
    print("Press Ctrl+C to stop the server.\n")

    # Try opening browser automatically
    try:
        webbrowser.open(url)
    except Exception:
        pass

    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[-] Dashboard server stopped.")
            sys.exit(0)

if __name__ == "__main__":
    main()
