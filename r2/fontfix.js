window.PLI_FMAP = {'12':'12.5','12.5':'13','13':'14','13.5':'14.5','14':'15','14.5':'15.5','15':'16','15.5':'16.5','16':'17','16.5':'17.5'};
window.PLI_FONT_CSS = function (css) { return css.replace(/font-size:(\d+(?:\.\d+)?)px/g, function (m, v) { return PLI_FMAP[v] ? 'font-size:' + PLI_FMAP[v] + 'px' : m; }); };
window.PLI_HDR_CSS = '@media (max-width:767px){a.logo.with-site-name h3{display:flex;align-items:center;font-size:15.5px;line-height:1.22}}';
window.PLI_FONT_DOC = function (doc) {
  [].forEach.call(doc.querySelectorAll('style'), function (s) { if (/\.pli/.test(s.textContent)) s.textContent = PLI_FONT_CSS(s.textContent); });
  var st = doc.createElement('style'); st.textContent = PLI_HDR_CSS; doc.head.appendChild(st);
};
