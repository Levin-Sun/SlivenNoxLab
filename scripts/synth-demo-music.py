#!/usr/bin/env python3
"""合成三首示例曲目（程序生成，公开站请替换为自己拥有版权的音乐）。
输出：public/music/*.wav（22050Hz / 16bit / 单声道，控制体积）
纯 Python 标准库实现，无第三方依赖。
"""
import math
import random
import struct
import wave
from pathlib import Path

SR = 22050
OUT = Path("public/music")
OUT.mkdir(parents=True, exist_ok=True)
random.seed(2026)


def save(name: str, samples: list[float]):
    # 首尾各 0.6s 淡入淡出，防爆音
    fade = int(SR * 0.6)
    n = len(samples)
    for i in range(fade):
        g = i / fade
        samples[i] *= g
        samples[n - 1 - i] *= g
    peak = max(abs(min(samples)), abs(max(samples))) or 1.0
    if peak > 0.85:
        samples = [s * 0.85 / peak for s in samples]
    path = OUT / name
    with wave.open(str(path), "w") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(b"".join(struct.pack("<h", int(max(-1, min(1, s)) * 32767)) for s in samples))
    print(f"{path}  {n / SR:.1f}s  {path.stat().st_size / 1024:.0f} KB")


def chord_pad(name: str, chords: list[list[float]], bar_sec: float):
    """慢速和弦铺底：每小节 crossfade 的正弦叠加 + 慢震音。"""
    total = int(SR * bar_sec * len(chords))
    buf = [0.0] * total
    for bi, freqs in enumerate(chords):
        start = int(SR * bar_sec * bi)
        length = int(SR * bar_sec)
        for i in range(length):
            t = i / SR
            # 每小节首尾 0.5s 升余弦交叉淡化
            edge = min(1.0, i / (SR * 0.5), (length - i) / (SR * 0.5))
            env = 0.5 - 0.5 * math.cos(math.pi * edge)
            trem = 0.75 + 0.25 * math.sin(2 * math.pi * 0.35 * t + bi)
            s = 0.0
            for f in freqs:
                s += math.sin(2 * math.pi * f * t) / len(freqs)
                s += math.sin(2 * math.pi * f * 2.001 * t) / (len(freqs) * 3)  # 轻微失谐泛音
            buf[start + i] += s * env * trem * 0.55
    save(name, buf)


def arpeggio(name: str, notes: list[tuple[float, float]], pattern_len: float, loops: int):
    """琶音：五声音阶序列 + 指数衰减 + 回声。"""
    total = int(SR * pattern_len * loops)
    buf = [0.0] * total
    for loop in range(loops):
        for ni, (freq, dur) in enumerate(notes):
            start = int(SR * (pattern_len * loop + pattern_len / len(notes) * ni))
            length = int(SR * dur)
            for i in range(min(length, total - start)):
                t = i / SR
                env = math.exp(-t * 3.2)
                s = math.sin(2 * math.pi * freq * t) * 0.6
                s += math.sin(2 * math.pi * freq * 2 * t) * 0.2
                buf[start + i] += s * env * 0.4
                # 一次回声
                echo_i = start + i + int(SR * 0.19)
                if echo_i < total:
                    buf[echo_i] += s * env * 0.12
    save(name, buf)


def pulse(name: str, bass_freq: float, bars: int, bar_sec: float, sparkles: list[tuple[float, float]]):
    """低频脉冲 + 高频星光点缀。"""
    total = int(SR * bars * bar_sec)
    buf = [0.0] * total
    beat = bar_sec / 4
    for b in range(bars * 4):
        start = int(SR * beat * b)
        length = int(SR * beat * 0.92)
        for i in range(min(length, total - start)):
            t = i / SR
            env = math.exp(-t * 5)
            s = 0.0
            for h in (1, 2, 3):
                s += math.sin(2 * math.pi * bass_freq * h * t) / (h * h)
            buf[start + i] += s * env * 0.5
    for at, freq in sparkles:
        start = int(SR * at)
        length = int(SR * 1.4)
        for i in range(min(length, total - start)):
            t = i / SR
            env = math.exp(-t * 2.4)
            buf[start + i] += math.sin(2 * math.pi * freq * t) * env * 0.18
    save(name, buf)


# 1) Nox Drift：Am - F - C - G 铺底（低八度）
A2, C3, E3, F2, G2, C4, A3, F3, G3 = 110.0, 130.81, 164.81, 87.31, 98.0, 261.63, 220.0, 174.61, 196.0
chord_pad(
    "01-nox-drift.wav",
    [
        [A2, C3, E3],
        [F2, A2, C4 / 2],
        [C3 * 0.5, G2, C3],
        [G2 / 2, 98 * 2, 146.83],
    ],
    7.0,
)

# 2) Terminal Rain：A 小调五声琶音
penta = [220.0, 261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33]
arp_notes = [(random.choice(penta) * random.choice([1, 1, 2]), 0.9) for _ in range(16)]
arpeggio("02-terminal-rain.wav", arp_notes, pattern_len=3.2, loops=5)

# 3) Aurora Pulse：55Hz 低频脉冲 + A 小调星光
sparkles = [(random.uniform(0.5, 26.0), random.choice(penta) * 2) for _ in range(14)]
pulse("03-aurora-pulse.wav", 55.0, bars=8, bar_sec=3.5, sparkles=sparkles)

print("完成：三首示例曲目已写入 public/music/")
