window.PLI_HN_CSS = '/*pli-home-news+*/.pli-panel h3{font-size:21px}.pli-panel h3 a{font-size:15.5px}.pli-news .d{font-size:14px}.pli-news .t{font-size:17.5px;line-height:1.5}.pli-pubs .j{font-size:14px}.pli-pubs .j .pli-badge{font-size:12.5px}.pli-pubs .t{font-size:17.5px;line-height:1.5}.pli-pubs .a{font-size:15.5px}';
window.PLI_HN_APPLY = async function () {
  if (!location.search.includes('p_l_mode=edit') || typeof Liferay !== 'object') return 'not in editor';
  var r;
  try { r = await window.PLI_EDIT('pli-news', function (h) { return h.indexOf('/*pli-home-news+*/') >= 0 ? h : h.replace('</style>', PLI_HN_CSS + '</style>'); }); }
  catch (e) { return 'edit: ' + String(e).slice(0, 80); }
  await new Promise(function (res) { setTimeout(res, 2500); });
  var b = [].find.call(document.querySelectorAll('button'), function (x) { return x.textContent.trim() === '게시'; });
  if (!b) return JSON.stringify(r) + ' no publish button';
  b.click(); return JSON.stringify(r) + ' published';
};
