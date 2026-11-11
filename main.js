/* THEMINDCURATOR v3 — interactions: veil, spotlight, word reveal, wall tilt, counters, clock */
(function(){
'use strict';
/* veil */
var veil=document.getElementById('veil');
window.addEventListener('load',function(){ setTimeout(function(){ veil&&veil.classList.add('out'); },350); });
setTimeout(function(){ veil&&veil.classList.add('out'); },2600);
document.querySelectorAll('a[href]').forEach(function(a){
  var h=a.getAttribute('href');
  if(!h||h.charAt(0)==='#'||a.target==='_blank'||h.indexOf('mailto:')===0) return;
  a.addEventListener('click',function(e){
    if(!veil) return;
    e.preventDefault();
    veil.classList.remove('out');
    setTimeout(function(){ location.href=h; },520);
  });
});
/* header state + mobile nav */
var hd=document.querySelector('header');
addEventListener('scroll',function(){ hd&&hd.classList.toggle('scrolled',scrollY>40); },{passive:true});
var mn=document.getElementById('mnav');
document.getElementById('burger')&&document.getElementById('burger').addEventListener('click',function(){ mn.classList.add('open'); });
document.getElementById('mnavClose')&&document.getElementById('mnavClose').addEventListener('click',function(){ mn.classList.remove('open'); });
/* spotlight follows pointer on dark rooms */
document.querySelectorAll('.door,.wall-sec,.curators').forEach(function(sec){
  sec.addEventListener('pointermove',function(e){
    var r=sec.getBoundingClientRect();
    sec.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
    sec.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
  });
});
/* reveals */
var io=new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } }); },{threshold:.12});
document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
/* manifesto word lighting */
var words=document.querySelectorAll('.manifesto .big .w');
function light(){
  var mid=innerHeight*.62;
  words.forEach(function(w){ var r=w.getBoundingClientRect(); w.classList.toggle('lit', r.top<mid); });
}
/* gallery wall tilt flattens on scroll */
var wall=document.querySelector('.wall');
function tilt(){
  if(!wall) return;
  var r=wall.getBoundingClientRect();
  var p=Math.min(1,Math.max(0,(innerHeight-r.top)/(innerHeight*.9)));
  wall.style.setProperty('--tilt',(14*(1-p)).toFixed(2)+'deg');
  wall.querySelectorAll('.frame').forEach(function(f){ f.style.setProperty('--tilt',(14*(1-p)).toFixed(2)+'deg'); });
}
var tick=false;
addEventListener('scroll',function(){ if(!tick){ tick=true; requestAnimationFrame(function(){ light(); tilt(); tick=false; }); } },{passive:true});
light(); tilt();
/* counters */
var cio=new IntersectionObserver(function(es){ es.forEach(function(en){
  if(!en.isIntersecting) return; cio.unobserve(en.target);
  var el=en.target,end=+el.dataset.count,t0=null;
  function step(t){ if(!t0)t0=t; var p=Math.min(1,(t-t0)/1300); el.innerHTML=Math.round(end*(1-Math.pow(1-p,3)))+(el.dataset.suffix||''); if(p<1) requestAnimationFrame(step); }
  requestAnimationFrame(step);
}); },{threshold:.4});
document.querySelectorAll('[data-count]').forEach(function(el){ cio.observe(el); });
/* lightbox over gallery frames */
var frames=[].slice.call(document.querySelectorAll('.frame'));
var lb=document.getElementById('lightbox'), lbImg=document.getElementById('lbImg'),
    lbT=document.getElementById('lbTitle'), lbM=document.getElementById('lbMeta'), lbL=document.getElementById('lbLink'), cur=0;
function openLB(i){
  if(!frames.length||!lb) return; cur=(i+frames.length)%frames.length;
  var f=frames[cur], img=f.querySelector('img'), a=f.querySelector('a');
  lbImg.src=img.src;
  lbT.textContent=(f.querySelector('.pn')||{}).textContent||'';
  lbM.textContent=(f.querySelector('.pm')||{}).textContent||'';
  lbL.href=a?a.href:'#';
  lb.classList.add('open'); document.body.style.overflow='hidden';
}
function closeLB(){ lb&&lb.classList.remove('open'); document.body.style.overflow=''; }
frames.forEach(function(f,i){ f.addEventListener('click',function(e){ e.preventDefault(); openLB(i); });
  /* per-frame pointer tilt */
  f.addEventListener('pointermove',function(e){ var r=f.getBoundingClientRect();
    var x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    var m=f.querySelector('.mat'); if(m) m.style.transform='rotateY('+(x*7)+'deg) rotateX('+(-y*7)+'deg)'; });
  f.addEventListener('pointerleave',function(){ var m=f.querySelector('.mat'); if(m) m.style.transform=''; });
});
document.getElementById('lbClose')&&document.getElementById('lbClose').addEventListener('click',closeLB);
document.getElementById('lbPrev')&&document.getElementById('lbPrev').addEventListener('click',function(){ openLB(cur-1); });
document.getElementById('lbNext')&&document.getElementById('lbNext').addEventListener('click',function(){ openLB(cur+1); });
lb&&lb.addEventListener('click',function(e){ if(e.target===lb) closeLB(); });
addEventListener('keydown',function(e){ if(!lb||!lb.classList.contains('open')) return;
  if(e.key==='Escape') closeLB(); if(e.key==='ArrowLeft') openLB(cur-1); if(e.key==='ArrowRight') openLB(cur+1); });
/* admission tag flips on click */
var tag=document.querySelector('.tag');
if(tag){ var inner=document.createElement('div'); inner.id='tagFlip';
  var card=tag.querySelector('.card');
  var back=document.createElement('div'); back.className='card back';
  back.innerHTML='<div class="tn">SAY THE WORD</div><div class="tt">DM \'START\'<br>on Instagram</div><div class="ts">Tap to flip back</div>';
  tag.insertBefore(inner,card); inner.appendChild(card); inner.appendChild(back);
  tag.style.cursor='pointer';
  tag.addEventListener('click',function(){ tag.classList.toggle('flipped'); });
}
/* service label hover preview (desktop) */
var pv=document.createElement('div'); pv.id='svcPreview'; pv.innerHTML='<img alt="">'; document.body.appendChild(pv);
document.querySelectorAll('.label-row[data-img]').forEach(function(r){
  r.addEventListener('pointerenter',function(){ pv.querySelector('img').src=r.dataset.img; pv.classList.add('on'); });
  r.addEventListener('pointerleave',function(){ pv.classList.remove('on'); });
});
addEventListener('pointermove',function(e){ pv.style.left=(e.clientX+22)+'px'; pv.style.top=(e.clientY-80)+'px'; });
/* magnetic tickets */
document.querySelectorAll('.big-ticket,.ticket-btn').forEach(function(b){
  b.addEventListener('pointermove',function(e){ var r=b.getBoundingClientRect();
    b.style.translate=((e.clientX-r.left)/r.width-.5)*7+'px '+((e.clientY-r.top)/r.height-.5)*7+'px'; });
  b.addEventListener('pointerleave',function(){ b.style.translate=''; });
});
/* room chip tracks the room you are in (home) */
if(document.querySelector('.door')) document.body.classList.add('home');
var chip=document.getElementById('roomChip');
if(chip){
  var rooms=[['.door','ROOM 01 — THE DOOR'],['.manifesto','ROOM 02 — MANIFESTO'],['.wall-sec','ROOM 03 — THE GALLERY WALL'],['.labels','ROOM 04 — WALL LABELS'],['.curators','ROOM 05 — THE CURATORS'],['.finale','ROOM 06 — EXHIBIT № 07']];
  var rio=new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ var r=rooms.find(function(x){ return en.target.matches(x[0]); }); if(r) chip.innerHTML=r[1].replace('№','<em>№</em>'); } }); },{threshold:.35});
  rooms.forEach(function(r){ var el=document.querySelector(r[0]); el&&rio.observe(el); });
}
/* Hyderabad clock */
var clk=document.getElementById('hydClock');
function tickClock(){
  try{
    var d=new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Kolkata'}));
    var days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var h=d.getHours(),ap=h>=12?'pm':'am'; h=h%12||12;
    var s=days[d.getDay()]+' '+String(h).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')+':'+String(d.getSeconds()).padStart(2,'0')+' '+ap+' — Hyderabad';
    if(clk) clk.textContent=s;
    var em=document.querySelector('.day-emoji'); if(em){ var hr=d.getHours(); document.querySelectorAll('.day-emoji').forEach(function(e){ e.style.display=(hr>=6&&hr<18)?'':'none'; }); document.querySelectorAll('.night-emoji').forEach(function(e){ e.style.display=(hr>=6&&hr<18)?'none':''; }); }
  }catch(e){}
}
tickClock(); setInterval(tickClock,1000);
})();
