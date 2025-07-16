import os
import sys
import subprocess

from config.config import settings

PLIST_TEMPLATE = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.browserbrain.backend</string>
    <key>ProgramArguments</key>
    <array>
        <string>{python_path}</string>
        <string>{source_path}</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>WorkingDirectory</key>
    <string>{working_dir}</string>
    <key>StandardOutPath</key>
    <string>{log_path}</string>
    <key>StandardErrorPath</key>
    <string>{err_path}</string>
</dict>
</plist>
"""

def setup_launchd():
    main_dir = settings.main_dir
    if not os.path.exists(main_dir):
        os.makedirs(main_dir, exist_ok=True)
        print(f"Created main directory at {main_dir}")

    user_home = os.path.expanduser("~")
    python_path = sys.executable
    source_path = os.path.abspath(os.path.join(user_home, "repos", "browser-brain", "backend", "src", "main.py"))
    working_dir = os.path.abspath(os.path.join(user_home, "repos", "browser-brain", "backend"))
    log_path = os.path.join(main_dir, "browserbrain.log")
    err_path = os.path.join(main_dir, "browserbrain.err")
    plist_path = os.path.join(user_home, "Library", "LaunchAgents", "com.browserbrain.backend.plist")

    plist_content = PLIST_TEMPLATE.format(
        python_path=python_path,
        source_path=source_path,
        working_dir=working_dir,
        log_path=log_path,
        err_path=err_path
    )

    # Write the plist file
    os.makedirs(os.path.dirname(plist_path), exist_ok=True)
    with open(plist_path, "w") as f:
        f.write(plist_content)
    print(f"Plist written to {plist_path}")

    # Unload the launch agent if it exists
    subprocess.run(["launchctl", "unload", plist_path])

    # Load the launch agent
    subprocess.run(["launchctl", "load", plist_path])
    print("Launch agent loaded. Your backend will now run on login.")

if __name__ == "__main__":
    setup_launchd()