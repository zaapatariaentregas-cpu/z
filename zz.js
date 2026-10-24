// Zaapataria Features: Favoritos + Destaques — v1
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
    document.querySelectorAll('.zz-fav[data-fid="'+id+'"]').forEach(function(x){x.innerHTML=on?'❤️':'🤍'});
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
  h.style.cssText+='vertical-align:middle;margin-left:8px;display:inline-flex;position:static;';
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

function run(){injectCards();injectPDP();injectDest();}
if(document.readyState!=='loading')run();
else document.addEventListener('DOMContentLoaded',run);
var t=setInterval(run,1000);
setTimeout(function(){clearInterval(t);},12000);
})();
