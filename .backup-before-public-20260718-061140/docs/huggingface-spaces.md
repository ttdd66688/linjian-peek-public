# Hugging Face Spaces 部署教程（Render 绑卡替代方案）

这份教程给不想绑 Render 卡、或 Render Free 账号仍提示绑卡验证的用户使用。

掌心窗原本在 Render 上会创建两个服务：

- `server`：Python 手机后端，Android App 填这个裸地址。
- `mcp`：Node MCP 服务，GPT / MCP 客户端填这个地址 + `/mcp`。

Hugging Face Spaces 版把两者合进一个 Docker Space：

- 外部只暴露一个地址：`https://用户名-Spacename.hf.space`
- Android App 填这个裸地址。
- GPT / MCP 客户端填这个地址 + `/mcp`。
- 旧 SSE 客户端填这个地址 + `/sse`。

## 第一步：创建 Space

1. 登录 Hugging Face。
2. 点击 `+ New Space`。
3. Space name 随便取，例如：`palm-window`。
4. SDK 选择 `Docker`。
5. Hardware 选择 `CPU Basic / Free`。
6. Visibility 建议先选 `Private` 或 `Protected`，熟悉后再决定是否公开。
7. 创建 Space。

## 第二步：上传代码

把本仓库 ZIP 解压后，将所有文件上传到 Space 的 Files 页面。

必须确保 Space 根目录能看到这些文件：

```text
README.md
Dockerfile
start_hf.sh
server/linjian_server.py
mcp/server.js
mcp/package.json
```

也可以用 git 把整个仓库推送到 Hugging Face Space。

## 第三步：设置 Secret 和 Variables

进入 Space 的：

```text
Settings → Variables and secrets
```

添加 Secret：

```text
LINJIAN_TOKEN = 你自己生成的一串长密钥，建议 32 位以上
```

添加 Variable：

```text
LINJIAN_DEFAULT_DEVICE = my-phone
LINJIAN_KEEP = 3
```

`LINJIAN_TOKEN` 是手机 App、后端、MCP 之间的通行证，不要发给别人，不要提交到仓库，不要截图公开。

生成随机 token 示例：

```bash
python3 - <<'TOKENPY'
import secrets
print(secrets.token_urlsafe(32))
TOKENPY
```

## 第四步：等待构建完成

上传后 Hugging Face 会自动 Build Docker 镜像。

构建完成后测试：

```text
https://你的用户名-你的Space名.hf.space/health
```

如果看到类似：

```json
{"ok": true, "service": "linjian-unified"}
```

说明 Python 手机后端成功。

再测试：

```text
https://你的用户名-你的Space名.hf.space/mcp_health
```

如果看到类似：

```json
{"ok": true, "service": "linjian-unified-mcp"}
```

说明 MCP 服务成功。

## Android App 填法

```text
Server URL = https://你的用户名-你的Space名.hf.space
Token = LINJIAN_TOKEN 那串密钥
Device ID = my-phone
```

注意：Android App 填裸地址，不要加 `/health`，不要加 `/mcp`。

## GPT / MCP 客户端填法

新版 MCP：

```text
https://你的用户名-你的Space名.hf.space/mcp
```

旧 SSE：

```text
https://你的用户名-你的Space名.hf.space/sse
```

## 常见问题

### 1. `/health` 打不开

Space 可能还在 Build，或者免费硬件睡眠中。先打开 Space 页面等它醒来，再刷新 `/health`。

### 2. `/health` 能打开，但手机连不上

检查三项：

```text
Server URL 是否少了 https://
Token 是否和 Space Secret 完全一致
Device ID 是否是 my-phone
```

### 3. MCP 能添加，但工具调用失败

先打开：

```text
https://你的用户名-你的Space名.hf.space/mcp_health
```

看 `has_token` 是否为 `true`。

如果 `has_token: false`，说明没有设置 `LINJIAN_TOKEN` Secret，或者设置后没有重启 Space。

### 4. 截图/状态突然没了

免费 Space 的本地临时数据可能在容器重启后丢失。重新打开手机 App，让它重新上传状态即可。

### 5. 可以多人共用一个 Space 吗？

不建议。掌心窗涉及截图、手机状态和控制命令，每个人都应该用自己的 Space、自己的 Token、自己的 Device ID。

## 给小红书用户的简短版

```text
如果 Render 选 Free 也要求绑卡，可以试 Hugging Face Spaces：
1. New Space → SDK 选 Docker → CPU Basic Free
2. 上传 ZIP 解压后的全部文件
3. Settings 添加 Secret：LINJIAN_TOKEN=自己的长密钥
4. 等 Build 完成，打开 /health 测试
5. 手机 App 填 Space 裸地址 + 同一个 Token + Device ID=my-phone
6. ChatGPT / MCP 地址填 Space 地址 + /mcp
```
