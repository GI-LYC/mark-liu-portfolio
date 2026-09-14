import json
import os
import sys

from PIL import Image, ImageOps

root, output, manifest_path = sys.argv[1:4]
with open(manifest_path, "r", encoding="utf-8") as stream:
    sources = json.load(stream)

previous_path = os.path.join(output, "manifest.json")
previous = {}
if os.path.exists(previous_path):
    with open(previous_path, "r", encoding="utf-8") as stream:
        previous = json.load(stream)
manifest = {}
for item in sources:
    if not os.path.exists(os.path.join(root, item["source"])):
        cached = previous.get(item["id"])
        if cached and all(os.path.exists(os.path.join(output, cached[kind])) for kind in ("thumb", "cover")):
            manifest[item["id"]] = cached
            continue
    with Image.open(os.path.join(root, item["source"])) as source:
        image = ImageOps.exif_transpose(source).convert("RGB")
        average = image.resize((1, 1), Image.Resampling.BOX).getpixel((0, 0))
        record = {"width": image.width, "height": image.height,
                  "accent": "#" + "".join(f"{channel:02x}" for channel in average)}
        for kind, size, quality in [("thumb", 360, 65), ("cover", 1600, 82)]:
            prepared = image.copy()
            prepared.thumbnail((size, size), Image.Resampling.LANCZOS)
            filename = item["key"] + "-" + kind + ".webp"
            prepared.save(os.path.join(output, "media", filename), "WEBP", quality=quality, method=5)
            record[kind] = "media/" + filename
        manifest[item["id"]] = record

with open(os.path.join(output, "manifest.json"), "w", encoding="utf-8") as stream:
    json.dump(manifest, stream, ensure_ascii=False, indent=2)
