# 测试与开发流程

> 背景：阶段一至四的 8 次返工复盘结论——问题不在写代码，而在**接口全靠隐式约定 + 零自动化验证**。
> 本文档定义后续开发的强制流程：契约化 + TDD。

## 一、契约层（src/lib/contracts/）

跨组件的接口一律显式化，改契约 = 全消费方编译检查 + 契约测试拦截。

| 文件 | 契约内容 |
| --- | --- |
| `contracts/audio.ts` | NoxAudio 引擎 API、事件名 `noxaudio:state`、`wrapIndex` / `formatTime` 工具 |
| `contracts/dom.ts` | 全站 DOM 选择器常量（`SELECTORS`）——组件渲染钩子与测试断言共用 |

规则：
- 组件间传数据/事件，**先在 contracts 定义类型**，再写实现；
- 时间统一**秒**（ms 与 s 混淆曾导致速度 1000 倍事故）；
- 几何类常量（频谱条长度上界等）必须以画布宽度比例表达并 clamp。

## 二、测试分层（vitest）

| 层 | 文件 | 覆盖内容 |
| --- | --- | --- |
| 纯逻辑 | `tests/audio-playlist.test.ts` | 播放状态机：toggle/next/prev/回绕/空列表（播放停顿事故回归） |
| 纯逻辑 | `tests/note-categories.test.ts` | 笔记分类合并：去重/排序/自由填写契约 |
| 构建产物契约 | `tests/contract.dist.test.ts` | dist HTML 中关键 data-* 属性存在性（灯箱/RADIO/tabs 缺失即页面交互静默失效，历史上真实发生过） |

命令：
```bash
npm test          # 全量单测
npm run verify    # 构建 + 全量测试（含 dist 契约断言）
```

## 三、TDD 流程（新功能/修 bug 一律走此循环）

1. **红**：先写测试，断言期望行为（此时实现不存在或错误，测试必须失败）；
2. **绿**：最小实现让测试通过；
3. **重构**：在绿灯保护下整理代码；
4. **回归**：`npm test` 全绿后才能提交。

示范案例：播放状态机（`src/lib/audio/playlist.ts`）——测试先行锁定 toggle/next/prev 语义，测试还揪出了断言自身的预期错误（TDD 让"语义理解偏差"在实现前暴露）。

### 什么必须走 TDD

- 一切**纯逻辑**：状态机、数据转换、格式化、分类合并；
- 一切**曾经出过 bug 的区域**改动时，先补回归测试再动手。

### 什么不适合单测（用其他关卡替代）

- Canvas 绘制 / CSS 视觉 / 真实音频输出 → 交付前浏览器人工走查 + Lighthouse；
- 跨页行为 → ClientRouter 下手动验证 + 构建产物契约兜底。

## 四、部署前关卡

```bash
npm run verify    # 必须全绿
```

再加浏览器人工走查：首页 RADIO 播放 → 跳页不断歌 → 相册灯箱翻张 → 笔记搜索。
