"""Lean static share images (JPEG ~40-70 KB): one default per locale, one per sign per locale (used by older daily dates), plus logo.
Run: python3 scripts/build-og-defaults.py scripts/og-names.json [locale ...]  (needs Pillow). Output is committed under public/og/.
Name locales to build only those and leave the rest, logo included, alone. OG_SERIF and OG_SANS point at the fonts on other systems."""
import json,sys,os
from PIL import Image,ImageDraw,ImageFont,ImageFilter
N=json.load(open(sys.argv[1],encoding="utf-8"))
ONLY=sys.argv[2:]
CG=os.environ.get("OG_SERIF","/usr/share/fonts/truetype/sand-box/google/Cormorant Garamond/CormorantGaramond-VariableFont_wght.ttf")
DJ=os.environ.get("OG_SANS","/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
G={"aries":"♈","taurus":"♉","gemini":"♊","cancer":"♋","leo":"♌","virgo":"♍","libra":"♎","scorpio":"♏","sagittarius":"♐","capricorn":"♑","aquarius":"♒","pisces":"♓"}
bg=Image.open("public/img/cosmos/milkyway-1280.webp").convert("RGB").resize((1200,630))
def base():
    im=bg.copy(); ov=Image.new("RGB",im.size,(14,11,38)); return Image.blend(im,ov,0.55)
def font(p,s):return ImageFont.truetype(p,s)
def save(im,p): im.save(p,"JPEG",quality=58,optimize=True,progressive=True)
for l,d in N.items():
    if ONLY and l not in ONLY: continue
    im=base();dr=ImageDraw.Draw(im)
    dr.text((80,200),d["brand"],font=font(CG,120),fill=(233,199,138))
    dr.text((84,350),d["tag"],font=font(CG,48),fill=(240,236,250))
    dr.text((84,520),"horoscop.si",font=font(DJ,28),fill=(200,195,230))
    save(im,f"public/og/default/{l}.jpg")
    for s,n in d["signs"].items():
        im=base();dr=ImageDraw.Draw(im)
        dr.text((820,120),G[s],font=font(DJ,300),fill=(233,199,138))
        dr.text((80,180),n,font=font(CG,130),fill=(240,236,250))
        dr.text((84,340),d["hub"],font=font(CG,56),fill=(233,199,138))
        dr.text((84,520),"horoscop.si",font=font(DJ,28),fill=(200,195,230))
        save(im,f"public/og/sign/{l}-{s}.jpg")
if not ONLY:
    lg=Image.new("RGB",(512,512),(14,11,38));dr=ImageDraw.Draw(lg)
    dr.ellipse((96,96,416,416),fill=(233,199,138));dr.ellipse((170,70,470,370),fill=(14,11,38))
    lg.save("public/logo.png",optimize=True)
