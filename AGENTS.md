## Project Overview

Astro site visualizing Chinese national reference datasets:

- `/majors` — 2026 本科专业目录 (883 undergraduate majors), data from `src/data/majors-2026.json`
- `/industry` — 国民经济行业分类 (GB/T 4754—2017), data from `src/data/industry.js` (exports `DATA`)
- `/occupations` — 职业分类大典 (2022 年版, 8/79/450/1639), data from `src/data/occupations-2022.json`

## Structure

- `src/pages/` — routes: `index.astro`, `majors.astro`, `industry.astro`, `occupations.astro`（薄页面：静态 hero/footer + island）
- `src/layouts/Layout.astro` — shared HTML shell; pages pass `title`, content is Chinese (`lang="zh-CN"`)
- `src/components/majors/`, `src/components/industry/`, `src/components/occupations/` — React island 组件（`client:visible` 挂载），交互逻辑集中在 island 内，数据由组件直接 import `src/data/`（避免 props 序列化）
- `src/styles/` — 页面级全局 CSS，按页面前缀命名（`majors-*.css` 用 `.mj-page` 命名空间，`industry-*.css` 用 `.ind-page`，`occupations-*.css` 用 `.occ-page`）；React 渲染的 DOM 不受 Astro scoped style 影响，必须用这些全局样式
- `src/data/` — datasets imported directly by pages (JSON import / named ESM export)
- `.input/` — raw source material only (official PDF, extracted JSON, `pdf_to_json.py` / `occupation_pdf_to_json.py` extraction scripts); not imported by the app — treat as read-only inputs

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Conventions

- 代码单文件不得超过 300 行（手写代码 `.astro`/`.ts`/`.js` 等）。超出时拆分为组件或提取样式/工具模块；`src/data/` 与 `.input/` 中的机器生成数据文件不受此限制
- Package manager is pnpm (`pnpm-lock.yaml`); Node >= 22.23.4
- React 集成：`@astrojs/react`（配置在 `astro.config.mjs`，JSX 设置在 `tsconfig.json`）；island 一律 `client:visible`
- TypeScript strict mode via `astro/tsconfigs/strict`; typecheck with `pnpm typecheck`（`tsc --noEmit --runExternalCode`，经 `@astrojs/ts-content-mapper` 支持 `.astro` 文件；需 TypeScript 7.1+，`astro check` 已废弃不再使用）
- Data files in `src/data/` are machine-generated single-line files (`industry.js` is ~800KB+) — never reformat or hand-edit them; modify programmatically or regenerate
- `industry.js` uses short field names: `c` code, `n` name, `d` description, `ch` children
- Dataset TypeScript interfaces are declared in page frontmatter (see `Major`/`Category` in `src/pages/majors.astro`)

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
