# 掌心窗 Palm Window MCP · v0.1.8 Public Clean

一个自部署的手机状态、截图与轻控制 MCP 工具。它由三部分组成：

- `android/`：Android 手机端 App，负责在用户明确授权后上传轻量生活状态、执行截图/返回/主页/打开 App/点击/滑动/通知/闹钟等命令。
- `server/`：零依赖 Python 后端，负责保存最近截图、命令队列、命令回传和手机生活状态。
- `mcp/`：MCP 服务，把后端能力暴露给支持 MCP 的 AI 客户端。

公开版已做脱敏处理：不包含真实 Token、服务器地址、个人设备 ID 或私人文案。请自行部署、设置强随机密钥，并只连接自己的设备。

## 能做什么

- **轻量状态**：电量、充电状态、网络、屏幕亮灭、当前 App、今日屏幕时间、解锁次数、Top App、城市/天气备注、权限状态。
- **看见**：AI 端请求截图，手机端在授权服务运行时截图并上传。
- **控制**：打开白名单 App、返回、主页、最近任务、点击、滑动。
- **提醒**：发送系统通知、设置系统闹钟。
- **主动提醒**：在手机本机根据规则弹通知，包括低电量、屏幕时长、喝水、休息眼睛、生理期临近/进行中。

## 安全边界

这些能力很敏感。公开版默认强调“用户自己部署、自己授权、自己设备使用”。

- 不要把真实 `LINJIAN_TOKEN` 提交到仓库。
- 不要把 MCP 服务公开给陌生人使用。
- 截图、读屏、点击、滑动只应在本人明确知情和授权的设备上使用。
- 生活状态层默认不截图，只上传轻量状态。
- 建议对支付、聊天、钱包、验证码等敏感页面保持谨慎，不要默认自动截图或自动点击。
- 支付、下单、删除、发送消息等高风险动作应始终由用户最终确认。

## 快速部署

### 1. 后端 Server

在 Render / VPS / 本机启动 `server/linjian_server.py`。

环境变量示例：

```bash
LINJIAN_TOKEN=请换成长随机密钥
LINJIAN_KEEP=3
PORT=8513
```

Render 建议：

- Root Directory: `server`
- Build Command: 留空或 `echo ok`
- Start Command: `python linjian_server.py`
- Env: `LINJIAN_TOKEN`

### 2. MCP 服务

```bash
cd mcp
npm install
npm start
```

环境变量示例：

```bash
LINJIAN_URL=https://你的后端地址.onrender.com
LINJIAN_TOKEN=和后端完全相同的 token
LINJIAN_DEFAULT_DEVICE=my-phone
```

Render 建议：

- Root Directory: `mcp`
- Build Command: `npm install`
- Start Command: `npm start`
- Env: `LINJIAN_URL`、`LINJIAN_TOKEN`、`LINJIAN_DEFAULT_DEVICE`

### 3. Android APK

GitHub Actions 会构建 Debug APK。也可以在支持 Android SDK 的环境中运行：

```bash
bash android/build.sh
```

构建输出：

```text
android/PalmWindow-v0.1.8.apk
```

安装后在 App 内填写：

- Server URL：你的后端地址
- Token：后端同一串 `LINJIAN_TOKEN`
- Device ID：默认 `my-phone`，也可以自定义

然后开启无障碍服务、截图权限、通知权限、使用情况访问权限。

## MCP 工具

- `linjian_status`：检查后端在线状态。
- `get_life_state`：读取轻量生活状态，默认不截图。
- `get_phone_state`：读取最近手机状态。
- `peek_screen`：请求新截图并等待返回。
- `latest_screen`：读取服务器最近一次截图。
- `list_known_apps`：列出预置 App 包名白名单。
- `open_app`：打开指定 App 或包名。
- `phone_home` / `phone_back` / `phone_recents`：系统导航。
- `send_phone_command`：发送底层命令。
- `send_notification`：发送系统通知。
- `set_alarm`：设置系统闹钟。

## v0.1.8 功能点

- Life State 生活状态层。
- Active Reminder 主动提醒规则层。
- 生理期提醒状态与本机提醒。
- UI：设置 / 看见 / 控制 / 状态 / 日志 底部导航。
- 命令回传与日志页。

## 后续可以继续做

- 截图诊断字段：`screenshot_ready`、`last_screenshot_at`、`last_screenshot_error`。
- `peek_screen(delay_seconds=3)`：给用户切页面的延迟截图。
- OCR 歌词兜底：音乐 App 歌词页截图后识别当前歌词。
- 外卖/点餐参谋：只做选择辅助，付款和最终确认必须由用户完成。
- 更细的隐私白名单/黑名单。

