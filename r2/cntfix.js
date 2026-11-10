window.PLI_CNTFIX = async function () {
  var r = await PLI_EDIT("cnt.textContent=tot", function (h) {
    var re = /(cnt\.textContent=tot\+' \/ '\+)\s*\d+\s*(\+' items')/;
    if (!re.test(h)) throw new Error('no count expr');
    return h.replace(re, "$1root.querySelectorAll('.pli-pub').length$2");
  });
  var b = [].slice.call(document.querySelectorAll('button')).find(function (x) { return x.textContent.trim() === '게시'; });
  if (!b) throw new Error('no publish'); b.click(); return JSON.stringify(r);
};
