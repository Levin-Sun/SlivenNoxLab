/**
 * NoxAudio 引擎契约 —— 所有消费方（迷你条 / 主页 RADIO / 播放页）与引擎实现
 * 共同遵守的接口。修改此文件 = 修改契约，需同步全部消费方与测试。
 */

/** 曲目 */
export interface NoxTrack {
  title: string;
  artist: string;
  /** 站内路径（public/ 下），如 /music/01-nox-drift.wav */
  src: string;
}

/** 引擎对外暴露的完整 API（window.NoxAudio） */
export interface NoxAudioApi {
  readonly tracks: readonly NoxTrack[];
  /** 当前曲目索引，-1 = 未加载任何曲目 */
  readonly index: number;
  readonly playing: boolean;
  /** 加载曲目；索引按列表长度回绕 */
  load(index: number, autoplay?: boolean): void;
  /** index < 0 时等效 load(0)，否则切换播放/暂停 */
  toggle(): void;
  next(): void;
  prev(): void;
  seekTo(seconds: number): void;
  setVolume(volume: number): void;
  /** 播放中返回频谱数据（0-255），否则 null。单位约定：内部时间一律秒 */
  freq(): Uint8Array | null;
  /** 引擎持有的音频元素（测试与高级用法） */
  readonly audio: HTMLAudioElement;
}

/** 引擎状态广播的事件契约 */
export const NOX_STATE_EVENT = 'noxaudio:state';

export interface NoxStateDetail {
  index: number;
  playing: boolean;
  title: string;
}

/** 播放列表索引回绕：任意整数归入 [0, len)，len=0 时恒为 -1 */
export function wrapIndex(i: number, len: number): number {
  if (len <= 0) return -1;
  return ((i % len) + len) % len;
}

/** 时间格式化 mm:ss（秒输入，非有限值返回 00:00） */
export function formatTime(t: number): string {
  if (!isFinite(t)) return '00:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
