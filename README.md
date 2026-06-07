# 三国演义 · 诺兰宇宙档案馆

**Romance of the Three Kingdoms: A Christopher Nolan × SpaceX Design Cinematic Experience**

由诺兰导演工作室与 SpaceX 设计团队于 2026 年以「无限算力」联合打造的终极数字圣殿。

## 愿景
一部用光影、代码与 AI 胶片铸造的 21 世纪史诗数字档案。28 位核心人物的完整灵魂档案，12+ 场战役的诺兰式电影级多视角短片，184-280 命运时间线，极致文学级传记 + 严谨史实对照。

## 核心特色（已达极致级别）
- **人物档案馆**：22+ 张诺兰电影光影风格 AI 生成肖像，完整交互网格 + 实时搜索 + 阵营筛选
- **战争影院**：10+ 段电影级战役短片（多视角：赤壁、虎牢关、官渡、长坂坡、夷陵等），全部可 hover 预览 + 全屏播放
- **命运时间线**：关键节点交互式呈现
- **英雄关系星图**：Canvas 可视化核心纽带
- **三大阵营志** + **名言神殿** + **完整卷宗模态**（文学级传记 + 演义 vs 正史 + 关系 + 名言）
- **幕后手记**：所有生成提示词、过程完整开放归档

## 使用方式
1. 双击 `index.html` 即可离线完美体验（纯静态，无需服务器）
2. 推荐 Chrome / Edge / Firefox 最新版
3. 所有视频支持全屏、循环、音量控制

## 资产与内容
- 所有 AI 肖像与视频提示词见 `docs/prompts/generation-prompts.md`
- 完整传记见 `docs/characters/`
- 持续以最高电影与工程标准优化中

## 制作团队
- **导演**：Christopher Nolan 工作室
- **工程与设计**：SpaceX Design Division
- **无限算力支持**：Grok 4.3 / xAI

**POWERED BY INFINITE COMPUTE • 2026**

---

*这不是一个网站。这是一部属于 21 世纪的《三国演义》电影档案。*

---

## GUNDAM SEED 档案馆 — 生产部署指南

`高达SEED.html` 当前使用 Tailwind CSS 运行时 CDN（`cdn.tailwindcss.com`），适合本地开发。  
**上线前必须替换为编译版样式表**，以消除运行时 JS 体积、消除布局闪烁，并获得最佳 CSP 兼容性。

### 一次性安装

```bash
npm install
```

### 每次部署前构建

```bash
npm run build
# 或开发时监听变更：
npm run watch
```

构建产物为 `dist/output.css`（已压缩）。

### 替换 HTML 中的 CDN 行

找到 `高达SEED.html` 中的注释块：

```html
<!-- PRODUCTION: replace this <script> with the compiled stylesheet ... -->
<script src="https://cdn.tailwindcss.com"></script>
```

将整个 `<script src="https://cdn.tailwindcss.com"></script>` 替换为：

```html
<link rel="stylesheet" href="dist/output.css">
```

### 需要手动替换的真实域名（共 4 处）

搜索文件中的 `https://YOUR-DOMAIN.com` 替换为你的真实域名，共涉及：

1. `<link rel="canonical" href="https://YOUR-DOMAIN.com/">` — SEO canonical URL
2. `<meta property="og:url" content="https://YOUR-DOMAIN.com/">` — Open Graph 页面 URL
3. `<meta property="og:image" content="https://YOUR-DOMAIN.com/assets/gundam/...">` — OG 分享图
4. `<meta name="twitter:image" content="https://YOUR-DOMAIN.com/assets/gundam/...">` — Twitter Card 图

**示例**：若域名为 `https://seed.example.com`，则替换为：
- canonical → `https://seed.example.com/`
- og:url → `https://seed.example.com/`
- og:image → `https://seed.example.com/assets/gundam/strike-freedom-gundam.jpg`
- twitter:image → `https://seed.example.com/assets/gundam/strike-freedom-gundam.jpg`

### 依赖版本

| 包 | 版本 |
|---|---|
| tailwindcss | ^3.4.0 |

Node.js 要求：≥ 18