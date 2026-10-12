/**
 * DOM 选择器契约 —— 组件渲染的钩子与测试断言共用同一份常量。
 * 组件改选择器必须同步此处；契约测试（tests/contract.dist.test.ts）据此断言 dist。
 */
export const SELECTORS = {
  /** 全局迷你播放条（transition:persist 跨页持久） */
  miniPlayer: '#mini-player',
  miniToggle: '#mp-toggle',
  /** 主页 RADIO 播放卡 */
  heroDeck: '[data-hero-deck]',
  heroToggle: '[data-hd-act="toggle"]',
  /** 播放页 */
  player: '[data-player]',
  playerToggle: '[data-act="toggle"]',
  /** 相册灯箱 */
  lightbox: '[data-lightbox]',
  lightboxItem: '[data-lightbox-item]',
  /** 笔记分类 tabs */
  noteTab: '.cat-tab',
  /** 收藏夹 tabs */
  favTab: '.fav-tab',
  /** 摄影分类 tabs */
  photoTab: '.photo-tab',
} as const;

/** 引擎状态广播的事件名（与 src/lib/contracts/audio.ts 保持一致） */
export const NOX_STATE_EVENT = 'noxaudio:state';
