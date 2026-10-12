import { describe, it, expect } from 'vitest';
import { createPlaylist } from '../src/lib/audio/playlist';
import { wrapIndex, formatTime } from '../src/lib/contracts/audio';

describe('wrapIndex（索引回绕契约）', () => {
  it('正常范围内原样返回', () => {
    expect(wrapIndex(0, 3)).toBe(0);
    expect(wrapIndex(2, 3)).toBe(2);
  });

  it('越界回绕（next 从最后一首到第一首）', () => {
    expect(wrapIndex(3, 3)).toBe(0);
    expect(wrapIndex(5, 3)).toBe(2);
  });

  it('负数回绕（prev 从第一首到最后一首）', () => {
    expect(wrapIndex(-1, 3)).toBe(2);
    expect(wrapIndex(-4, 3)).toBe(2);
  });

  it('空列表恒为 -1（未加载态）', () => {
    expect(wrapIndex(0, 0)).toBe(-1);
    expect(wrapIndex(-1, 0)).toBe(-1);
  });
});

describe('formatTime（时间格式化契约）', () => {
  it('mm:ss 两位补零', () => {
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(65)).toBe('01:05');
    expect(formatTime(600)).toBe('10:00');
  });

  it('非有限值返回 00:00（NaN/Infinity 兜底）', () => {
    expect(formatTime(NaN)).toBe('00:00');
    expect(formatTime(Infinity)).toBe('00:00');
  });
});

describe('createPlaylist（播放状态机——播放停顿事故的回归测试）', () => {
  it('初始态：index=-1 且未播放', () => {
    const p = createPlaylist(3);
    expect(p.get()).toEqual({ index: -1, playing: false });
  });

  it('toggle 在未加载时等效 load(0) 并开始播放', () => {
    const p = createPlaylist(3);
    p.toggle();
    expect(p.get()).toEqual({ index: 0, playing: true });
  });

  it('播放中 toggle = 暂停，再 toggle = 恢复（单击只切换一次——双绑定事故回归）', () => {
    const p = createPlaylist(3);
    p.load(0); // load 即播放
    p.toggle();
    expect(p.get().playing).toBe(false); // 一次 toggle：暂停
    expect(p.get().index).toBe(0); // 曲目不丢
    p.toggle();
    expect(p.get().playing).toBe(true); // 二次 toggle：恢复
  });

  it('next 从最后一首回绕到第一首', () => {
    const p = createPlaylist(3);
    p.load(2);
    p.next();
    expect(p.get()).toEqual({ index: 0, playing: true });
  });

  it('prev 从第一首回绕到最后一首', () => {
    const p = createPlaylist(3);
    p.load(0);
    p.prev();
    expect(p.get().index).toBe(2);
    expect(p.get().playing).toBe(true);
  });

  it('未加载时 next/prev 等效从第一首开始', () => {
    const p = createPlaylist(3);
    p.next();
    expect(p.get().index).toBe(0);
    p.stop();
    p.prev();
    expect(p.get().index).toBe(2);
  });

  it('stop 保留曲目索引仅停播放', () => {
    const p = createPlaylist(3);
    p.load(1);
    p.stop();
    expect(p.get()).toEqual({ index: 1, playing: false });
  });

  it('单曲列表 toggle/next 恒在 0', () => {
    const p = createPlaylist(1);
    p.toggle();
    p.next();
    p.prev();
    expect(p.get().index).toBe(0);
    expect(p.get().playing).toBe(true);
  });

  it('空列表一切操作安全无异常', () => {
    const p = createPlaylist(0);
    expect(() => {
      p.toggle();
      p.next();
      p.prev();
    }).not.toThrow();
    expect(p.get().index).toBe(-1);
    expect(p.get().playing).toBe(false);
  });
});
