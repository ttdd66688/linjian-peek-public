# Render 一键部署掌心窗

这个仓库支持用 Render Blueprint 一键创建两项服务：

1. `linjian-peek-server`：手机 App 连接的 Python 后端。
2. `linjian-peek-mcp`：GPT / MCP 客户端连接的 Node MCP 服务。

## 一键部署

点击 README 顶部的 **Deploy to Render** 按钮，或打开：

```text
https://dashboard.render.com/blueprint/new?repo=https://github.com/linzhi-524/linjian-peek-public
```

部署页建议这样填：

```text
Blueprint Name：随便取，例如 linjian-peek
Branch：main
Blueprint Path：留空
```

`Blueprint Path` 留空即可，Render 默认读取仓库根目录的 `render.yaml`。

## 部署完成后复制哪些链接

部署完成后会出现两个 Web Service。

### 1. Server 地址：填到 Android App

打开 `linjian-peek-server`，复制它的 `.onrender.com` 地址，例如：

```text
https://linjian-peek-server-xxxx.onrender.com
```

Android App 里填写：

```text
Server URL：https://linjian-peek-server-xxxx.onrender.com
Device ID：my-phone
Token：LINJIAN_TOKEN
```

### 2. MCP 地址：填到 GPT / MCP 客户端

打开 `linjian-peek-mcp`，复制它的 `.onrender.com` 地址，然后加 `/mcp`：

```text
https://linjian-peek-mcp-xxxx.onrender.com/mcp
```

旧版只支持 SSE 的客户端可试：

```text
https://linjian-peek-mcp-xxxx.onrender.com/sse
```

## Token 在哪里

`render.yaml` 会在 `linjian-peek-server` 上自动生成 `LINJIAN_TOKEN`，`linjian-peek-mcp` 会引用同一串 token。

你需要在 Render 的 `linjian-peek-server` 服务里打开：

```text
Environment → LINJIAN_TOKEN
```

把这串 token 填进 Android App。不要公开它，不要提交到仓库。

如果你看不到生成值，直接把 `linjian-peek-server` 的 `LINJIAN_TOKEN` 改成自己生成的长随机密钥，然后保存并 redeploy；MCP 服务会继续引用 server 的同名环境变量。

生成随机 token 示例：

```bash
python3 - <<'PY'
import secrets
print(secrets.token_urlsafe(32))
PY
```

## 检查是否部署成功

Server 健康检查：

```text
https://linjian-peek-server-xxxx.onrender.com/health
```

MCP 健康检查：

```text
https://linjian-peek-mcp-xxxx.onrender.com/health
```

MCP 工具地址：

```text
https://linjian-peek-mcp-xxxx.onrender.com/mcp
```

## 免费实例提醒

Render Free 实例长时间没人访问会休眠。第一次打开可能会慢几十秒，这是正常现象。

## 不要做的事

- 不要公开 `LINJIAN_TOKEN`。
- 不要把 MCP 地址和 token 发到公开平台。
- 不要连接不是你本人授权的手机。
- 不要默认对聊天、支付、验证码、钱包等敏感页面截图或点击。
