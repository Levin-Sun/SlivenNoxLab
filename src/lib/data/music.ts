// 音乐播放器数据：播放列表（收藏夹同款配置模式）。
// 示例曲目为程序合成（scripts/synth-demo-music.py），替换 src 指向自己的音频即可。
export interface MusicTrack {
  title: string;
  artist: string;
  src: string;
}

export const musicTracks: MusicTrack[] = [
  { title: 'Nox Drift', artist: '程序合成 · 示例曲目', src: '/music/01-nox-drift.wav' },
  { title: 'Terminal Rain', artist: '程序合成 · 示例曲目', src: '/music/02-terminal-rain.wav' },
  { title: 'Aurora Pulse', artist: '程序合成 · 示例曲目', src: '/music/03-aurora-pulse.wav' },
];
