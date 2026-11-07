"""
Motor City Auto Spa — procedural cinematic asset generator.

Produces:
  public/media/hero-loop.mp4   (3-scene ambient loop: ceramic beading, dry ice, laser film)
  public/media/hero-poster.jpg
  public/media/paint-before.jpg
  public/media/paint-after.jpg

Everything is generated locally with NumPy / OpenCV so the build has no external
media dependencies. The footage is intentionally macro/abstract: it reads as
high-end automotive b-roll behind the hero typography.
"""

import os
import math
import numpy as np
import cv2
from PIL import Image

W, H = 1280, 720
FPS = 24
OUT = os.path.join("public", "media")
os.makedirs(OUT, exist_ok=True)

rng = np.random.default_rng(7)


# ---------------------------------------------------------------- helpers
def smoothstep(x):
    x = np.clip(x, 0.0, 1.0)
    return x * x * (3 - 2 * x)


def gauss_blob(h, w, cx, cy, rx, ry, angle=0.0, power=2.0):
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    dx = xx - cx
    dy = yy - cy
    if angle:
        ca, sa = math.cos(angle), math.sin(angle)
        dx, dy = dx * ca + dy * sa, -dx * sa + dy * ca
    d = (dx / rx) ** 2 + (dy / ry) ** 2
    return np.exp(-(d ** (power / 2)))


def noise_layer(h, w, scale, seed):
    r = np.random.default_rng(seed)
    small = r.random((max(2, h // scale), max(2, w // scale))).astype(np.float32)
    return cv2.resize(small, (w, h), interpolation=cv2.INTER_CUBIC)


def fbm(h, w, seed, octaves=4, base=4):
    out = np.zeros((h, w), np.float32)
    amp = 0.5
    total = 0.0
    for o in range(octaves):
        out += amp * noise_layer(h, w, max(2, base * (2 ** o)), seed + o * 17)
        total += amp
        amp *= 0.5
    return out / total


def add_grain(img, amount=5.0, seed=None):
    """amount is expressed on a 0-255 scale for intuitive tuning."""
    r = np.random.default_rng(seed)
    n = r.normal(0, amount / 255.0, (img.shape[0], img.shape[1], 1)).astype(np.float32)
    return img + n


def vignette(img, strength=0.55, power=2.4):
    h, w = img.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    nx = (xx / w - 0.5) * 2
    ny = (yy / h - 0.5) * 2
    r = np.sqrt(nx ** 2 + ny ** 2) / 1.414
    v = 1.0 - strength * (r ** power)
    return img * v[..., None]


def tone(img, contrast=1.04, lift=0.0):
    img = (img - 0.5) * contrast + 0.5 + lift
    return np.clip(img, 0, 1)


def to_u8(img):
    return (np.clip(img, 0, 1) * 255).astype(np.uint8)


def shift_zoom(img, tx, ty, zoom):
    h, w = img.shape[:2]
    m = np.float32([[zoom, 0, tx], [0, zoom, ty]])
    return cv2.warpAffine(img, m, (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)


def amber_grade(img, amt=0.0):
    if amt <= 0:
        return img
    tint = np.array([1.0, 0.78, 0.46], np.float32)
    return img * (1 - amt) + img * tint * amt


# ---------------------------------------------------------------- shared paint environment
def paint_environment(w, h, seed=0, tilt=0.0, brightness=1.0):
    """Macro clearcoat surface: deep black, warped strip-light reflections,
    orange-peel distortion, a body crease and a warm practical rim light."""
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    base = np.zeros((h, w, 3), np.float32)
    base[..., 0] = 0.006 + 0.013 * (yy / h)
    base[..., 1] = 0.007 + 0.014 * (yy / h)
    base[..., 2] = 0.009 + 0.017 * (yy / h)

    # long overhead strip lights, warped by the panel curvature
    strips = np.zeros((h, w), np.float32)
    for i, (y0, sigma, inten) in enumerate([(0.20, 0.0075, 1.0), (0.30, 0.0045, 0.55), (0.72, 0.003, 0.28)]):
        curve = (y0 + 0.030 * np.sin(xx / w * math.pi * 1.15 + i * 0.8) + tilt * (xx / w)) * h
        d = (yy - curve) / (sigma * h)
        strips += inten * (np.exp(-(d ** 2)) + 0.28 * np.exp(-((d / 6.0) ** 2)))

    # orange peel: displace reflections by a fraction of a millimetre
    peel = fbm(h, w, seed + 11, octaves=3, base=70) - 0.5
    mapx = xx + peel * (w / 420)
    mapy = yy + peel * (h / 420)
    strips = cv2.remap(strips, mapx, mapy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
    strips = cv2.GaussianBlur(strips, (0, 0), max(0.7, w / 1400))
    base += strips[..., None] * np.array([0.90, 0.95, 1.0]) * brightness

    # soft reflected shop windows / roller door
    win = np.zeros((h, w), np.float32)
    for i, (x0, wd, ht, inten) in enumerate([(0.06, 0.10, 0.30, 0.045), (0.20, 0.055, 0.22, 0.030), (0.86, 0.13, 0.45, 0.026)]):
        win += inten * gauss_blob(h, w, x0 * w, 0.42 * h, wd * w, ht * h, angle=-0.08)
    win = cv2.GaussianBlur(win, (0, 0), w / 70)
    base += win[..., None] * np.array([0.65, 0.72, 0.85])

    # body crease — thin, razor-sharp highlight
    crease_y = (0.58 + 0.022 * np.sin(xx / w * math.pi * 1.6 + 1.1)) * h
    crease = np.exp(-(((yy - crease_y) / (h * 0.0016)) ** 2))
    crease = cv2.GaussianBlur(crease, (0, 0), 1.0)
    base += crease[..., None] * np.array([0.55, 0.62, 0.72]) * 0.8

    # warm practical light bleeding in from frame right
    amber = 0.55 * gauss_blob(h, w, 1.08 * w, 0.52 * h, 0.22 * w, 0.60 * h)
    amber = cv2.GaussianBlur(amber, (0, 0), w / 50)
    base += amber[..., None] * np.array([0.34, 0.16, 0.045])

    # metallic flake in the shadows
    flake = (np.random.default_rng(seed + 5).random((h, w)) > 0.99955).astype(np.float32)
    flake = cv2.GaussianBlur(flake, (0, 0), 0.55) * 1.4
    base += flake[..., None] * np.array([0.30, 0.33, 0.38])

    # panel gap, right of centre
    gap_x = (0.705 + 0.004 * np.sin(yy / h * math.pi)) * w
    gap = np.exp(-(((xx - gap_x) / (w * 0.0011)) ** 2))
    edge = np.exp(-(((xx - gap_x - w * 0.0022) / (w * 0.0007)) ** 2))
    base -= gap[..., None] * 0.30
    base += edge[..., None] * np.array([0.35, 0.38, 0.44])

    base = vignette(base, 0.55, 1.9)
    return np.clip(base, 0, 1.5)


# ---------------------------------------------------------------- scene 1: ceramic beading
def build_beading_static():
    return paint_environment(W, H, seed=3, tilt=0.015, brightness=1.15)


def droplet_sprite(radius, seed):
    r = max(1.0, radius)
    s = int(r * 2.7) * 2 + 2
    yy, xx = np.mgrid[0:s, 0:s].astype(np.float32)
    cx = cy = s / 2
    d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) / r
    alpha = smoothstep((1.01 - d) * 3.2)

    ang = np.arctan2(yy - cy, xx - cx)
    # thin bright rim, strongest at upper-left where the strip lights reflect
    rim = np.exp(-((d - 0.90) / 0.075) ** 2) * (0.10 + 0.90 * np.clip(np.cos(ang + 2.45), 0, 1) ** 1.4)
    # reflected strip light inside the bead
    inner = np.exp(-(((yy - (cy - r * 0.16)) / (r * 0.075)) ** 2)) * smoothstep((1.0 - d) * 4.0)
    # crisp specular
    spec = gauss_blob(s, s, cx - r * 0.28, cy - r * 0.34, r * 0.13, r * 0.09, angle=-0.55)
    # warm caustic at the bottom
    caustic = gauss_blob(s, s, cx + r * 0.18, cy + r * 0.46, r * 0.18, r * 0.075)
    # subtle shadow side
    shadow = smoothstep((d - 0.55) * 2.0) * np.clip(np.sin(ang), 0, 1) * 0.25

    rgb = np.zeros((s, s, 3), np.float32)
    rgb += np.array([0.012, 0.014, 0.018])
    rgb += rim[..., None] * np.array([0.82, 0.90, 1.0])
    rgb += inner[..., None] * np.array([0.45, 0.52, 0.62])
    rgb += spec[..., None] * 1.9
    rgb += caustic[..., None] * np.array([0.85, 0.52, 0.18])
    rgb *= (1.0 - shadow[..., None])
    return rgb, alpha


def render_beading(frame_idx, total):
    t = frame_idx / total
    img = shift_zoom(beading_static, math.sin(t * math.tau) * 9 + 4, math.cos(t * math.tau * 0.7) * 6, 1.025)

    # moving light sweep
    sweep_x = (-0.25 + 1.5 * t) * W
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    band = np.exp(-(((xx - sweep_x + (yy - H * 0.5) * 0.55) / (0.10 * W)) ** 2))
    band = cv2.GaussianBlur(band, (0, 0), 22)
    img += band[..., None] * np.array([0.05, 0.055, 0.065])

    # water beads
    for i, d in enumerate(beading_drops):
        phase = d["phase"]
        x = (d["x"] * W + math.sin(t * math.tau * 0.6 + phase) * 7 + t * 14) % (W + 80) - 40
        y = (d["y"] * H + math.cos(t * math.tau * 0.4 + phase) * 4 + t * 10) % (H + 80) - 40
        rr = d["r"] * (1 + 0.035 * math.sin(t * math.tau + phase))
        spr, alpha = droplet_cache[i]
        h, w = spr.shape[:2]
        x0, y0 = int(x - w / 2), int(y - h / 2)
        x1, y1 = x0 + w, y0 + h
        sx0, sy0 = max(0, -x0), max(0, -y0)
        dx0, dy0 = max(0, x0), max(0, y0)
        dx1, dy1 = min(W, x1), min(H, y1)
        if dx1 <= dx0 or dy1 <= dy0:
            continue
        a = alpha[sy0:sy0 + (dy1 - dy0), sx0:sx0 + (dx1 - dx0)][..., None]
        s = spr[sy0:sy0 + (dy1 - dy0), sx0:sx0 + (dx1 - dx0)]
        img[dy0:dy1, dx0:dx1] = img[dy0:dy1, dx0:dx1] * (1 - a) + s * a

    # micro-condensation
    mist = fbm(H, W, 91 + (frame_idx // 12), octaves=3, base=10)
    img += (mist[..., None] - 0.5) * 0.012

    img = amber_grade(img, 0.07)
    img = vignette(img, 0.55, 2.2)
    img = add_grain(img, 3.6, frame_idx)
    return to_u8(tone(img, 1.08, -0.005))


beading_static = build_beading_static()
beading_drops = []
droplet_cache = []
for i in range(195):
    rr = float(np.clip(rng.gamma(2.2, 3.0) + 1.4, 1.2, 21.0))
    beading_drops.append({
        "x": float(rng.random()), "y": float(rng.random()), "r": rr,
        "phase": float(rng.random() * math.tau),
    })
    droplet_cache.append(droplet_sprite(rr, i))


# ---------------------------------------------------------------- scene 2: dry ice underbody
def build_underbody():
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    img = np.zeros((H, W, 3), np.float32)
    # ribbed chassis / underbody panels in perspective
    ribs = 0.5 + 0.5 * np.sin((yy / H) * 26 + 0.5 * np.sin(xx / W * 3))
    img += (0.012 + 0.018 * ribs)[..., None] * np.array([0.9, 0.95, 1.0])
    # large panel seams
    seam = np.exp(-(((yy / H - 0.46) / 0.012) ** 2)) + 0.7 * np.exp(-(((yy / H - 0.72) / 0.010) ** 2))
    img += seam[..., None] * np.array([0.10, 0.11, 0.12])
    # bolts
    for i in range(14):
        cx = (0.06 + 0.07 * i) * W
        cy = (0.30 + 0.10 * math.sin(i * 2.1)) * H
        b = gauss_blob(H, W, cx, cy, 9, 9)
        img += b[..., None] * 0.10
    # texture + grime
    grime = fbm(H, W, 55, octaves=5, base=6)
    img *= (0.6 + 0.8 * grime)[..., None]
    # amber work light from the right, cool fill left
    amber = 1.1 * gauss_blob(H, W, 1.08 * W, 0.32 * H, 0.55 * W, 0.65 * H)
    img += amber[..., None] * np.array([0.42, 0.22, 0.06])
    cool = 0.35 * gauss_blob(H, W, -0.1 * W, 0.7 * H, 0.5 * W, 0.5 * H)
    img += cool[..., None] * np.array([0.04, 0.08, 0.13])
    img = cv2.GaussianBlur(img, (0, 0), 1.2)
    return img


def fog_layer(seed, t, scale=18, speed=0.05):
    r = np.random.default_rng(seed)
    hh, ww = 180, 320
    n = r.random((hh, ww)).astype(np.float32)
    n = cv2.GaussianBlur(n, (0, 0), 5)
    n = (n - n.min()) / (n.max() - n.min() + 1e-6)
    # scroll horizontally
    off = int((t * speed * ww * 6) % ww)
    n = np.roll(n, off, axis=1)
    full = cv2.resize(n, (W, H), interpolation=cv2.INTER_CUBIC)
    # vertically shaped
    yy = np.linspace(0, 1, H, dtype=np.float32)[:, None]
    full *= np.exp(-((yy - 0.55) / 0.38) ** 2)
    return full


underbody = build_underbody()
fog_noise = [fog_layer(100 + i, 0, scale=18) for i in range(6)]


def render_dryice(frame_idx, total):
    t = frame_idx / total
    img = shift_zoom(underbody, math.sin(t * math.tau) * 6, -4 + math.cos(t * math.tau) * 4, 1.03)
    # rolling fog: combine several pre-smoothed noise fields
    fog = np.zeros((H, W), np.float32)
    for i in range(4):
        n = fog_noise[(frame_idx // 8 + i * 2) % len(fog_noise)]
        shift = int((t * (60 + i * 34) + i * 90) % W)
        fog += 0.30 * np.roll(n, shift, axis=1) * (0.55 + 0.45 * math.sin(t * math.tau + i))
    fog = np.clip(fog, 0, 1)
    fog_rgb = np.stack([fog * 0.55, fog * 0.60, fog * 0.66], axis=-1)
    img = img + fog_rgb * 0.32
    # dry-ice pellets streaking
    for i in range(26):
        px = ((i * 197 + frame_idx * (7 + i % 5)) % (W + 200)) - 100
        py = (0.25 + 0.55 * ((i * 0.37) % 1)) * H + math.sin(frame_idx * 0.05 + i) * 12
        rad = 1.2 + (i % 4) * 0.6
        img = add_dot(img, px, py, rad, np.array([0.55, 0.62, 0.70]) * 0.8, 0.55)
    # anamorphic flare
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    flare = np.exp(-(((yy - 0.36 * H) / 2.6) ** 2)) * np.exp(-(((xx - 0.86 * W) / (0.18 * W)) ** 2))
    img += flare[..., None] * np.array([0.7, 0.42, 0.14])
    img = amber_grade(img, 0.12)
    img = vignette(img, 0.68, 2.0)
    img = add_grain(img, 5.0, frame_idx + 900)
    return to_u8(tone(img, 1.08, -0.01))


def add_dot(img, cx, cy, radius, color, intensity=1.0):
    x0, x1 = max(0, int(cx - radius * 4)), min(W, int(cx + radius * 4))
    y0, y1 = max(0, int(cy - radius * 4)), min(H, int(cy + radius * 4))
    if x1 <= x0 or y1 <= y0:
        return img
    yy, xx = np.mgrid[y0:y1, x0:x1].astype(np.float32)
    d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    b = np.exp(-(d / max(radius, 0.5)) ** 2) * intensity
    img[y0:y1, x0:x1] += b[..., None] * color
    return img


# ---------------------------------------------------------------- scene 3: laser-cut film
def bezier_path(n=400):
    # fender / hood film template contour
    pts = []
    ctrl = [
        (0.10, 0.72), (0.20, 0.30), (0.38, 0.16), (0.56, 0.22),
        (0.72, 0.28), (0.86, 0.52), (0.78, 0.80), (0.56, 0.88),
        (0.34, 0.86), (0.18, 0.82), (0.10, 0.72)
    ]
    for i in range(len(ctrl) - 1):
        p0 = np.array(ctrl[i]); p1 = np.array(ctrl[i + 1])
        for j in range(n // (len(ctrl) - 1)):
            tt = j / (n // (len(ctrl) - 1))
            pts.append(p0 + (p1 - p0) * tt)
    return np.array(pts, np.float32)


laser_pts = bezier_path()
laser_pts[:, 0] *= W
laser_pts[:, 1] *= H


def build_film_base():
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    img = np.zeros((H, W, 3), np.float32)
    img += (0.020 + 0.045 * (1 - yy / H))[..., None] * np.array([0.8, 0.9, 1.0])
    # glossy panel reflection
    refl = 0.30 * gauss_blob(H, W, 0.30 * W, 0.25 * H, 0.30 * W, 0.35 * H, angle=-0.5)
    refl += 0.12 * gauss_blob(H, W, 0.78 * W, 0.15 * H, 0.10 * W, 0.45 * H, angle=0.2)
    img += refl[..., None] * np.array([0.55, 0.62, 0.75])
    # film micro texture
    tex = fbm(H, W, 77, octaves=4, base=12)
    img += (tex - 0.5)[..., None] * 0.02
    # faint protective film grid / release liner
    grid = 0.012 * (0.5 + 0.5 * np.sin(xx / W * 90)) * np.exp(-((yy / H - 0.5) ** 2))
    img += grid[..., None]
    return img


film_base = build_film_base()


def render_laser(frame_idx, total):
    t = frame_idx / total
    img = shift_zoom(film_base, math.sin(t * math.tau) * 4, 2, 1.03 + 0.02 * t)
    progress = min(1.0, (t * 1.35) % 1.25)
    n = max(2, int(len(laser_pts) * min(progress, 1.0)))

    # cut path revealed behind the head
    mask = np.zeros((H, W), np.uint8)
    pts = laser_pts[:n].astype(np.int32).reshape(-1, 1, 2)
    cv2.polylines(mask, [pts], False, 255, 2, cv2.LINE_AA)
    edge = cv2.GaussianBlur(mask.astype(np.float32) / 255.0, (0, 0), 2)
    img += edge[..., None] * np.array([0.55, 0.40, 0.20])

    # bright glow of the beam
    glow = cv2.GaussianBlur(mask.astype(np.float32) / 255.0, (0, 0), 9)
    core = cv2.GaussianBlur(mask.astype(np.float32) / 255.0, (0, 0), 1.2)
    img += glow[..., None] * np.array([0.75, 0.42, 0.10]) * 1.5
    img += core[..., None] * np.array([1.0, 0.86, 0.55]) * 1.2

    # cutting head
    hx, hy = laser_pts[min(n - 1, len(laser_pts) - 1)]
    head = gauss_blob(H, W, hx, hy, 4.5, 4.5, power=1.4)
    halo = gauss_blob(H, W, hx, hy, 44, 44, power=1.2)
    img += halo[..., None] * np.array([0.55, 0.28, 0.06])
    img += head[..., None] * np.array([1.0, 0.92, 0.72]) * 2.2

    # sparks
    r = np.random.default_rng(frame_idx // 2 + 55)
    for i in range(16):
        ang = r.random() * math.tau
        dist = 6 + r.random() * 55
        sx = hx + math.cos(ang) * dist * (0.4 + r.random())
        sy = hy + math.sin(ang) * dist
        img = add_dot(img, sx, sy, 0.7 + r.random() * 1.2,
                      np.array([1.0, 0.55, 0.15]), 0.9)

    # ambient amber bloom from the cut
    img += (0.06 * glow[..., None]) * np.array([0.6, 0.3, 0.08])
    img = amber_grade(img, 0.10)
    img = vignette(img, 0.70, 1.9)
    img = add_grain(img, 4.0, frame_idx + 1700)
    return to_u8(tone(img, 1.07))


# ---------------------------------------------------------------- stills: paint correction
def build_paint_still(w=1800, h=1120):
    return paint_environment(w, h, seed=7, tilt=0.025, brightness=1.15)


def add_swirls(img, count=460, seed=3):
    h, w = img.shape[:2]
    r = np.random.default_rng(seed)
    layer = np.zeros((h, w), np.float32)
    for i in range(count):
        cx = r.random() * w
        cy = r.random() * h
        rad = 8 + (r.random() ** 2) * 95
        start = r.random() * math.tau
        span = 0.5 + r.random() * 2.8
        axes = (rad, rad * (0.45 + r.random() * 0.9))
        angle = r.random() * 180
        thickness = 1 if r.random() < 0.86 else 2
        # swirls are only visible where they catch the inspection light
        light = 0.25 + 0.75 * np.exp(-(((cy / h) - 0.33) / 0.28) ** 2)
        alpha = (0.035 + r.random() * 0.22) * light
        cv2.ellipse(layer, (int(cx), int(cy)), (int(axes[0]), int(axes[1])), angle,
                    math.degrees(start), math.degrees(start + span), float(alpha), thickness, cv2.LINE_AA)
    # deeper isolated RIDS
    for i in range(34):
        x0, y0 = r.random() * w, r.random() * h
        ang = r.random() * math.tau
        ln = 25 + r.random() * 260
        x1 = x0 + math.cos(ang) * ln
        y1 = y0 + math.sin(ang) * ln
        cv2.line(layer, (int(x0), int(y0)), (int(x1), int(y1)), float(0.05 + r.random() * 0.18), 1, cv2.LINE_AA)
    layer = cv2.GaussianBlur(layer, (0, 0), 0.9)
    img = img + layer[..., None] * np.array([0.85, 0.88, 0.92])

    # oxidised / hazed patches
    haze = fbm(h, w, 44, octaves=4, base=5)
    veil = smoothstep((haze - 0.42) * 2.2) * 0.20
    img = img * (1.0 - veil[..., None]) + veil[..., None] * np.array([0.16, 0.17, 0.18])
    # buffer holograms
    holo = fbm(h, w, 66, octaves=3, base=14)
    img += (holo[..., None] - 0.5) * 0.02
    # dust / fallout
    dust = (r.random((h, w)) > 0.99955).astype(np.float32)
    dust = cv2.GaussianBlur(dust, (0, 0), 0.9) * 2.2
    img = img + dust[..., None] * 0.22
    return img


def apply_beads(img, count=18, seed=12):
    h, w = img.shape[:2]
    r = np.random.default_rng(seed)
    for i in range(count):
        rad = 2.5 + r.random() ** 2 * 13
        spr, alpha = droplet_sprite(rad, i)
        sh, sw = spr.shape[:2]
        x = int(r.random() * (w - sw)) + sw // 2
        y = int(r.random() * (h - sh)) + sh // 2
        x0, y0 = x - sw // 2, y - sh // 2
        x1, y1 = x0 + sw, y0 + sh
        if x0 < 0 or y0 < 0 or x1 > w or y1 > h:
            continue
        a = alpha[..., None]
        img[y0:y1, x0:x1] = img[y0:y1, x0:x1] * (1 - a) + spr * a
    return img


def render_still(img, seed, grain=2.2, vig=0.5):
    img = amber_grade(img, 0.05)
    img = vignette(img, vig, 2.0)
    img = add_grain(img, grain, seed)
    img = tone(img, 1.04)
    return to_u8(img)


paint_base = build_paint_still()
paint_after = render_still(apply_beads(paint_base.copy(), 22, 9), 31, 1.4, 0.55)
paint_before = render_still(add_swirls(paint_base.copy()), 32, 2.2, 0.50)


# ---------------------------------------------------------------- write assets
def write_still(path, arr, quality=90):
    Image.fromarray(arr).save(path, quality=quality, optimize=True, progressive=True)
    print("wrote", path)


write_still(os.path.join(OUT, "paint-after.jpg"), paint_after, 92)
write_still(os.path.join(OUT, "paint-before.jpg"), paint_before, 92)

# poster from scene 1
poster = render_beading(40, 168)
write_still(os.path.join(OUT, "hero-poster.jpg"), poster, 88)

if "--stills" in __import__("sys").argv:
    raise SystemExit(0)

# video: 3 scenes with crossfades
scene_len = 168
fade = 24
scenes = [render_beading, render_dryice, render_laser]
total_frames = scene_len * len(scenes) - fade * (len(scenes) - 1)

video_path = os.path.join(OUT, "hero-loop.mp4")
ffmpeg = os.environ.get("FFMPEG_BIN")
if not ffmpeg:
    try:
        import imageio_ffmpeg
        ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        ffmpeg = "ffmpeg"

cmd = [
    ffmpeg, "-y", "-loglevel", "error",
    "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
    "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "21",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart", video_path,
]
proc = __import__("subprocess").Popen(cmd, stdin=__import__("subprocess").PIPE)

print("rendering", total_frames, "frames ->", video_path)
for f in range(total_frames):
    out = None
    for si, fn in enumerate(scenes):
        start = si * (scene_len - fade)
        end = start + scene_len
        if start <= f < end:
            local = f - start
            frame = fn(local, scene_len)
            if out is None:
                out = frame.astype(np.float32)
            else:
                a = min(1.0, (f - start) / fade)
                a = a * a * (3 - 2 * a)
                out = out * (1 - a) + frame.astype(np.float32) * a
    if out is None:
        continue
    proc.stdin.write(out.astype(np.uint8).tobytes())
    if f % 48 == 0:
        print("frame", f)
proc.stdin.close()
proc.wait()
print("wrote", video_path, os.path.getsize(video_path))
