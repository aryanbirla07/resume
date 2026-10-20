"""Seeded, original texture maps for a darker stone / timber / leather palette.
The procedural results are prototyping textures, not photogrammetry.
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import gaussian_filter

OUT=Path(__file__).resolve().parents[1]/'public'/'textures'
OUT.mkdir(parents=True,exist_ok=True)
seed=61;rng=np.random.default_rng(seed)
N=1024

def octave_noise(n=N):
    accum=np.zeros((n,n),np.float32)
    for radius,amp in [(1.5,0.14),(5,0.21),(16,0.25),(43,.27),(112,.14)]:
        r=rng.normal(0,1,(n,n)).astype(np.float32)
        r=gaussian_filter(r,radius,mode='wrap')
        r=(r-r.mean())/(r.std()+1e-5)
        accum+=r*amp
    return np.clip(accum,-3,3)

noise=octave_noise()
blocks=np.zeros((N,N),np.float32)
seams=np.zeros((N,N),np.uint8)
canvas=Image.new('L',(N,N),0); draw=ImageDraw.Draw(canvas)
block_idx=0
# staggered weathered masonry courses with variable course widths
rows=[(0,151),(151,288),(288,444),(444,576),(576,723),(723,870),(870,1024)]
for ridx,(y0,y1) in enumerate(rows):
    x=-((ridx%2)*80+int(rng.integers(0,50)))
    while x<N:
        width=int(rng.integers(205,340));x2=x+width
        yy0=y0+int(rng.integers(0,3)); yy1=y1-int(rng.integers(2,5))
        val=rng.uniform(.84,1.17)
        a=max(0,x+4);b=min(N,x2-4)
        if b>a:blocks[yy0:yy1,a:b]=val
        # mortar is shaded by the normal map and random dark pigment
        draw.rectangle((x,y0,x2,y1),outline=255,width=4)
        draw.line([(x+8,y1-3),(x2-12,y1-3)],fill=160,width=2)
        x=x2
# seams apply dark shading at course boundaries
seams=np.asarray(canvas).astype(np.float32)/255
rougher=octave_noise()
base=np.zeros((N,N,3),np.float32)
palette=np.array([109,111,106],np.float32)
for c,f in enumerate([1.0,1.02,.98]):
    base[:,:,c]=palette[c]*(.76+.22*blocks)+noise*(11.0*f)+rougher*4.5
base-=seams[:,:,None]*47
# muted damp/moss pockets; rarely let the stone look clean and uniform
moss_noise=gaussian_filter(rng.random((N,N),dtype=np.float32),21,mode='wrap')
moss_noise=(moss_noise-moss_noise.mean())/(moss_noise.std()+1e-5)
moss=np.clip((moss_noise-.95)*.10,0,.15)
base[:,:,0]=base[:,:,0]*(1-moss)+55*moss
base[:,:,1]=base[:,:,1]*(1-moss)+80*moss
base[:,:,2]=base[:,:,2]*(1-moss)+61*moss
# fine erosion, scratches and flaking paint applied using PIL
im=Image.fromarray(np.uint8(np.clip(base,0,255)),'RGB')
draw=ImageDraw.Draw(im,'RGBA')
for _ in range(350):
    x=int(rng.integers(0,N));y=int(rng.integers(0,N))
    length=int(rng.integers(4,45));shift=int(rng.integers(-12,12))
    draw.line([(x,y),(x+shift,y+length)],fill=(17,21,21,int(rng.integers(14,63))),width=int(rng.integers(1,3)))
for _ in range(110):
    x=int(rng.integers(0,N));y=int(rng.integers(0,N));r=int(rng.integers(2,10))
    draw.ellipse((x-r,y-r,x+r,y+r),fill=(12,22,16,25))
im.save(OUT/'aged-stone-color.jpg',quality=91,subsampling=0)
height=noise*.30+rougher*.20-seams*1.1
height=gaussian_filter(height,.55,mode='wrap')
grad_y,grad_x=np.gradient(height)
vec=np.stack([-grad_x*.32,-grad_y*.32,np.ones_like(height)],axis=-1)
vec/=np.maximum(np.linalg.norm(vec,axis=2,keepdims=True),1e-5)
normal=np.uint8(np.clip((vec*.5+.5)*255,0,255))
Image.fromarray(normal,'RGB').save(OUT/'aged-stone-normal.jpg',quality=93,subsampling=0)
rgh=np.uint8(np.clip(220+noise*7+seams*8,0,255))
Image.fromarray(rgh,'L').save(OUT/'aged-stone-roughness.jpg',quality=92)
# Directional grain texture for structural timber
W=768;H=768
u=np.arange(W,dtype=np.float32)[None,:];v=np.arange(H,dtype=np.float32)[:,None]
line=np.sin(u*.095+np.sin(u*.017)*3+np.sin(v*.004)*.7)
line2=np.sin(u*.32+v*.003)
filament=octave_noise(W)
woodval=np.clip(52+line*13+line2*4+filament*6,22,100)
woodmap=np.stack([woodval*1.08,woodval*.86,woodval*.70],axis=-1).astype('uint8')
Image.fromarray(woodmap,'RGB').save(OUT/'aged-timber-color.jpg',quality=90)
# Fine leather variation with pores, not cartoon gloss
Q=512; leather_noise=octave_noise(Q)
leatherv=np.clip(47+leather_noise*8,20,75)
leather=np.stack([leatherv*1.12,leatherv*.91,leatherv*.78],axis=-1).astype('uint8')
Image.fromarray(leather,'RGB').save(OUT/'old-leather-color.jpg',quality=89)
print('Generated',*[p.name for p in OUT.glob('aged-*')],sep='\n  ')
