from PIL import Image, ImageEnhance, ImageFilter
import os

SRC = "public/media/source"
OUT = "public/media"

# name: (aspect w/h, output width, grade brightness, grade contrast, saturation, focus point y 0-1)
PLAN = {
    "garage":  (4 / 5, 1600, 0.92, 1.06, 0.92, 0.5),
    "studio":  (3 / 2, 2000, 0.88, 1.08, 0.88, 0.52),
    "night":   (16 / 9, 2200, 0.82, 1.12, 0.86, 0.5),
    "wash":    (4 / 3, 1800, 0.90, 1.06, 0.92, 0.48),
    "spray":   (3 / 2, 1800, 0.86, 1.08, 0.88, 0.5),
    "engine":  (1 / 1, 1500, 0.86, 1.08, 0.90, 0.5),
    "red":     (4 / 5, 1500, 0.90, 1.06, 0.94, 0.52),
    "detail":  (3 / 2, 1800, 0.88, 1.08, 0.90, 0.5),
    "porsche": (16 / 9, 2000, 0.86, 1.08, 0.90, 0.5),
}

for name, (aspect, width, brightness, contrast, saturation, focus_y) in PLAN.items():
    path = os.path.join(SRC, f"{name}.jpg")
    if not os.path.exists(path):
        print("missing", path)
        continue
    im = Image.open(path).convert("RGB")
    w, h = im.size
    target_h = int(width / aspect)
    # scale to cover
    scale = max(width / w, target_h / h)
    im = im.resize((max(1, int(w * scale + 0.5)), max(1, int(h * scale + 0.5))), Image.LANCZOS)
    w, h = im.size
    left = (w - width) // 2
    top = int((h - target_h) * focus_y)
    top = max(0, min(h - target_h, top))
    im = im.crop((left, top, left + width, top + target_h))
    im = ImageEnhance.Brightness(im).enhance(brightness)
    im = ImageEnhance.Contrast(im).enhance(contrast)
    im = ImageEnhance.Color(im).enhance(saturation)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.2, percent=55, threshold=3))
    out = os.path.join(OUT, f"{name}.webp")
    im.save(out, "WEBP", quality=84, method=6)
    print(name, im.size, os.path.getsize(out))

# grain tile
import numpy as np
rng = np.random.default_rng(42)
size = 160
noise = rng.normal(0.5, 0.16, (size, size))
noise = np.clip(noise, 0, 1)
alpha = (np.abs(noise - 0.5) * 2 * 120).astype(np.uint8)
rgba = np.zeros((size, size, 4), np.uint8)
rgba[..., :3] = 255
rgba[..., 3] = alpha
Image.fromarray(rgba, "RGBA").save(os.path.join(OUT, "grain.png"), optimize=True)
print("grain.png", os.path.getsize(os.path.join(OUT, "grain.png")))
