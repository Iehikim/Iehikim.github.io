window.IC_APPLY = async function () {
  var r = await PLI_EDIT('<span>Publications</span>', function (h) {
    var re = /(<b>)\s*275\s*(<\/b>\s*<span>\s*Publications\s*<\/span>\s*<small>)\s*국제저널\s*90\s*·\s*국내저널\s*24\s*(<br\s*\/?>)\s*국제학회\s*73\s*·\s*국내학회\s*88\s*(<\/small>)/;
    if (!re.test(h)) throw new Error('no intro counts');
    return h.replace(re, '$1290$2국제저널 98 · 국내저널 25$3국제학회 76 · 국내학회 91$4');
  });
  var b = [].slice.call(document.querySelectorAll('button')).find(function (x) { return x.textContent.trim() === '게시'; });
  if (!b) throw new Error('no publish'); b.click(); return JSON.stringify(r);
};
