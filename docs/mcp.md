# 掌心窗 MCP 接入说明

这个目录提供独立 MCP 服务，可接入支持 MCP 的 AI 客户端。这里不限定必须使用某一家客户端。

## 架构

手机 App → 掌心窗 server → 掌心窗 MCP → AI 客户端

## Render 部署 MCP

新建 Render Web Service，连接同一个 GitHub 仓库。

```text
Root Directory: mcp
Build Command: npm install
Start Command: npm start
```

环境变量：

```text
LINJIAN_URL=https://你的掌心窗-server.onrender.com
LINJIAN_TOKEN=和 server 完全一样的 token
LINJIAN_DEFAULT_DEVICE=android-phone
```

连接地址：

```text
https://你的-mcp.onrender.com/mcp
```

如果客户端要求 SSE：

```text
https://你的-mcp.onrender.com/sse
```

## 常用工具

- `peek_screen`：请求新截图。
- `latest_screen`：读取最近截图。
- `linjian_status`：检查 MCP 与 server 是否连通。
- `get_life_state`：读取轻量状态。
- `open_app`：打开 App。
- `send_notification`：发送通知。
- `run_sequence`：执行多步动作。

## 注意

- MCP 服务持有 `LINJIAN_TOKEN`，不要公开给陌生人。
- 手机 App 必须启动，并开启无障碍权限。
- 免费服务休眠后，第一次请求可能要等几十秒。
