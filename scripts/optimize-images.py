import json
import os
import sys

from PIL import Image, ImageOps


root, output_dir, manifest_path = sys.argv[1:4]

with open(manifest_path, "r", encoding="utf-8") as file:
    images = json.load(file)

for source, output, max_width in images:
    with Image.open(os.path.join(root, source)) as image:
        prepared = ImageOps.exif_transpose(image).convert("RGB")
        if prepared.width > max_width:
            height = round(prepared.height * max_width / prepared.width)
            prepared = prepared.resize((max_width, height), Image.Resampling.LANCZOS)
        prepared.save(os.path.join(output_dir, output), "WEBP", quality=80, method=5)
