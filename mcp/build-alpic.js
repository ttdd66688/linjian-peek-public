import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.join(here, "server.js");
const distDir = path.join(here, "dist");
const outputPath = path.join(distDir, "server.js");

let source = fs.readFileSync(sourcePath, "utf8");

source = `import crypto from "node:crypto";\n${source}`;

const configAnchor =
  'const DEFAULT_DEVICE = process.env.LINJIAN_DEFAULT_DEVICE || "android-phone";';

const configReplacement = `${configAnchor}
const PUBLIC_BASE_URL = (process.env.PUBLIC_BASE_URL || "https://linjian-peek-public-d13e9508.alpic.live").replace(/\\/$/, "");
const SCREEN_LINK_TTL_MS = 5 * 60 * 1000;

function screenLinkSignature(expires) {
  return crypto
    .createHmac("sha256", LINJIAN_TOKEN)
    .update(\`latest-screen:\${expires}\`)
    .digest("hex");
}

function buildScreenLink() {
  const expires = Date.now() + SCREEN_LINK_TTL_MS;
  const sig = screenLinkSignature(expires);
  return \`\${PUBLIC_BASE_URL}/latest-image?expires=\${expires}&sig=\${sig}\`;
}

function validScreenLink(expiresRaw, sigRaw) {
  const expires = Number(expiresRaw || 0);
  const sig = String(sigRaw || "");
  if (
    !LINJIAN_TOKEN ||
    !Number.isFinite(expires) ||
    expires < Date.now() ||
    expires > Date.now() + SCREEN_LINK_TTL_MS + 60000
  ) return false;

  const expected = screenLinkSignature(expires);
  if (sig.length !== expected.length) return false;

  return crypto.timingSafeEqual(
    Buffer.from(sig),
    Buffer.from(expected)
  );
}`;

if (!source.includes(configAnchor)) {
  throw new Error("Could not find DEFAULT_DEVICE anchor");
}

source = source.replace(configAnchor, configReplacement);

const peekOld = `          const img = await fetchLatestImage();
          return { content: [
            { type: "text", text: \`掌心窗已收到新截图：\${info.filename || "latest"}，大小约 \${info.size || img.bytes} bytes。\` },
            { type: "image", data: img.data, mimeType: img.mimeType }
          ] };`;

const peekNew = `          const link = buildScreenLink();
          return { content: [
            {
              type: "text",
              text: \`掌心窗已收到新截图：\${info.filename || "latest"}，大小约 \${info.size || "unknown"} bytes。图片链接（5 分钟内有效）：\${link}\`
            }
          ] };`;

if (!source.includes(peekOld)) {
  throw new Error("Could not find peek_screen image block");
}

source = source.replace(peekOld, peekNew);

const latestOld = `  server.tool("latest_screen", "不敲门，直接读取服务器里最近一次掌心窗截图。", {}, async () => {
    const info = await latestInfo(); const img = await fetchLatestImage();
    return { content: [
      { type: "text", text: \`最近截图：\${info.filename || "latest"}，时间戳 \${info.mtime || "unknown"}。\` },
      { type: "image", data: img.data, mimeType: img.mimeType }
    ] };
  });`;

const latestNew = `  server.tool("latest_screen", "不敲门，直接读取服务器里最近一次掌心窗截图。", {}, async () => {
    const info = await latestInfo();
    const link = buildScreenLink();
    return {
      content: [
        {
          type: "text",
          text: \`最近截图：\${info.filename || "latest"}，时间戳 \${info.mtime || "unknown"}。图片链接（5 分钟内有效）：\${link}\`
        }
      ]
    };
  });`;

if (!source.includes(latestOld)) {
  throw new Error("Could not find latest_screen image block");
}

source = source.replace(latestOld, latestNew);

const listenAnchor =
  'app.listen(PORT, "0.0.0.0", () => { console.log(`掌心窗 unified MCP listening on 0.0.0.0:${PORT}`); console.log(`LINJIAN_URL=${LINJIAN_URL || "<missing>"}`); });';

const routeAndListen = `app.get("/latest-image", async (req, res) => {
  if (!validScreenLink(req.query.expires, req.query.sig)) {
    return res.status(403).json({
      ok: false,
      error: "invalid_or_expired_link"
    });
  }

  try {
    const upstream = await linjianFetch("/api/latest");
    const contentType =
      upstream.headers.get("content-type") || "image/jpeg";
    const body = Buffer.from(await upstream.arrayBuffer());

    res.set("Cache-Control", "no-store");
    res.type(contentType).send(body);
  } catch (err) {
    console.error(err);
    res.status(502).json({
      ok: false,
      error: String(err?.message || err)
    });
  }
});

${listenAnchor}`;

if (!source.includes(listenAnchor)) {
  throw new Error("Could not find app.listen anchor");
}

source = source.replace(listenAnchor, routeAndListen);

fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(outputPath, source, "utf8");
fs.copyFileSync(
  path.join(here, "package.json"),
  path.join(distDir, "package.json")
);

console.log("Built Alpic-compatible MCP into mcp/dist");
