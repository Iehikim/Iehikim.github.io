window.HN7_APPLY = async function () {
  var r = await PLI_EDIT('International journal papers', function (h) {
    var re = /<li>\s*<div class="d">\s*2026\.03\s*<\/div>\s*<div class="t">\s*New NRF project started[\s\S]*?<\/li>/;
    if (!re.test(h)) throw new Error('no 2026.03 item');
    return h.replace(re, '');
  });
  var b = [].slice.call(document.querySelectorAll('button')).find(function (x) { return x.textContent.trim() === '게시'; });
  if (!b) throw new Error('no publish'); b.click(); return JSON.stringify(r);
};
