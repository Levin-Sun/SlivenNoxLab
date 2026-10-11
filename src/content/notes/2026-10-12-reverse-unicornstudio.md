---
title: 逆向 UnicornStudio：参考站光帘的完整配方
description: 从 iframe 到场景 JSON， Limited 的紫色极光是这么构造的。
pubDate: 2026-10-12
tags: [webgl, 逆向, 设计]
stage: evergreen
---

站点背景的紫色极光不是从零画的——是逆向了参考站 Limited 的 UnicornStudio 场景后重建的。记录方法论。

## 逆向路径

1. 模板真身在 `preview-sandbox` **iframe** 里，外层 DOM 查不到任何东西；同源页面可以直接读 `iframe.contentWindow.performance` 拿资源列表
2. 资源列表暴露了 `unicornstudio-react` 引擎和场景 JSON 地址（`assets.unicorn.studio/embeds/<id>`）
3. 场景 JSON（50KB）里是**每一层编译好的 GLSL 源码**

## 配方拆解

场景名 "Copy of black hole (Remix)"，11 层栈里核心是两层：

- **wisps**：两片 voronoi 星点网格，**y 轴压扁到 3%**——圆点被拉成横向光丝，加法混色 + sin 闪烁
- **beam**：半径 0.285 的中心光环，一道 90° 亮弧每 100 秒雷达式扫掠

最有意思的发现：**场景本体是深青色 `vec3(0, 0.18, 0.17)`，紫色全部来自 canvas 外面一层 CSS `filter: hue-rotate(90deg)`**。改色不改着色器，这个思路值得记住。

## 重建

两段着色器合并成单 pass 原生 WebGL（约 100 行，零依赖），沿用 hue-rotate 定色。踩的坑：初始化时测量 `display:none` 元素的 `clientWidth` 得到 0，画布退化成 2×2 再被拉伸全屏——修复方法是尺寸取始终有布局的父容器。
