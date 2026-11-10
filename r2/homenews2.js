window.HN2_APPLY = async function () {
  var LIS = '<li><div class="d">2026.12</div><div class="t">Three papers accepted for presentation at APIEMS 2026, Busan, Korea.</div></li>' +
            '<li><div class="d">2026.12</div><div class="t">Three papers accepted for presentation at the Fall KIIE Conference, BPEX, Busan.</div></li>';
  var r = await PLI_EDIT('International journal papers', function (h) {
    var re = /<li>\s*<div class="d">\s*2026\.12\s*<\/div>\s*<div class="t">\s*Six papers accepted for presentation in Busan[\s\S]*?<\/li>/;
    if (!re.test(h)) throw new Error('no combined item');
    return h.replace(re, function () { return LIS; });
  });
  var b = [].slice.call(document.querySelectorAll('button')).find(function (x) { return x.textContent.trim() === '게시'; });
  if (!b) throw new Error('no publish'); b.click(); return JSON.stringify(r);
};
