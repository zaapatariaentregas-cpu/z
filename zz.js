// Zaapataria Features: Favoritos + Destaques + Cores — v2
(function(){
var F='zz_favs';
function gF(){try{return JSON.parse(localStorage.getItem(F)||'[]')}catch(e){return[]}}
function sF(a){try{localStorage.setItem(F,JSON.stringify(a))}catch(e){}}
function tF(id){var a=gF(),i=a.indexOf(id);if(i>=0)a.splice(i,1);else a.push(id);sF(a);return i<0}
function iF(id){return gF().indexOf(id)>=0}
function mkH(id,big){
  var b=document.createElement('button');
  b.className='zz-fav';
  b.setAttribute('data-fid',id);
  var base='background:rgba(255,255,255,.9);border:none;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;line-height:1;';
  b.style.cssText=base+(big?'font-size:22px;width:38px;height:38px;':'font-size:14px;width:28px;height:28px;position:absolute;top:8px;right:8px;z-index:5;');
  b.innerHTML=iF(id)?'❤️':'🤍';
  b.addEventListener('click',function(e){
    e.preventDefault();e.stopPropagation();
    var on=tF(id);
    document.querySelectorAll('.zz-fav[data-fid="'+id+'"]').forEach(function(x){x.innerHTML=on?'❤️':'🤍';});
  });
  return b;
}
function injectCards(){
  document.querySelectorAll('[data-product-id]:not([data-zf])').forEach(function(c){
    c.setAttribute('data-zf','1');
    var id=c.getAttribute('data-product-id');
    var wrap=c.querySelector('.js-product-item-image-link-private,.js-item-image-link,a');
    if(!wrap)return;
    wrap.style.position='relative';
    wrap.appendChild(mkH(id,false));
  });
}
function injectPDP(){
  if(!location.pathname.includes('/produtos/'))return;
  var title=document.querySelector('.js-product-name');
  if(!title||title.querySelector('.zz-fav'))return;
  var id=location.pathname.replace(/\/$/,'').split('/').pop().split('?')[0];
  var h=mkH(id,true);
  h.style.cssText+='vertical-align:middle;margin-left:8px;display:inline-flex;position:static;flex-shrink:0;';
  title.style.display='flex';
  title.style.alignItems='center';
  title.style.flexWrap='wrap';
  title.appendChild(h);
}
function injectDest(){
  if(!location.pathname.includes('/produtos/'))return;
  if(document.querySelector('.zz-dest'))return;
  var specTable=null;
  document.querySelectorAll('.user-content table,table').forEach(function(t){
    if(!specTable&&t.textContent.includes('Modelo')){specTable=t;}
  });
  if(!specTable)return;
  var rows=specTable.querySelectorAll('tr');
  var items=[];
  var skip=['Setor','Referência','Numeração'];
  for(var i=0;i<rows.length&&items.length<4;i++){
    var cells=rows[i].querySelectorAll('td,th');
    if(cells.length<2)continue;
    var k=cells[0].textContent.trim();
    var v=cells[1].textContent.trim();
    if(k&&v&&skip.indexOf(k)<0)items.push('<strong>'+k+':</strong> '+v);
  }
  if(items.length===0)return;
  var price=document.querySelector('.js-price-container');
  if(!price)return;
  var dest=document.createElement('ul');
  dest.className='zz-dest';
  dest.style.cssText='margin:0 0 12px;padding:0;list-style:none;font-size:13px;';
  items.forEach(function(txt){
    var li=document.createElement('li');
    li.style.cssText='padding:2px 0;display:flex;align-items:baseline;gap:5px;color:#444;';
    li.innerHTML='<span style="color:#2e7d32;font-weight:700;">✓</span> '+txt;
    dest.appendChild(li);
  });
  price.parentElement.insertBefore(dest,price);
}
var COR={'preto':'#111111','preto e branco':'#111111','branco':'#FFFFFF','branco off':'#F5F0E5','off white':'#F5F0E5','offwhite':'#F5F0E5','nude':'#D4A57E','bege':'#C8A882','prata':'#B8B8C0','prateado':'#B8B8C0','dourado':'#CCA32A','gold':'#CCA32A','rose gold':'#C98074','cobre':'#B87333','bronze':'#CD7F32','rosa':'#E8A0B4','rosa velho':'#BC8F8F','salmao':'#F4A08C','coral':'#F4836A','vermelho':'#CC1A1A','bordo':'#800020','vinho':'#7B1F2E','azul':'#1A5296','azul marinho':'#001F5B','marinho':'#001F5B','azul royal':'#1A3A9C','azul bebe':'#89C4E1','turquesa':'#40E0D0','caramelo':'#C0833A','mel':'#D4924A','amendoa':'#C4A882','areia':'#D9C8A5','taupe':'#8B7D6B','cinza':'#828282','grafite':'#4A4A4A','menta':'#8ECFB0','verde':'#2E7D32','verde militar':'#4B5320','laranja':'#E67300','lilas':'#B09DC4','roxo':'#6B2FA0','cafe':'#6B3B1E','marrom':'#6B3B1E','chocolate':'#5C2E0A','multicolor':'#CCCCCC','animal print':'#C8A056'};
function corHex(name){if(!name)return'#CCCCCC';var k=name.toLowerCase().trim();if(COR[k])return COR[k];for(var kk in COR){if(k.indexOf(kk)>=0||kk.indexOf(k)>=0)return COR[kk];}return'#CCCCCC';}
function isLight(hex){var h=hex.replace('#','');var r=parseInt(h.substr(0,2),16),g=parseInt(h.substr(2,2),16),b=parseInt(h.substr(4,2),16);return(0.299*r+0.587*g+0.114*b)>180;}
function applyCorColors(){
  if(!location.pathname.includes('/produtos/'))return;
  document.querySelectorAll('.zz-cores-l a:not([data-zzc])').forEach(function(a){
    a.setAttribute('data-zzc','1');
    var colorName=a.getAttribute('title')||'';
    var hex=corHex(colorName);
    var isOn=a.classList.contains('on');
    var bdrColor=isOn?'#111111':(isLight(hex)?'#BBBBBB':'#DDDDDD');
    var bdrWidth=isOn?'2.5px':'1.5px';
    a.style.cssText='display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;background:'+hex+';border:'+bdrWidth+' solid '+bdrColor+';overflow:hidden;flex-shrink:0;box-shadow:'+(isOn?'0 0 0 2px rgba(17,17,17,0.15)':'none')+';';
    var img=a.querySelector('img');
    if(img)img.style.display='none';
  });
  var cl=document.querySelector('.zz-cores-l');
  if(cl&&!cl.dataset.zzc){cl.dataset.zzc='1';cl.style.cssText='display:flex;gap:8px;flex-wrap:wrap;align-items:center;';}
}
function run(){injectCards();injectPDP();injectDest();applyCorColors();}
if(document.readyState!=='loading')run();
else document.addEventListener('DOMContentLoaded',run);
var t=setInterval(run,1000);
setTimeout(function(){clearInterval(t);},12000);
})();
