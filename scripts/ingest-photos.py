#!/usr/bin/env python3
"""把 photos/ 原片压缩入册：分类映射 → 最长边 2000px / q82 → src/assets/photos/<相册>/"""
import os
from PIL import Image

MAP = {
    "portrait": ["Recoverd_jpg_file(1).jpg", "Recoverd_jpg_file(5).jpg", "Recoverd_jpg_file(8).jpg"],
    "landscape": [
        "Recoverd_jpg_file(11).jpg", "Recoverd_jpg_file(13).jpg", "Recoverd_jpg_file(14).jpg",
        "Recoverd_jpg_file(23).jpg", "Recoverd_jpg_file(24).jpg", "Recoverd_jpg_file(26).jpg",
        "Recoverd_jpg_file(6).jpg", "Recoverd_jpg_file(7).jpg",
    ],
    "street": [
        "Recoverd_jpg_file(10).jpg", "Recoverd_jpg_file(12).jpg", "Recoverd_jpg_file(21).jpg",
        "Recoverd_jpg_file(25).jpg", "Recoverd_jpg_file(27).jpg", "Recoverd_jpg_file(28).jpg",
        "Recoverd_jpg_file(3).jpg", "Recoverd_jpg_file(30).jpg", "Recoverd_jpg_file(31).jpg",
        "Recoverd_jpg_file(4).jpg", "Recoverd_jpg_file(9).jpg",
    ],
}

MAX_SIDE = 2000
total_in = total_out = 0
for album, files in MAP.items():
    out_dir = os.path.join("src", "assets", "photos", album)
    os.makedirs(out_dir, exist_ok=True)
    for i, f in enumerate(files, 1):
        src = os.path.join("photos", f)
        im = Image.open(src).convert("RGB")
        w, h = im.size
        if max(w, h) > MAX_SIDE:
            im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
        dst = os.path.join(out_dir, f"shot-{i:02d}.jpg")
        im.save(dst, "JPEG", quality=82, optimize=True)
        total_in += os.path.getsize(src)
        total_out += os.path.getsize(dst)
        print(f"{album}/shot-{i:02d}.jpg  {im.size[0]}x{im.size[1]}  {os.path.getsize(dst)//1024} KB")

print(f"\n合计: {total_in/1024/1024:.0f} MB -> {total_out/1024/1024:.1f} MB")
