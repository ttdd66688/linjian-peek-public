# 掌心窗公开版安装测试流程

## 1. 部署 server

在 `server` 目录准备环境变量：

```env
LINJIAN_TOKEN=你的长随机token
LINJIAN_HOST=0.0.0.0
LINJIAN_PORT=8513
LINJIAN_KEEP=3
```

本地启动：

```bash
cd server
python3 linjian_server.py
```

公网使用时建议 HTTPS。Render 手动部署可填：

```text
Root Directory: server
Build Command: 留空 或 echo ok
Start Command: python linjian_server.py
```

## 2. 构建 APK

上传 GitHub 后运行 Actions：`Build Android Debug APK`，下载 artifact 里的 APK。

## 3. 手机端

1. 安装 APK。
2. 填服务器地址和 Token。
3. 设备 ID 默认 `android-phone`。
4. 开启无障碍服务与通知权限。
5. 回 App 点“启动”。
6. 点“测试截图上传”。

## 4. 本地请求截图

```bash
cd server
python3 peek.py --wait --save latest.jpg
```

失败时优先检查 URL、Token、无障碍服务、手机端是否启动，以及免费服务是否休眠。
