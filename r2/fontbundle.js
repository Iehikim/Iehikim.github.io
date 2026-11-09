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
/* Run inside the content-page editor: bump body font sizes by ~1px in our HTML fragment, add mobile header fix, then publish. */
window.PLI_FONT_APPLY = async function () {
  if (!location.search.includes('p_l_mode=edit') || typeof Liferay !== 'object') return 'not in editor';
  var MARK = '/*pli-font+1*/';
  var M = {'12':'12.5','12.5':'13','13':'14','13.5':'14.5','14':'15','14.5':'15.5','15':'16','15.5':'16.5','16':'17','16.5':'17.5'};
  var HDR = MARK + '@media (max-width:767px){a.logo.with-site-name h3{display:flex;align-items:center;font-size:15.5px;line-height:1.22}}';
  var r;
  try {
    r = await window.PLI_EDIT('<div class="pli pli-', function (h) {
      if (h.indexOf(MARK) >= 0) return h;
      var x = h.replace(/font-size:(\d+(?:\.\d+)?)px/g, function (m, v) { return M[v] ? 'font-size:' + M[v] + 'px' : m; });
      return x.replace('</style>', HDR + '</style>');
    });
  } catch (e) { return 'edit: ' + String(e).slice(0, 80); }
  await new Promise(function (res) { setTimeout(res, 2500); });
  var b = [].find.call(document.querySelectorAll('button'), function (x) { return x.textContent.trim() === '게시'; });
  if (!b) return JSON.stringify(r) + ' no publish button';
  b.click();
  return document.title.split(' - ')[0] + ' ' + JSON.stringify(r) + ' published';
};
