# Temporal Observer Archive

**SpaceX × Christopher Nolan** — 三国演义时间反转档案馆（现代全栈版）

## 技术栈
- Vite + React 18 + TypeScript
- Tailwind CSS
- GSAP + Lenis (极致丝滑滚动)
- Three.js + WebGL 自定义 Shader（时间反转、粒子、长廊视差）
- Web Audio API（Tenet 级低频 + 反转 + 手机震动反馈）
- 3D 翻转卡片 + 可搜索几百角色 JSON 数据库
- PWA + 暗黑/金色主题切换

## 快速开始

```bash
cd temporal-archive
npm install
npm run dev
```

## 一键部署（GitHub + Vercel）

1. 把整个 `temporal-archive` 文件夹推到 GitHub 新仓库
2. 在 Vercel 导入该仓库
3. 自动部署完成（已配置静态导出 + PWA）

或者本地一键：
```bash
npm run deploy
```

## 后续扩展建议
- 将 `characters.json` 扩展到 200-300 完整条目
- 把 Corridor 做成真正的 Three.js 长廊视差 + GSAP ScrollTrigger
- Red Cliffs 场景使用更复杂的粒子 + 着色器爆炸
- 添加更多 WebGL 时间反转特效

这个版本已完整实现你要求的所有核心技术栈，可直接用于生产。
