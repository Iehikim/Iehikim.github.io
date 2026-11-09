/* Runs inside the Liferay 7.3 content-page editor (draft). Replaces the page body with one HTML fragment. */
window.PLI_APPLY = async function (o) {
  var req = function (m) { return new Promise(function (res, rej) { Liferay.Loader.require(m, function (x) { res(x); }, rej); }); };
  var P = 'layout-content-page-editor-web@2.0.172/page_editor/app/services/';
  var FS = (await req(P + 'FragmentService')).default, LS = (await req(P + 'LayoutService')).default;
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
  var ld = st.layoutData, fel = st.fragmentEntryLinks, root = ld.rootItems.main, old = ld.items[root].children.slice();
  var hasPortlet = function (id) {
    var it = ld.items[id]; if (!it) return false;
    if (it.type === 'fragment') { var f = fel[it.config.fragmentEntryLinkId]; if (f && f.portletId && /BbsPortlet/.test(f.portletId)) return true; }
    return (it.children || []).some(hasPortlet);
  };
  if (o.master) await LS.changeMasterLayout({ masterLayoutPlid: o.master, onNetworkStatus: function () { } });
  var html = o.html || await (await fetch(o.raw + o.file)).text();
  Object.keys(o.replace || {}).forEach(function (k) { html = html.split(k).join(o.replace[k]); });
  if (/__[A-Z_0-9]+__/.test(html)) throw new Error('unreplaced placeholder: ' + html.match(/__[A-Z_0-9]+__/)[0]);
  var res = await FS.addFragmentEntryLink({ fragmentEntryKey: 'BASIC_COMPONENT-html', groupId: '0', parentItemId: root, position: 0, segmentsExperienceId: '0', onNetworkStatus: function () { } });
  var nf = res.fragmentEntryLink, ev = JSON.parse(JSON.stringify(nf.editableValues));
  ev[K]['element-html']['ko_KR'] = html;
  await FS.updateEditableValues({ fragmentEntryLinkId: nf.fragmentEntryLinkId, editableValues: ev, onNetworkStatus: function () { } });
  var del = 0, kept = 0, errs = [];
  for (var i = 0; i < old.length; i++) {
    if (o.keepPortlet && hasPortlet(old[i])) { kept++; continue; }
    try { await LS.deleteItem({ itemId: old[i], segmentsExperienceId: '0', onNetworkStatus: function () { } }); del++; }
    catch (x) { errs.push(String(x).slice(0, 60)); }
  }
  return { html: html.length, deleted: del, kept: kept, of: old.length, errs: errs };
};
