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
