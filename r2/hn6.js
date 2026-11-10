window.HN6_APPLY = async function () {
  var OLD = 'Dr. Hyeon-Il Kim received his Ph.D. with the Best Ph.D. Dissertation Award and joined KTH Royal Institute of Technology as a postdoctoral researcher.';
  var NEW = '<li><div class="d">2026.08</div><div class="t">Dr. Hyeon-Il Kim received his Ph.D. and joined KTH Royal Institute of Technology as a postdoctoral researcher.</div></li>' +
            '<li><div class="d">2026.08</div><div class="t">Dr. Hyeon-Il Kim received the Best Ph.D. Dissertation Award from Hanyang University.</div></li>';
  var r = await PLI_EDIT('International journal papers', function (h) {
    var esc = OLD.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var re = new RegExp('<li>\\s*<div class="d">\\s*2026\\.08\\s*</div>\\s*<div class="t">\\s*' + esc + '\\s*</div>\\s*</li>');
    if (!re.test(h)) throw new Error('no combined 2026.08 item');
    return h.replace(re, function () { return NEW; });
  });
  var b = [].slice.call(document.querySelectorAll('button')).find(function (x) { return x.textContent.trim() === '게시'; });
  if (!b) throw new Error('no publish'); b.click(); return JSON.stringify(r);
};
