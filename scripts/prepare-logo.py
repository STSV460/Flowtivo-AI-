"""Create transparent logo variants from the supplied original PNG.

Asset-only tool; requires Pillow and NumPy. Website runtime does not use Python.
Preserves the original file. User approved pixel cleanup and white lettering.
"""
from pathlib import Path
from PIL import Image, ImageFilter
import numpy as np

root = Path(__file__).resolve().parents[1]
source = Image.open(root / 'public/flowtivo-logo.png').convert('RGB')
rgb = np.array(source).astype(np.float32)
maximum = rgb.max(axis=2)
minimum = rgb.min(axis=2)
chroma = maximum - minimum
height, width = chroma.shape

# The original mark and badge use saturated cyan/blue/purple; the baked
# checkerboard and lettering are neutral. Retain their original color pixels.
color_core = chroma > 50
color_neighborhood = np.array(Image.fromarray((color_core * 255).astype('uint8')).filter(ImageFilter.MaxFilter(3))) > 0
color_alpha = np.where(color_neighborhood, np.clip(chroma / 50, 0, 1), 0)

# White AI letters are part of the badge, not background. The badge is convex,
# so fill each scanline between its outer colored boundaries, preserving holes
# in the separate black wordmark as transparent background instead.
badge = np.zeros((height, width), dtype=bool)
for y in range(200, min(480, height)):
    xs = np.flatnonzero(color_core[y, 1600:]) + 1600
    if xs.size:
        badge[y, xs.min():xs.max() + 1] = True
color_alpha[badge] = 1

# Recover grayscale letter antialiasing only next to dark letter cores.
# This prevents pale checkerboard pixels from becoming white residue.
text_core = (maximum < 170) & (chroma < 45) & ~badge & ~color_neighborhood
text_neighborhood = np.array(Image.fromarray((text_core * 255).astype('uint8')).filter(ImageFilter.MaxFilter(3))) > 0
luminance = rgb.mean(axis=2)
text_alpha = np.where(text_neighborhood & ~badge & ~color_core, np.clip((250 - luminance) / 250, 0, 1), 0)
text_alpha[luminance >= 240] = 0
alpha = np.maximum(color_alpha, text_alpha)

# Remove white matte from partly transparent color edges, retaining all
# interior gradient pixels unchanged.
colors = np.zeros_like(rgb)
colored = color_alpha > 0
safe_alpha = np.maximum(color_alpha, 0.001)[..., None]
unmatted = np.clip((rgb - 255 * (1 - safe_alpha)) / safe_alpha, 0, 255)
colors[colored] = unmatted[colored]
text_pixels = (text_alpha > 0) & ~colored
alpha_bytes = np.round(alpha * 255).astype('uint8')

variants = {}
for name, lettering in [('flowtivo-logo-transparent-v2.png', 0), ('flowtivo-logo-dark.png', 247)]:
    output_rgb = colors.copy()
    output_rgb[text_pixels] = lettering
    rgba = np.dstack((np.round(output_rgb).astype('uint8'), alpha_bytes))
    image = Image.fromarray(rgba)
    bounds = image.getbbox()
    # Trim only empty outer space, preserving the full mark and tagline.
    pad = 10
    bounds = (max(0,bounds[0]-pad), max(0,bounds[1]-pad), min(width,bounds[2]+pad), min(height,bounds[3]+pad))
    image = image.crop(bounds)
    image.save(root / 'public' / name, optimize=True)
    variants[name] = image
    print(f'{name}: {image.width}x{image.height}, genuine alpha transparency')

preview = Image.new('RGB', (1200, 310), '#070b18')
logo = variants['flowtivo-logo-dark.png'].copy()
logo.thumbnail((1100, 250), Image.Resampling.LANCZOS)
preview.paste(logo, ((1200-logo.width)//2, (310-logo.height)//2), logo)
preview.save('/private/tmp/flowtivo-logo-check.png')
