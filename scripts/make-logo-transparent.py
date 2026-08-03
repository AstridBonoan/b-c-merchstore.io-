from PIL import Image
from pathlib import Path

src = Path("public/images/brand/bc-logo.png")
dst = Path("public/images/brand/bc-logo-transparent.png")

img = Image.open(src).convert("RGBA")
pixels = img.load()
w, h = img.size

for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        # Near-black background -> transparent
        if r < 28 and g < 28 and b < 40:
            pixels[x, y] = (r, g, b, 0)
        elif r < 40 and g < 45 and b < 70 and (r + g + b) < 120 and (b - r) < 25:
            pixels[x, y] = (r, g, b, 0)

img.save(dst, "PNG")
print(f"wrote {dst} ({dst.stat().st_size} bytes)")
