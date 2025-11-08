# LightEats H5

LightEats H5 是一个一体化的轻食减脂方案平台，包含用户端 H5、商家后台以及管理端工具。项目支持 AI 自动生成个性化食谱，并提供商品映射、购物车与模拟支付功能，可通过 Docker 快速部署。

## 特性

- ⚛️ **React 18 + Vite + TypeScript** 构建移动端 H5，集成 TailwindCSS 与 Headless UI。
- 🧠 **AI 食谱生成**：优先调用 OpenAI 兼容接口，缺省时使用规则回退算法保证可用性。
- 🛒 **全流程体验**：商品浏览、购物车、下单与模拟支付；商家入驻、上架管理与订单概览；管理员审核与类目管理。
- 🧾 **MongoDB + Mongoose** 数据建模，提供脚本快速初始化示例数据。
- 🐳 **Docker Compose** 一键启动 Web、API、MongoDB；同时提供 Vercel / Render 部署提示。
- ✅ **ESLint + Prettier** 保障代码风格一致。

## 目录结构

```
.
├── README.md
├── package.json
├── pnpm-lock.yaml
├── .editorconfig
├── .gitignore
├── docker-compose.yml
├── Dockerfile.web
├── Dockerfile.api
├── .env.sample
├── apps/
│   ├── web/
│   └── api/
└── scripts/
    ├── seed.ts
    └── dev-all.sh
```

## 快速开始

### 1. 环境准备

- Node.js >= 18
- pnpm >= 8
- 本地 MongoDB（或使用 Docker 内置服务）

复制环境变量模板：

```bash
cp .env.sample .env
```

关键变量：

| 变量 | 描述 | 默认 |
| --- | --- | --- |
| `MONGO_URL` | MongoDB 连接串 | `mongodb://localhost:27017/lighteats` |
| `JWT_SECRET` | JWT 签名密钥 | `dev-secret` |
| `OPENAI_API_KEY` | OpenAI 或兼容服务密钥 | *为空时自动回退规则算法* |
| `PORT` | API 服务端口 | `4000` |
| `WEB_PORT` | Web 前端端口 | `5173` |
| `ENABLE_AUTO_MERCHANT_APPROVE` | 是否自动审核商家 | `true` |

### 2. 安装依赖

```bash
pnpm install
```

### 3. 启动开发环境

```bash
pnpm -w dev
```

等价于执行 `scripts/dev-all.sh`：

```bash
sh scripts/dev-all.sh
```

访问：

- Web 前端：http://localhost:5173
- API 服务：http://localhost:4000/api/health

### 4. 初始化示例数据

```bash
pnpm --filter api exec ts-node scripts/seed.ts
```

执行后将创建：

- 样例用户、商家、类目标签
- 20+ 热门轻食商品
- 样例食谱与订单

### 5. Docker 运行

```bash
docker compose up --build
```

服务说明：

- `web`：Vite 前端（端口 5173）
- `api`：Express API（端口 4000）
- `mongo`：MongoDB（端口 27017）

> 默认会挂载 `./apps/api/.env` 和数据卷 `mongo_data`，首次启动后可执行 `docker compose exec api pnpm exec ts-node scripts/seed.ts` 初始化数据。

## 部署说明

### Vercel（Web）

1. 选择 `apps/web` 作为项目根目录。
2. Build Command：`pnpm install --frozen-lockfile && pnpm build`
3. Output：`dist`
4. 环境变量：`VITE_API_BASE_URL=https://your-api-domain`。

### Render / Railway（API）

1. 选择 `apps/api` 目录部署。
2. Build Command：`pnpm install --frozen-lockfile && pnpm build`
3. Start Command：`pnpm start`
4. 配置环境变量 `MONGO_URL`、`JWT_SECRET`、`OPENAI_API_KEY`（可选）。

### Docker 手动部署

```bash
docker build -f Dockerfile.api -t lighteats-api .
docker build -f Dockerfile.web -t lighteats-web .
```

部署至任意容器平台后，记得设置同样的环境变量并将前端 `VITE_API_BASE_URL` 指向后端域名。

## 脚本说明

| 脚本 | 作用 |
| --- | --- |
| `scripts/dev-all.sh` | 并行启动 Web 与 API 开发服务器（默认使用本地 MongoDB） |
| `scripts/seed.ts` | 初始化示例类目、商家、商品、食谱与订单 |

## 常见问题

1. **端口占用**：默认使用 `5173`（Web）和 `4000`（API）；如被占用可修改 `.env` 或启动命令。
2. **CORS**：API 已开放 `http://localhost:5173`；部署时请在 `config.corsOrigins` 中添加域名。
3. **图片存储**：仓库内仅保留示例图片 URL，生产环境建议接入对象存储（如 OSS、COS）或 CDN。
4. **AI 密钥缺失**：无 `OPENAI_API_KEY` 时，会使用规则算法生成结构化食谱并进行商品映射。
5. **MongoDB 未启动**：请确保本地或 Docker 中的 MongoDB 已运行，或在 `.env` 中指定云端连接。

## 贡献指南

- 运行 `pnpm lint` 确保代码符合 ESLint 规范。
- 提交前请执行 `pnpm test`（预留命令，可扩展单元测试）。

Enjoy building with LightEats! 🍽️
