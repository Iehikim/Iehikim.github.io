/* In the Liferay 7.3 content-page editor: edit the HTML of an existing HTML fragment in place. */
window.PLI_EDIT = async function (marker, fn) {
  var req = function (m) { return new Promise(function (res, rej) { Liferay.Loader.require(m, function (x) { res(x); }, rej); }); };
  var FS = (await req('layout-content-page-editor-web@2.0.172/page_editor/app/services/FragmentService')).default;
  var raw = await (await fetch(location.href, { credentials: 'include' })).text();
  var match = function (s, start) {
    var depth = 0, inStr = false, esc = false;
    for (var j = start; j < s.length; j++) {
      var c = s[j];
      if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') inStr = false; continue; }
      if (c === '"') { inStr = true; continue; }
      if (c === '{') depth++; else if (c === '}') { depth--; if (depth === 0) return j; }
    }
    return -1;
  };
  var li = raw.indexOf('"layoutData"'), p = li, st = null, tries = 0;
  while (p > 0 && tries < 300) {
    p = raw.lastIndexOf('{', p - 1); tries++;
    var e = match(raw, p);
    if (e > li) { try { var ob = JSON.parse(raw.slice(p, e + 1)); if (ob.layoutData) { st = ob; break; } } catch (x) { } }
  }
  if (!st) throw new Error('no editor state');
  var K = 'com.liferay.fragment.entry.processor.editable.EditableFragmentEntryProcessor';
  var hits = Object.keys(st.fragmentEntryLinks).map(function (k) { return st.fragmentEntryLinks[k]; }).filter(function (f) {
    var v = f.editableValues && f.editableValues[K] && f.editableValues[K]['element-html'];
    return v && v.ko_KR && v.ko_KR.indexOf(marker) >= 0;
  });
  if (hits.length !== 1) throw new Error('fragments with marker: ' + hits.length);
  var f = hits[0], ev = JSON.parse(JSON.stringify(f.editableValues)), before = ev[K]['element-html'].ko_KR, after = fn(before);
  if (after === before) throw new Error('no change');
  ev[K]['element-html'].ko_KR = after;
  await FS.updateEditableValues({ fragmentEntryLinkId: f.fragmentEntryLinkId, editableValues: ev, onNetworkStatus: function () { } });
  return { before: before.length, after: after.length };
};

window.PA={"ij": {"2005": ["<article class=\"pli-pub has-cv\" data-q=\"disassembly scheduling for products with assembly structure lee, d.-h. international journal of management science \"><span class=\"cv tile\" aria-hidden=\"true\">IJMS</span><div class=\"bd\"><div class=\"t\">Disassembly scheduling for products with assembly structure</div><div class=\"au\"><b>Lee, D.-H.</b></div><div class=\"vn\"><em>International Journal of Management Science</em>, 11: 63-78</div></div></article>"], "2006": ["<article class=\"pli-pub has-cv\" data-q=\"a two-stage heuristic for disassembly scheduling with capacity constraints jeon, h.-b., kim, j.-g., kim, h.-j., and lee, d.-h. international journal of management science \"><span class=\"cv tile\" aria-hidden=\"true\">IJMS</span><div class=\"bd\"><div class=\"t\">A two-stage heuristic for disassembly scheduling with capacity constraints</div><div class=\"au\"><b>Jeon, H.-B.</b>, <b>Kim, J.-G.</b>, <b>Kim, H.-J.</b>, and <b>Lee, D.-H.</b></div><div class=\"vn\"><em>International Journal of Management Science</em>, 12: 95-112</div></div></article>"], "2008": ["<article class=\"pli-pub has-cv\" data-q=\"heuristic algorithms for capacitated collection network design in reverse logistics kim, j.-s., and lee, d.-h. international journal of management science \"><span class=\"cv tile\" aria-hidden=\"true\">IJMS</span><div class=\"bd\"><div class=\"t\">Heuristic algorithms for capacitated collection network design in reverse logistics</div><div class=\"au\"><b>Kim, J.-S.</b>, and <b>Lee, D.-H.</b></div><div class=\"vn\"><em>International Journal of Management Science</em>, 12(2): 45-66</div></div></article>"], "2011": ["<article class=\"pli-pub has-cv\" data-q=\"priority rule based heuristics for the team orienteering problem ha, k.-w., yu, j.-m., park, j.-i., and lee, d.-h. international journal of management science \"><span class=\"cv tile\" aria-hidden=\"true\">IJMS</span><div class=\"bd\"><div class=\"t\">Priority rule based heuristics for the team orienteering problem</div><div class=\"au\"><b>Ha, K.-W.</b>, <b>Yu, J.-M.</b>, Park, J.-I., and <b>Lee, D.-H.</b></div><div class=\"vn\"><em>International Journal of Management Science</em>, 17(1): 79-94</div></div></article>"], "2012": ["<article class=\"pli-pub has-cv\" data-q=\"common due-date assignment and sequencing with sequence-dependent setup times: a case study on a paper remanufacturing system kim, j.-g., kim, j.-s., and lee, d.-h. management science and financial engineering \"><span class=\"cv tile\" aria-hidden=\"true\">MSFE</span><div class=\"bd\"><div class=\"t\">Common due-date assignment and sequencing with sequence-dependent setup times: A case study on a paper remanufacturing system</div><div class=\"au\"><b>Kim, J.-G.</b>, <b>Kim, J.-S.</b>, and <b>Lee, D.-H.</b></div><div class=\"vn\"><em>Management Science and Financial Engineering</em>, 18(1): 1-12</div></div></article>"], "2013": ["<article class=\"pli-pub has-cv\" data-q=\"designing refuse collection networks under capacity and maximum allowable distance constraints kim, j.-s., and lee, d.-h. management science and financial engineering \"><span class=\"cv tile\" aria-hidden=\"true\">MSFE</span><div class=\"bd\"><div class=\"t\">Designing refuse collection networks under capacity and maximum allowable distance constraints</div><div class=\"au\"><b>Kim, J.-S.</b>, and <b>Lee, D.-H.</b></div><div class=\"vn\"><em>Management Science and Financial Engineering</em>, 19(2): 19-29</div></div></article>", "<article class=\"pli-pub has-cv\" data-q=\"common due-date assignment and scheduling on parallel machines with sequence-dependent setup times kim, j.-g., yu, j.-m., and lee, d.-h. management science and financial engineering \"><span class=\"cv tile\" aria-hidden=\"true\">MSFE</span><div class=\"bd\"><div class=\"t\">Common due-date assignment and scheduling on parallel machines with sequence-dependent setup times</div><div class=\"au\"><b>Kim, J.-G.</b>, <b>Yu, J.-M.</b>, and <b>Lee, D.-H.</b></div><div class=\"vn\"><em>Management Science and Financial Engineering</em>, 19(1): 29-36</div></div></article>"], "2018": ["<article class=\"pli-pub has-cv\" data-q=\"mathematical model and solution algorithms for capacitated dynamic lot-sizing in remanufacturing systems cho, y.-h., doh, h.-h., and lee, d.-h. industrial engineering &amp; management systems \"><span class=\"cv tile\" aria-hidden=\"true\">IEMS</span><div class=\"bd\"><div class=\"t\">Mathematical model and solution algorithms for capacitated dynamic lot-sizing in remanufacturing systems</div><div class=\"au\"><b>Cho, Y.-H.</b>, <b>Doh, H.-H.</b>, and <b>Lee, D.-H.</b></div><div class=\"vn\"><em>Industrial Engineering &amp; Management Systems</em>, 17(1): 1-13</div></div></article>"]}, "dj": "<section class=\"pli-ygrp\" data-b=\"2026\"><h3>2026<small>1 paper</small></h3><div><article class=\"pli-pub has-cv\" data-q=\"system-level configuration optimization algorithms for reconfigurable single part flow lines with controllable processing times kim, h.-i., youn, a.-j., and lee, d.-h. journal of the research institute of industrial sciences (산업과학연구소 논문집) \"><span class=\"cv tile\" aria-hidden=\"true\">산업과학<br>연구소</span><div class=\"bd\"><div class=\"t\">System-level Configuration Optimization Algorithms for Reconfigurable Single Part Flow Lines with Controllable Processing Times</div><div class=\"au\"><b>Kim, H.-I.</b>, <b>Youn, A.-J.</b>, and <b>Lee, D.-H.</b></div><div class=\"vn\"><em>Journal of the Research Institute of Industrial Sciences (산업과학연구소 논문집)</em></div></div></article></div></section>", "ic": "<section class=\"pli-ygrp\" data-b=\"2026\"><h3>2026<small>3 papers</small></h3><div><article class=\"pli-pub\" data-q=\"a disassembly leveling and lot-sizing algorithm for a single product type with uncertain component yields kim, h.-i., lee, k.-m., lee, m.-s., kang, j.-h., and lee, d.-h. proceedings of the asia pacific industrial engineering and management systems conference, busan, korea (2026.12) \"><div class=\"bd\"><div class=\"t\">A Disassembly Leveling and Lot-sizing Algorithm for a Single Product Type with Uncertain Component Yields</div><div class=\"au\"><b>Kim, H.-I.</b>, <b>Lee, K.-M.</b>, <b>Lee, M.-S.</b>, Kang, J.-H., and <b>Lee, D.-H.</b></div><div class=\"vn\"><em>Proceedings of the Asia Pacific Industrial Engineering and Management Systems Conference, Busan, Korea (2026.12)</em></div></div></article><article class=\"pli-pub\" data-q=\"priority scheduling approaches for remanufacturing systems with flow-shop-type disassembly, reprocessing and reassembly lines kim, h.-i., bai, c., shim, h., and lee, d.-h. proceedings of the asia pacific industrial engineering and management systems conference, busan, korea (2026.12) \"><div class=\"bd\"><div class=\"t\">Priority Scheduling Approaches for Remanufacturing Systems with Flow-shop-type Disassembly, Reprocessing and Reassembly Lines</div><div class=\"au\"><b>Kim, H.-I.</b>, <b>Bai, C.</b>, <b>Shim, H.</b>, and <b>Lee, D.-H.</b></div><div class=\"vn\"><em>Proceedings of the Asia Pacific Industrial Engineering and Management Systems Conference, Busan, Korea (2026.12)</em></div></div></article><article class=\"pli-pub\" data-q=\"a genetic programming algorithm for multi-objective dynamic hybrid flow shop scheduling with preventive maintenances and reworks under overlapped queue time limits kim, h.-i., and lee, d.-h. proceedings of the asia pacific industrial engineering and management systems conference, busan, korea (2026.12) \"><div class=\"bd\"><div class=\"t\">A Genetic Programming Algorithm for Multi-Objective Dynamic Hybrid Flow Shop Scheduling with Preventive Maintenances and Reworks under Overlapped Queue Time Limits</div><div class=\"au\"><b>Kim, H.-I.</b>, and <b>Lee, D.-H.</b></div><div class=\"vn\"><em>Proceedings of the Asia Pacific Industrial Engineering and Management Systems Conference, Busan, Korea (2026.12)</em></div></div></article></div></section>", "newsLi": "<li class=\"pli-ni\" data-c=\"paper\" style=\"--t:#0b75d8\"><div class=\"mt\"><span class=\"dt\">2026</span><span class=\"tg\">Paper</span></div><div class=\"tx\">Paper published in <em>Journal of the Research Institute of Industrial Sciences</em>: “System-level Configuration Optimization Algorithms for Reconfigurable Single Part Flow Lines with Controllable Processing Times”</div></li>"};
(function(){
  function plural(n,u){return n+' '+u+(n>1?'s':'');}
  function addToYear(h,y,items){
    var re=new RegExp('<h3>\\s*'+y+'\\s*<small>\\s*(\\d+)\\s*papers?\\s*</small>');var m=re.exec(h);if(!m)throw new Error('no year '+y);
    if(h.indexOf(items[0].slice(0,120))>=0)throw new Error('already has '+y);
    var n=+m[1]+items.length;h=h.slice(0,m.index)+'<h3>'+y+'<small>'+plural(n,'paper')+'</small>'+h.slice(m.index+m[0].length);
    var se=h.indexOf('</section>',m.index);var dv=h.lastIndexOf('</div>',se);if(dv<m.index)throw new Error('no div '+y);
    return h.slice(0,dv)+items.join('')+h.slice(dv);}
  function addNewYear(h,sec,y){if(new RegExp('<h3>\\s*'+y+'\\s*<small>').test(h))throw new Error('year exists '+y);var i=h.indexOf('<section class="pli-ygrp"');if(i<0)throw new Error('no ygrp');return h.slice(0,i)+sec+h.slice(i);}
  function rep(h,re,to){if(!re.test(h))throw new Error('no match '+re);return h.replace(re,to);}
  function stats(h){
    h=rep(h,/(<b>)\s*90\s*(<\/b>\s*<span>\s*International Journals)/,'$198$2');
    h=rep(h,/(<b>)\s*24\s*(<\/b>\s*<span>\s*Domestic Journals)/,'$125$2');
    h=rep(h,/(<b>)\s*73\s*(<\/b>\s*<span>\s*International Conferences)/,'$176$2');
    return h;}
  var FN={
    ij:function(h){Object.keys(PA.ij).forEach(function(y){h=addToYear(h,y,PA.ij[y]);});return stats(h);},
    dj:function(h){return stats(addNewYear(h,PA.dj,2026));},
    ic:function(h){return stats(addNewYear(h,PA.ic,2026));},
    dc:function(h){return stats(h);},
    home:function(h){h=rep(h,/(<b>)\s*90\s*(<\/b>\s*<span>\s*International journal papers)/,'$198$2');return rep(h,/(<b>)\s*161\s*(<\/b>\s*<span>\s*Conference papers)/,'$1164$2');},
    news:function(h){
      if(h.indexOf('System-level Configuration Optimization Algorithms')>=0)throw new Error('news already');
      h=rep(h,/(data-c="all">All\s*<b>)\s*70\s*(<\/b>)/,'$171$2');
      h=rep(h,/(<i><\/i>Paper\s*<b>)\s*17\s*(<\/b>)/,'$118$2');
      var m=/<h3>\s*2026\s*<small>\s*8 news\s*<\/small>/.exec(h);if(!m)throw new Error('no 2026 news');
      h=h.slice(0,m.index)+'<h3>2026<small>9 news</small>'+h.slice(m.index+m[0].length);
      var e=h.indexOf('</ol>',m.index);return h.slice(0,e)+PA.newsLi+h.slice(e);}
  };
  var MK={ij:'pli-pstats',dj:'pli-pstats',ic:'pli-pstats',dc:'pli-pstats',home:'International journal papers',news:'pli-ntl'};
  window.PA_FN=FN;
  window.PA_APPLY=async function(k){var r=await PLI_EDIT(MK[k],FN[k]);
    var b=[].slice.call(document.querySelectorAll('button')).find(function(x){return x.textContent.trim()==='게시';});if(!b)throw new Error('no publish');b.click();return JSON.stringify(r);};
  // preview on the public page (DOM only, nothing saved): new items highlighted
  window.PA_PREVIEW=function(k){
    var root=document.querySelector(k==='news'?'.pli-ntl':'.pli-pubs-page');if(!root)throw new Error('no root');
    var host=k==='news'?root:root.parentElement;var h=host.innerHTML;h=FN[k](h);host.innerHTML=h;
    var css=document.getElementById('pa-hl')||document.head.appendChild(Object.assign(document.createElement('style'),{id:'pa-hl'}));
    css.textContent='.pa-new{background:#fff7d6!important;box-shadow:0 0 0 2px #f5c542 inset;border-radius:10px}';
    var keys=[];Object.keys(PA.ij).forEach(function(y){PA.ij[y].forEach(function(a){keys.push(a);});});
    var mark=function(sel,txts){[].forEach.call(document.querySelectorAll(sel),function(a){var t=a.getAttribute('data-q')||'';if(txts.some(function(x){return x.indexOf(t.slice(0,60))>=0;}))a.classList.add('pa-new');});};
    if(k==='ij')mark('article.pli-pub',keys);if(k==='dj')mark('article.pli-pub',[PA.dj]);if(k==='ic')mark('article.pli-pub',[PA.ic]);
    if(k==='news'){[].forEach.call(document.querySelectorAll('.pli-ni'),function(li){if(/System-level Configuration Optimization Algorithms/.test(li.textContent))li.classList.add('pa-new');});}
    return document.querySelectorAll('.pa-new').length;};
})();
