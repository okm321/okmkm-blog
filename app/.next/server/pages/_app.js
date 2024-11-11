const CHUNK_PUBLIC_PATH = "server/pages/_app.js";
const runtime = require("../chunks/ssr/[turbopack]_runtime.js");
runtime.loadChunk("server/chunks/ssr/[root of the server]__ddc1d3._.js");
module.exports = runtime.getOrInstantiateRuntimeModule("[project]/node_modules/.pnpm/next@15.0.3_@babel+core@7.26.0_react-dom@19.0.0-rc-66855b96-20241106_react@19.0.0-rc-66855b96_qmpdxapguychwnubwftzlbicmm/node_modules/next/app.js [ssr] (ecmascript)", CHUNK_PUBLIC_PATH).exports;
