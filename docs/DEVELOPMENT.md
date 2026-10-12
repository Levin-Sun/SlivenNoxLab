# SlivenNoxLab 开发手册

> 面向接手或回溯本项目的开发者。读完本文 + [PLAN.md](../PLAN.md)，你应当能在不问前任的情况下安全地改任何一处代码。

---

## 一、架构总览：三层解耦

```
展示层   src/pages/** + src/components/**
            │  只允许调用 lib/data 的函数（ESLint 意识 + 代码评审把关）
数据访问层 src/lib/data/*.ts
            │  唯一数据入口：list/get/render 系列 async 函数
数据源层  src/content/**（Astro Content Collections + zod schema 校验）
          src/data/*.json（后台可编辑的结构化配置）
          src/config/*.ts（导航/站点/首页等静态配置）
```

**换数据源（加后端/数据库）时**：只重写 `lib/data/` 的内部实现，页面组件零改动。这是本项目的立站原则，任何 PR 违反此分层都会被拒绝。

**契约层 `src/lib/contracts/`**：跨组件的隐式约定全部显式化——

- `audio.ts`：NoxAudio 引擎 API、`noxaudio:state` 事件名、`wrapIndex`/`formatTime` 工具；
- `dom.ts`：全站 DOM 选择器常量 `SELECTORS`（组件渲染钩子与测试断言共用）。

改契约 = 必须同步全部消费方与 `tests/` 下的对应断言。

## 二、脚本生命周期（最容易踩坑的部分，三条铁律）

本站启用了 Astro **ClientRouter**（视图过渡路由）：页面切换不整页刷新，而是客户端换 DOM。这带来了"音乐跨页不断"的能力，也带来一套全新的脚本纪律：

### 铁律 1：内联脚本会随每次导航重新执行

页面里的 `<script>`（Astro 会内联）在**每次客户端导航到该页时都会重新跑一遍**。因此：

- 脚本内**不要**依赖"只执行一次"的假设去 `addEventListener`——对同一元素重复绑定 = 一次点击触发 N 次（真实事故：迷你条双绑定导致"播放即暂停"）；
- 正确姿势：绑定前检查幂等守卫（`el.dataset.bound` 或 `window` 级 flag），或确保绑定的元素每次都是新 DOM；
- 跨页需要持久的行为/状态，挂 `window` 或用 `transition:persist` 元素（见铁律 3）。

### 铁律 2：`transition:persist` 元素跨页存活

迷你播放条标记了 `transition:persist`：换页时元素从旧页搬运到新页，其上的监听器与 rAF 循环**保持活着**。所以：

- 持久元素上的绑定必须加**全局一次性守卫**（`window.noxMiniUI` flag），二次执行只刷新同步；
- 音频引擎（`window.NoxAudio`）是 JS 单例，音频元素**不在 DOM 里**——这是它跨页不断歌的根本原因。

### 铁律 3：动画循环必须能自停

所有 rAF 循环要检查"宿主是否还连着 DOM"（`el.isConnected`）或提供清理函数（`cleanupFns.push(() => cancelAnimationFrame(raf))`）。否则换页后旧循环在游离画布上空转（泄漏 + CPU 浪费）。

### 页面脚本标准骨架

```js
// 页面级脚本：随导航重跑；复杂循环用 cleanup 模式
const cleanups = [];
const initPage = () => {
  cleanups.splice(0).forEach((fn) => fn());   // 清理上一轮
  // ... 查询元素 / 绑定 / 启动循环，并把清理函数推入 cleanups
};
initPage();                                    // 首次（整页加载即执行）
document.addEventListener('astro:page-load', initPage); // 可选：换页兜底
```

> 注意：`initPage` 内若引用引擎等单例，注意初始化顺序（别的模块可能还没跑）。

## 三、契约与测试（TDD 流程）

见 [TESTING.md](TESTING.md)。要点：

1. **红**：先写测试断言期望行为；2. **绿**：最小实现；3. **重构**；4. `npm run verify` 全绿才能提交。

必须走 TDD 的：一切纯逻辑（状态机/数据转换/格式化/合并）；一切**曾经出过事故的区域**的改动（先补回归测试）。

构建产物契约测试（`tests/contract.dist.test.ts`）会在 `npm run verify` 时断言 dist 里关键 data-* 属性在位——历史上"属性缺失 = 交互静默失效"发生过，这就是交付关卡。

## 四、历史事故清单（交接必读——每个坑都真实踩过）

| # | 现象 | 根因 | 修复与预防 |
| --- | --- | --- | --- |
| 1 | 播放中跳页后歌停了 | ClientRouter 重执行页面脚本，迷你条对持久元素**重复绑定**（一次点击两次 toggle） | 绑定加 `window` 级一次性守卫；`transition:persist` 保证音频元素跨页存活 |
| 2 | 极光背景糊成一片渐变 | 初始化时测量 `display:none` 元素的 `clientWidth`（恒为 0），画布退化成 2×2 被拉伸 | 尺寸取**始终有布局的父容器**；ResizeObserver 兜底 |
| 3 | 光谱条伸出播放卡外 | 条形长度无上界 | 画布半径比例硬上界（`maxReach = 0.47w`），永不越界 |
| 4 | 律动堆在环顶不对称 | 低频重音源 + 对数映射把能量堆在低 bin | 高频补偿增益沿环线性提升 + 整圈缓慢旋转 |
| 5 | 极光流动快到频闪 | 时间单位混乱：着色器常数按秒设计，传入的是毫秒 | 契约：**着色器/动画时间一律秒**，入口处归一化 |
| 6 | 灯箱左右箭头装反 | prev/next 两组 SVG 路径复制时对调 | 图标来源统一 + 视觉走查清单含方向项 |
| 7 | 构建失败：括号不平衡/路径层级错 | 大段批量替换前未读全上下文 | 改大文件前先读目标区段；改完立即 build |
| 8 | deploy 首推就红 ❌ | `secrets` 上下文不能用于 job 级 `if` 表达式 | 守卫移入步骤内判断（`steps.guard.outputs.skip`） |
| 9 | 135MB DNG 险些入库 | `git add -A` 无差别收录用户素材 | 原始素材目录（`photos/`）进 .gitignore；Web 版走压缩入册脚本 |

## 五、常见任务 How-to

| 任务 | 步骤 |
| --- | --- |
| 写笔记 | 后台 `/admin/` 或 `src/content/notes/*.md`（schema 见 `src/content.config.ts`） |
| 加作品 | `src/content/projects/*.md`，封面放 `public/works/` |
| 发摄影 | ① 照片丢 `src/assets/photos/<slug>/`；② `src/data/albums.json` 登记名称/分类；③ 构建 |
| 加收藏/工具 | `src/data/favorites.json` 加条目（工具台与收藏夹共用此源） |
| 加笔记分类 | `src/data/note-categories.json` 加一条（或笔记里自由填写新分类名） |
| 加自研工具 | `src/lib/data/lab.ts` 加 ownTools 条目 + `src/pages/lab/` 下建页面 |
| 换音乐 | 音频放 `public/music/`，`src/lib/data/music.ts` 加一行 |
| 调整视觉 | 全部在 `src/styles/tokens.css`（色彩/间距/圆角/动效）+ 组件 scoped 样式 |

## 六、质量关卡（提交/交付前）

```bash
npm run verify                                  # 构建 + 27 项测试全绿
npx impeccable detect src/                      # 反模式扫描，0 发现
```

浏览器走查清单（视觉交付）：首页 RADIO 播放 → 跳页不断歌 → 相册灯箱（翻张/Esc）→ 笔记搜索 → 移动端 375/768 走查 → `prefers-reduced-motion` 全站可用。

## 七、已知技术债与备忘

- **sharp 安装脚本**被 npm allowScripts 拦截过一次，CI/新机器需要 `npm install-scripts approve sharp`；
- **音乐版权**：`public/music/` 当前为程序合成示例，公开站只能放拥有版权的音频；
- **AI 热点解读流水线**：`hotreads.yml` 需要 `DEEPSEEK_API_KEY` secret 才会产出内容；
- **Decap 线上编辑**：需 GitHub OAuth App（`public/admin/config.yml` 的 `app_id`），本地编辑用 `npx decap-server` 免凭证；
- **GPL-3.0**：仓库 LICENSE 有传染性，若未来涉及闭源商业化需更换协议；
- **浅色模式**：v1 全站仅暗色（品牌即暗夜紫）；工具台编辑器的明暗切换在阶段五自研编辑器中实现。

## 八、扩展路径（已预留的缝）

- 后端：`lib/data/` 换实现即可，页面零改动（PLAN.md 阶段五）；
- API 路由：Astro API Routes + nginx `/api/*` 反代已预留；
- 笔记沉淀为知识库：notes schema 的 `stage` 字段已预埋；
- 自研笔记编辑器：替换 Decap 后台，含明暗切换（复用 commit→CI 管线）。
