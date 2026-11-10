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
window.PLI_CNTFIX = async function () {
  var r = await PLI_EDIT("cnt.textContent=tot", function (h) {
    var re = /(cnt\.textContent=tot\+' \/ '\+)\s*\d+\s*(\+' items')/;
    if (!re.test(h)) throw new Error('no count expr');
    return h.replace(re, "$1root.querySelectorAll('.pli-pub').length$2");
  });
  var b = [].slice.call(document.querySelectorAll('button')).find(function (x) { return x.textContent.trim() === '게시'; });
  if (!b) throw new Error('no publish'); b.click(); return JSON.stringify(r);
};
