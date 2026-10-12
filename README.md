# SlivenNoxLab

个人数字技术实验室：自用效率工具台为核心，融合作品展示、日常笔记沉淀与技术成长记录。自用优先，顺便公开。

- 线上地址：https://umax.dpdns.org（部署见 [docs/DEPLOY.md](docs/DEPLOY.md)）
- 完整方案与决策记录：[PLAN.md](PLAN.md)

## 技术栈

| 层 | 选型 |
| --- | --- |
| 框架 | Astro 6（纯静态输出，零客户端框架） |
| 样式 | 原生 CSS 变量（设计 token 见 `src/styles/tokens.css`） |
| 内容 | Astro Content Collections（Markdown + zod schema） |
| 搜索 | Pagefind（构建时索引，原生中文分词） |
| 部署 | GitHub Actions → rsync → 阿里云 Nginx |

架构原则：**三层解耦**（页面组件 → `src/lib/data/` 数据访问层 → `src/content/` 数据源），页面组件禁止直接读取数据源；后续换后端/数据库只需改数据访问层。

## 快速开始

```bash
npm install          # Node 22+
npm run dev          # 本地开发 http://localhost:4321
npm run build        # 构建到 dist/
npm run preview      # 预览构建产物
npm run verify       # 构建 + 全量测试（交付前必须全绿）
```

## 文档导航

| 文档 | 内容 |
| --- | --- |
| [PLAN.md](PLAN.md) | 完整方案、决策记录、Roadmap |
| [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) | **开发手册**：架构、契约层、脚本生命周期、TDD 流程、历史事故清单 |
| [docs/DEPLOY.md](docs/DEPLOY.md) | 部署手册：服务器初始化、CI/CD、HTTPS、故障排查 |
| [docs/TESTING.md](docs/TESTING.md) | 测试分层与命令说明 |

## 内容管理（日常操作速查）

| 想做什么 | 怎么做 |
| --- | --- |
| 写笔记 | 后台 `/admin/` 写作发布，或 md 丢进 `src/content/notes/` |
| 加作品 | `src/content/projects/` 加 md（后台亦可） |
| 发摄影 | 照片丢进 `src/assets/photos/<相册slug>/`，中文名在 `src/config/…` 登记 |
| 加收藏/工具 | 编辑 `src/lib/data/favorites.json`（后台亦可） |
| 加笔记分类 | 编辑 `src/data/note-categories.json`（后台亦可） |
| 换音乐 | 音频放 `public/music/`，`src/lib/data/music.ts` 加一行 |
| 改导航 | 编辑 `src/config/nav.ts` |

构建即生效：本地 `npm run build`，线上 `git push`（CI 自动部署）。

## 目录结构

```
src/
  content/          # 数据源层：Markdown 集合（notes/projects/hotreads）
  lib/
    data/           # 数据访问层：页面组件唯一取数入口（禁止直接 getCollection）
    contracts/      # 契约层：引擎 API / DOM 选择器 / 事件名
    audio/          # 播放状态机（纯逻辑，有单测）
  components/
    ui/             # 通用组件（Reveal/SpotlightCard/灯箱/迷你条…）
    home/           # 首页区块
  layouts/          # BaseLayout（meta/导航/页脚/噪点/全局脚本）
  pages/            # 路由（/notes /projects /lab /favorites /photos /about）
  styles/           # tokens.css（设计 token）+ global.css
public/
  admin/            # Decap CMS 内容后台
  music/            # 音频（当前为程序合成示例）
tests/              # vitest 单测 + 构建产物契约测试
```

## 开发规范

- 新功能/修 bug 一律走 **TDD 循环**（红→绿→重构），详见 [docs/TESTING.md](docs/TESTING.md)；
- 跨组件接口先在 `src/lib/contracts/` 定义契约再实现；
- 提交前 `npm run verify` 必须全绿，另跑 `npx impeccable detect src/`（0 发现）；
- 视觉交付走查：`docs/TESTING.md` 第四节清单。

## License

GPL-3.0（见 LICENSE）。
