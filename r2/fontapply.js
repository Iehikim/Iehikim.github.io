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
