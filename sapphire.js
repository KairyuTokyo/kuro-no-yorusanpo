'use strict';
// Additive 7th-goal event. Existing physics, music list and normal rewards remain owned by index.html.
const SAPPHIRE_KEY='kuroVividBlueSapphire';
let sapphireOwned=false,sapphireEvent=null,sapphireSaveFailed=false;
try{sapphireOwned=localStorage.getItem(SAPPHIRE_KEY)==='1'}catch{}
function syncSapphireOwnership(){try{sapphireOwned=sapphireOwned||localStorage.getItem(SAPPHIRE_KEY)==='1'}catch{}}
window.addEventListener('storage',e=>{if(e.key===SAPPHIRE_KEY)syncSapphireOwnership()});
function sapphireCollection(){syncSapphireOwnership();return '<div class="sapphireCollection">'+(sapphireOwned?'<img src="assets/images/vivid_blue_sapphire.png" alt="Kuro’s sapphire">💎 KURO\'S VIVID BLUE SAPPHIRE ×1<small>Awarded for reaching the 7th Aurora Goal.</small>':'<div class="sapphireMystery" aria-hidden="true"></div>???')+'</div>'}
function updateSapphireCollection(){document.querySelectorAll('.sapphireCollection').forEach(e=>e.remove());$('#message').insertAdjacentHTML('beforeend',sapphireCollection())}
updateSapphireCollection();
function beginSapphireEvent(){
 syncSapphireOwnership();const repeat=sapphireOwned;
 if(!repeat){sapphireOwned=true;try{localStorage.setItem(SAPPHIRE_KEY,'1')}catch{sapphireSaveFailed=true}}
 state='sapphire';pauseBgm();$('#start').hidden=true;$('#start').disabled=true;
 sapphireEvent={time:0,repeat,finished:false};
 const el=document.createElement('section');el.id='sapphireEvent';el.className='hidden';el.setAttribute('role','dialog');el.setAttribute('aria-label','7th stage special reward');el.setAttribute('aria-modal','true');
 el.innerHTML='<canvas id="sapphireBackdrop"></canvas><canvas id="sapphireFx"></canvas><div id="sapphireContent"><div id="sapphireCopy"><small>7th STAGE SPECIAL REWARD</small><h2>VIVID BLUE SAPPHIRE</h2><p>KURO\'S SAPPHIRE</p><p>The color of Kuro\'s eyes.</p><strong>LEGENDARY ITEM ACQUIRED</strong></div><div id="sapphireGemSpace"><img id="sapphireGem" src="assets/images/vivid_blue_sapphire.png" alt="Vivid blue sapphire"></div><canvas id="sapphireCats"></canvas></div><button id="sapphireNext" hidden>NEXT STAGE ▶</button>';
 $('#game').append(el);if(repeat){$('#sapphireCopy').innerHTML='<h2>KURO\'S SAPPHIRE</h2><strong>ACQUIRED</strong>'}
 if(sapphireSaveFailed)$('#sapphireCopy').insertAdjacentHTML('beforeend','<p id="sapphireSaveNote">保存できませんでした。ブラウザの保存設定をご確認ください。</p>');
 $('#sapphireNext').onclick=()=>{if(!sapphireEvent?.finished)return;el.remove();sapphireEvent=null;state='stageclear';$('#start').hidden=false;$('#start').disabled=false;$('#start').click()};
 // Ordinary STAGE CLEAR remains visible for the first 1.6 seconds, with progression locked.
}
function sapphireCanvas(id){const c=$(id),r=c.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);const w=Math.max(1,r.width),h=Math.max(1,r.height);if(c.width!==Math.round(w*d)||c.height!==Math.round(h*d)){c.width=Math.round(w*d);c.height=Math.round(h*d)}const g=c.getContext('2d');g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,w,h);return {g,w,h}}
function drawRewardCats(t){
 const {g,w,h}=sapphireCanvas('#sapphireCats'),cw=Math.min(w*.43,h*1.45),ch=cw*196/317,foot=h-8;
 const poses=[[0,w*.27],[1,w*.73]];let eyes=[];
 for(const [which,x] of poses){const b=BOUNDS[which*4];g.save();g.translate(x,foot);const surprise=which===1&&t>5&&t<6.2?Math.sin((t-5)*Math.PI/1.2)*12:0;g.translate(0,-surprise);g.rotate(t>4?(which===0?-.10:.10):0);if(which===1){g.scale(-1,1)}g.drawImage(images.atlas,...b,-cw/2,-ch,cw,ch);
 if(which===0&&t>2){const k=cw/317;g.globalCompositeOperation='screen';for(const [ex,ey] of [[224,81],[270,77]]){const px=-cw/2+ex*k,py=-ch+ey*k;const glow=g.createRadialGradient(px,py,1,px,py,22*k);glow.addColorStop(0,'#23cfff');glow.addColorStop(.3,'#008cffcc');glow.addColorStop(1,'#008cff00');g.fillStyle=glow;g.fillRect(px-22*k,py-22*k,44*k,44*k);eyes.push({x:x+px,y:foot+py})}}
 if(which===1&&t>5&&t<6.2){g.fillStyle='#c6faff';g.font='bold 24px sans-serif';g.fillText('!',-cw*.12,-ch-2)}g.restore()}
 return eyes;
}
function tickSapphire(dt){
 const e=sapphireEvent;if(!e)return;if(!document.hidden)e.time+=dt;const t=e.time;if(t<1.6)return;
 $('#sapphireEvent').classList.remove('hidden');if(t>1.85)$('#sapphireEvent').classList.add('fading');
 const {g:back,w: bw,h:bh}=sapphireCanvas('#sapphireBackdrop');if(images.bg){const im=images.bg,r=bw/bh,sr=im.width/im.height;let sw=im.width,sh=im.height,sx=0,sy=0;if(r<sr){sw=sh*r;sx=(im.width-sw)*.5}else{sh=sw/r;sy=Math.max(0,Math.min(im.height-sh,im.height*.66-sh*.66))}back.drawImage(im,sx,sy,sw,sh,0,0,bw,bh);}
 const eyes=drawRewardCats(t);const {g,w,h}=sapphireCanvas('#sapphireFx');const cr=$('#sapphireCats').getBoundingClientRect(),er=$('#sapphireEvent').getBoundingClientRect(),gr=$('#sapphireGemSpace').getBoundingClientRect();const center={x:gr.left-er.left+gr.width/2,y:gr.top-er.top+gr.height/2};
 if(t>2&&t<5.5&&!e.repeat){g.globalCompositeOperation='lighter';for(let i=0;i<70;i++){const p=((t-2)*.42+i/70)%1,eye=eyes[i%2]||{x:cr.width*.3,y:cr.height*.5};const sx=cr.left-er.left+eye.x,sy=cr.top-er.top+eye.y;const x=sx+(center.x-sx)*p+Math.sin(p*Math.PI)*Math.sin(i)*25,y=sy+(center.y-sy)*p;g.fillStyle='#159eff';g.shadowColor='#009dff';g.shadowBlur=10;g.beginPath();g.arc(x,y,1.4+p*2,0,Math.PI*2);g.fill()}}
 if(t>(e.repeat?1.6:5)){$('#sapphireCopy').classList.add('show');$('#sapphireGem').classList.add('show')}
 if(t>10&&t<14&&!e.repeat){g.globalCompositeOperation='lighter';const f=Math.sin((t-10)/4*Math.PI);const glow=g.createRadialGradient(w*.5,h*.12,0,w*.5,h*.12,w*.65);glow.addColorStop(0,'rgba(40,255,207,'+f*.65+')');glow.addColorStop(.45,'rgba(0,150,255,'+f*.35+')');glow.addColorStop(1,'transparent');g.fillStyle=glow;g.fillRect(0,0,w,h);for(let i=0;i<90;i++){const p=((t-10)*.4+i/90)%1;g.fillStyle='#54cfff';g.beginPath();g.arc(center.x+Math.sin(i*7+p*5)*p*w*.33,center.y*(1-p),2,0,Math.PI*2);g.fill()}}
 g.globalCompositeOperation='source-over';g.shadowBlur=0;
 if(t>=(e.repeat?3.6:14)&&!e.finished){e.finished=true;updateSapphireCollection();$('#sapphireNext').hidden=false;$('#sapphireNext').focus({preventScroll:true})}
}
