(function(){var vw=document.documentElement.clientWidth,doc=document.documentElement.scrollWidth,bad=[],seen=new Set();
var root=document.querySelector('.pli')||document.body;
root.querySelectorAll('*').forEach(function(e){var r=e.getBoundingClientRect();if(!r.width)return;var cs=getComputedStyle(e);
var inScroll=false,p=e.parentElement;while(p&&p!==document.body){var o=getComputedStyle(p).overflowX;if(o==='auto'||o==='scroll'){inScroll=true;break;}p=p.parentElement;}
if(!inScroll&&r.right>vw+1&&cs.position!=='fixed'){var k=(e.className&&typeof e.className==='string'?e.className.split(' ')[0]:e.tagName);if(!seen.has(k)){seen.add(k);bad.push('over:'+k+'@'+Math.round(r.right));}}
if((cs.overflow==='hidden'||cs.textOverflow==='ellipsis')&&e.scrollWidth>e.clientWidth+2&&e.children.length===0){var k2=(e.className||e.tagName)+'';if(!seen.has('t'+k2)){seen.add('t'+k2);bad.push('clip:'+k2.slice(0,25));}}
});
var small=0;root.querySelectorAll('p,span,a,li,div').forEach(function(e){if(e.childNodes.length&&[].some.call(e.childNodes,function(n){return n.nodeType===3&&n.textContent.trim()})){var fs=parseFloat(getComputedStyle(e).fontSize);if(fs<11)small++;}});
return [location.pathname,'vw'+vw,'doc'+doc,'small<11px:'+small,bad.slice(0,8).join(' ')];})()
