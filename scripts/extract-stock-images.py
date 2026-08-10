from PIL import Image
import os, json

SRC = 'xl_unzip/xl/media/'
OUT = '/home/user/house-of-chairs/public/stock/'
os.makedirs(OUT, exist_ok=True)

# sheet row -> (piece slug, [media files in display order])
MAP = [
 (5,  'philippe-starck-louis-20-chair-for-vitra-orange',      ['image7.jpg']),
 (6,  'philippe-starck-louis-20-chair-for-vitra-blue',        ['image21.jpg']),
 (7,  'philippe-starck-louis-20-chair-for-vitra-ox-blood',    ['image8.png']),
 (8,  'vitra-verner-panton-chair-sky-blue',                   ['image5.jpg']),
 (9,  'vitra-verner-panton-chair-black',                      ['image20.png']),
 (10, 'kartell-uncle-jim-armchair-black',                     ['image13.png']),
 (11, 'philippe-starck-eurostar-armchair',                    ['image17.png']),
 (12, 'vintage-panto-pop-lounge-chair-verner-panton',         ['image9.jpg']),
 (13, 'artek-aalto-stool-64',                                 ['image1.png']),
 (14, 'artek-bar-stool-65',                                   ['image10.png']),
 (15, 'modernica-for-eames-fibreglass-bar-stool-black',       ['image15.png']),
 (16, 'modernica-for-eames-fibreglass-stool-orange-red',      ['image11.png']),
 (17, 'emeco-1006-navy-backless-stool',                       ['image19.png']),
 (18, 'emeco-111-brushed-aluminium-counter-bar-stool',        ['image2.png']),
 (19, 'philippe-starck-emeco-kong-armchair',                  ['image16.png']),
 (20, 'verner-panton-cone-chair-2-pieces-available-price-per-chair', ['image6.jpg']),
 (21, 'kartell-masters-chair-white',                          ['image18.png']),
 (22, 'philippe-starck-miss-coco-folding-side-chair',         ['image3.png', 'image14.png']),
 (24, 'kartell-starck-la-marie-chair',                        ['image4.png']),
 (25, 'herman-miller-for-verner-panton-1970s-set-of-4',       ['image12.png']),
]

out = []
for row, slug, files in MAP:
    for i, f in enumerate(files):
        im = Image.open(SRC + f)
        w, h = im.size
        # Cut-outs keep their alpha; WebP carries it and is far smaller than
        # the source PNGs. Photographs flatten to RGB.
        has_alpha = im.mode in ('RGBA', 'LA') and im.getchannel('A').getextrema()[0] < 255
        im = im.convert('RGBA' if has_alpha else 'RGB')
        name = f'{slug}{"" if i == 0 else f"-{i+1}"}.webp'
        im.save(OUT + name, 'WEBP', quality=90, method=6)
        out.append(dict(row=row, slug=slug, path='/stock/' + name, w=w, h=h,
                        alpha=has_alpha, pos=i,
                        kb_src=os.path.getsize(SRC + f) // 1024,
                        kb_out=os.path.getsize(OUT + name) // 1024))

json.dump(out, open('images.json', 'w'), indent=1)
print(f'{len(out)} images written to {OUT}')
print(f'source {sum(o["kb_src"] for o in out)} KB -> webp {sum(o["kb_out"] for o in out)} KB')
print()
print(f'{"row":>4} {"px":>10}  {"KB":>4}  path')
for o in out:
    warn = '  << low resolution' if min(o['w'], o['h']) < 400 else ''
    print(f'{o["row"]:>4} {o["w"]}x{o["h"]:<6} {o["kb_out"]:>4}  {o["path"]}{warn}')
