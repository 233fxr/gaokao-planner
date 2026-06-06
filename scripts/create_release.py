import json, os, subprocess, urllib.request
from pathlib import Path

ROOT = Path(r"C:\Users\方向容\Documents\教育方案改进和工程项目")
OUT_DIR = ROOT / "_release"

# Get token
result = subprocess.run(
    ["git", "credential-manager", "get"],
    input="protocol=https\nhost=github.com\n",
    capture_output=True, text=True, timeout=10
)
token = ""
for line in result.stdout.splitlines():
    if line.startswith("password="):
        token = line.split("=", 1)[1]
        break
if not token:
    print("ERROR: no token found"); exit(1)

headers = {
    "Authorization": f"Bearer {token}",
    "Accept": "application/vnd.github+json"
}

version = "1.0"
tag = f"v{version}"

# Tag and push
subprocess.run(["git", "tag", "-f", tag], cwd=str(ROOT), capture_output=True)
subprocess.run(["git", "push", "origin", "-f", tag], cwd=str(ROOT), capture_output=True)
print(f"Tag {tag} pushed")

# Create release
release_body = (
    "## WuHua-note v1.0\n\n"
    "高三复习物化资料搜索工具。\n\n"
    "### 使用方法\n\n"
    "1. 下载对应系统的压缩包\n"
    "2. 解压\n"
    "3. 双击启动脚本（Windows 下启动.bat / Mac 下启动.command）即可打开搜索工具\n\n"
    "### 当前内容\n\n"
    "- 化学一轮复习：33 个专题\n"
    "- 物理一轮复习：29 个专题\n\n"
    "内置全文搜索，支持按学科筛选。"
)

req = urllib.request.Request(
    "https://api.github.com/repos/233fxr/WuHua-note/releases",
    data=json.dumps({
        "tag_name": tag,
        "name": f"v{version}",
        "body": release_body,
        "draft": False,
        "prerelease": False
    }).encode("utf-8"),
    headers=headers, method="POST"
)
resp = urllib.request.urlopen(req)
release = json.loads(resp.read())
upload_url = release["upload_url"].replace("{?name,label}", "")
print(f"Release created: {release['html_url']}")

# Upload assets
for zip_file in sorted(OUT_DIR.glob("*.zip")):
    fname = zip_file.name
    print(f"Uploading {fname}...")
    with open(zip_file, "rb") as f:
        data = f.read()
    upload_req = urllib.request.Request(
        f"{upload_url}?name={urllib.request.quote(fname)}",
        data=data,
        headers={**headers, "Content-Type": "application/zip"},
        method="POST"
    )
    upload_resp = urllib.request.urlopen(upload_req)
    asset = json.loads(upload_resp.read())
    print(f"  ok {asset['name']} ({asset['size']/1024:.0f} KB) uploaded")

print()
print("Done! Release ready at:")
print(f"  https://github.com/233fxr/WuHua-note/releases/tag/{tag}")
