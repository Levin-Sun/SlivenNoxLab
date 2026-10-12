/**
 * 播放列表状态机 —— 引擎播放语义的唯一事实源，纯逻辑零 DOM 依赖。
 * 从 MiniPlayer 内联引擎中抽取，配套回归测试见 tests/audio-playlist.test.ts。
 * 语义契约（与 src/lib/contracts/audio.ts 同步）：
 *   toggle 未加载 = load(0)；next/prev 回绕；stop 保留索引。
 */
export interface PlaylistState {
  index: number;
  playing: boolean;
}

export interface PlaylistMachine {
  get(): PlaylistState;
  load(index: number): void;
  toggle(): void;
  next(): void;
  prev(): void;
  stop(): void;
}

function wrapIndex(i: number, len: number): number {
  if (len <= 0) return -1;
  return ((i % len) + len) % len;
}

export function createPlaylist(len: number): PlaylistMachine {
  let state: PlaylistState = { index: -1, playing: false };

  return {
    get: () => ({ ...state }),

    load(index: number) {
      const next = wrapIndex(index, len);
      if (next < 0) return;
      state = { index: next, playing: true };
    },

    toggle() {
      if (state.index < 0) {
        state = { index: len > 0 ? 0 : -1, playing: len > 0 };
        return;
      }
      state = { ...state, playing: !state.playing };
    },

    next() {
      const next = wrapIndex(state.index + 1, len);
      if (next < 0) return;
      state = { index: next, playing: true };
    },

    prev() {
      const prev = wrapIndex(state.index - 1, len);
      if (prev < 0) return;
      state = { index: prev, playing: true };
    },

    stop() {
      state = { ...state, playing: false };
    },
  };
}
