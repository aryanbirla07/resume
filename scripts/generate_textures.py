"""Create original, distributable procedural PBR-ish textures. No stock art."""
from pathlib import Path
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
OUT=Path(__file__).resolve().parents[1]/'public'/'textures'
OUT.mkdir(parents=True,exist_ok=True)
rng=np.random.default_rng(20261020)
SIZE=768

def noise(size=SIZE):
    a=np.zeros((size,size),dtype=np.float32)
    weights=[(5,.38),(15,.24),(35,.16),(100,.11),(size,.11)]
    for n,w in weights:
        tile=rng.random((n,n))*255
        small=Image.fromarray(tile.astype('uint8')).resize((size,size),Image.Resampling.BICUBIC)
        a+=np.array(small,dtype=np.float32)*w
    return np.clip(a,0,255)

def save_img(arr,name,quality=84):
    Image.fromarray(np.uint8(np.clip(arr,0,255)),'RGB').save(OUT/name,quality=quality,optimize=True)

def normal_map(height, name, amt=3.5):
    gy,gx=np.gradient(height.astype(np.float32)/255)
    x=-gx*amt;y=-gy*amt;z=np.ones_like(x)
    norm=np.sqrt(x*x+y*y+z*z)
    arr=np.stack([(x/norm+1)*127.5,(y/norm+1)*127.5,(z/norm+1)*127.5],axis=-1)
    save_img(arr,name,88)

N=noise(); h,w=N.shape
brickH=72;brickW=148
height=np.zeros((h,w),dtype=np.float32)
color=np.zeros((h,w,3),dtype=np.float32)
base=np.array([90,91,96],np.float32)
for y in range(h):
    row=y//brickH; offs=(row%2)*brickW//2
    xCoord=(np.arange(w)+offs)%brickW
    distX=np.minimum(xCoord,brickW-xCoord)
    distY=min(y%brickH,brickH-y%brickH)
    border=np.minimum(distX,distY)
    # Deep shaded mortar lines and rough stone faces
    mossy=np.sin((np.arange(w)*.013)+(row*.55))*.6
    mortar=np.clip(border/4.8,0,1)
    tone=(N[y]-135)*.19+(np.sin(np.arange(w)*.07+y*.052))*3.2
    tint=np.array([((row*17+(np.arange(w)+offs)//brickW*13)%17)-8]*3).T
    color[y]=base+tone[:,None]+tint*.34
    color[y,:]*=(.43+.57*mortar[:,None])
    height[y]=120+(N[y]-128)*.55+54*mortar
# speckles + fine cracks
im=Image.fromarray(np.uint8(np.clip(color,0,255)),'RGB')
d=ImageDraw.Draw(im,'RGB')
for _ in range(190):
    x=int(rng.integers(0,w));y=int(rng.integers(0,h))
    if rng.random()<.5:d.line([(x,y),(x+int(rng.integers(-12,13)),y+int(rng.integers(3,32)))], fill=(45,46,51), width=1)
for _ in range(1600):
    x=int(rng.integers(0,w));y=int(rng.integers(0,h))
    c=int(rng.integers(70,150));d.point((x,y),fill=(c,c+1,c+3))
im.save(OUT/'stone-wall.jpg',quality=88,optimize=True)
normal_map(height,'stone-normal.jpg',7)

N=noise()
color=np.zeros((SIZE,SIZE,3),dtype=np.float32)
hgt=np.zeros((SIZE,SIZE),dtype=np.float32)
for y in range(SIZE):
    row=y//44; shift=(row%2)*49
    xx=(np.arange(SIZE)+shift)%97
    dd=np.minimum(xx,97-xx)
    edge=np.minimum(np.minimum(dd, (y%44)), 44-(y%44))
    line=np.clip(edge/3,0,1)
    v=(N[y]-125)*.14+((row*19 + np.arange(SIZE)//97*8)%19-9)
    color[y]=np.array([40,57,68])+v[:,None]
    color[y]*=(.47+.53*line[:,None])
    hgt[y]=118+N[y]*.3+70*line
save_img(color,'roof-slate.jpg');normal_map(hgt,'roof-normal.jpg',5)

N=noise();noise2=noise();
soil=np.stack([20+N*.19+noise2*.02,25+N*.2+noise2*.04,24+N*.17+noise2*.04],-1)
# scattered natural grit
im=Image.fromarray(soil.astype('uint8'),'RGB');d=ImageDraw.Draw(im)
for _ in range(17000):
    x=int(rng.integers(0,SIZE));y=int(rng.integers(0,SIZE));q=int(rng.integers(20,50))
    d.ellipse((x,y,x+int(rng.integers(1,5)),y+int(rng.integers(1,4))), fill=(q+4,q+9,q+6))
im.save(OUT/'forest-ground.jpg',quality=86,optimize=True)

# circular radial sprite, white center with gentle alpha falloff
sz=128
y,x=np.mgrid[0:sz,0:sz]
r=np.sqrt((x-sz/2)**2+(y-sz/2)**2)/(sz/2)
a=(np.clip(1-r,0,1)**2.8*255).astype('uint8')
sprite=np.zeros((sz,sz,4),dtype='uint8');sprite[:,:,:3]=[251,222,156];sprite[:,:,3]=a
Image.fromarray(sprite,'RGBA').save(OUT/'ember.png',optimize=True)

# parchment paper for cards
N=noise(768);N2=noise(768)
base=np.stack([205+N*.18,189+N*.16,153+N*.13],axis=-1)
H,W=N.shape
y,x=np.mgrid[0:H,0:W];edge=(np.minimum.reduce([x,y,W-1-x,H-1-y]).astype(float)/48)
edge=np.clip(edge,0,1)
base*=.88+.12*edge[:,:,None]
save_img(base,'parchment.jpg')
print('Textures generated:',list(sorted(p.name for p in OUT.iterdir())))
