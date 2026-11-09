window.PLI_CSS = {
  news: '/*pli-home-news+*/.pli-panel h3{font-size:21px}.pli-panel h3 a{font-size:15.5px}.pli-news .d{font-size:14px}.pli-news .t{font-size:17.5px;line-height:1.5}.pli-pubs .j{font-size:14px}.pli-pubs .j .pli-badge{font-size:12.5px}.pli-pubs .t{font-size:17.5px;line-height:1.5}.pli-pubs .a{font-size:15.5px}',
  cover: '/*pli-cover+*/.pli-pub.has-cv{grid-template-columns:90px minmax(0,1fr);gap:22px}.pli-pub .cv{width:90px;height:120px;border-radius:6px}.pli-pub .cv.tile{font-size:13px}@media (max-width:600px){.pli-pub.has-cv{grid-template-columns:72px minmax(0,1fr);gap:14px}.pli-pub .cv{width:72px;height:96px}.pli-pub .cv.tile{font-size:11.5px}}'
};
window.PLI_CSS_ADD = async function (key) {
  if (!location.search.includes('p_l_mode=edit') || typeof Liferay !== 'object') return 'not in editor';
  var css = PLI_CSS[key], mk = css.slice(0, css.indexOf('*/') + 2), r;
  try { r = await window.PLI_EDIT('<div class="pli pli-', function (h) { return h.indexOf(mk) >= 0 ? h : h.replace('</style>', css + '</style>'); }); }
  catch (e) { return 'edit: ' + String(e).slice(0, 80); }
  await new Promise(function (res) { setTimeout(res, 2500); });
  var b = [].find.call(document.querySelectorAll('button'), function (x) { return x.textContent.trim() === '게시'; });
  if (!b) return JSON.stringify(r) + ' no publish button';
  b.click(); return document.title.split(' - ')[0] + ' ' + JSON.stringify(r) + ' published';
};
