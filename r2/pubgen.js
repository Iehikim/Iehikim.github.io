/* PLI Lab publication list generator.
 * Runs in the browser at apply time: takes the citation strings of the old page and returns
 * static HTML (year groups + entries) for the new HTML fragment. */
(function () {
  var D = '/documents/592325114/0/';
  var COV = {
    ijamt: 'pli-cover-ijamt.webp/a4ecf829-5369-5028-20b1-c23b5943bbe7',
    fsmj: 'pli-cover-fsmj.webp/32555c39-b753-3449-cfb2-2432d8fceb50',
    jors: 'pli-cover-jors.webp/efb606db-c394-66ff-1746-ef14f29b93e4',
    ejor: 'pli-cover-ejor.webp/ff794b29-8a6e-8034-2c90-af0228370ec7',
    caie: 'pli-cover-caie.webp/d878adf2-c630-bc4f-c709-0cb155bdef4f',
    ijpr: 'pli-cover-ijpr.webp/bf77f85a-1c06-315c-6186-e92f6d673fa9',
    pimeb: 'pli-cover-pimeb.webp/455e0171-9c59-0103-46ed-3b6ff455f9d7',
    jkiie: 'pli-cover-jkiie.webp/8954f0f8-7205-5e43-dfbc-fd79c042b1a6'
  };
  // [regex for the venue as written, cover key or '', abbreviation for the text tile]
  var INTL = [
    [/International Journal of Production Research/i, 'ijpr', 'IJPR'],
    [/Proceedings of the Institution of Mechanical Engineers[^,]*(?:,\s*Part B[^,]*)?(?::\s*Journal of Engineering Manufacture)?/i, 'pimeb', 'PIME-B'],
    [/Computers\s*(?:&|and)\s*Industrial Engineering/i, 'caie', 'CAIE'],
    [/Journal of the Operational Research Society/i, 'jors', 'JORS'],
    [/International Journal of Advanced Manufacturing Technology/i, 'ijamt', 'IJAMT'],
    [/European Journal of Operational Research/i, 'ejor', 'EJOR'],
    [/Flexible Services and Manufacturing Journal/i, 'fsmj', 'FSMJ'],
    [/Engineering Optimi[sz]ation/i, '', 'ENG<br>OPT'],
    [/Lecture Notes in Computer Science/i, '', 'LNCS'],
    [/Lecture Notes in Artificial Intelligence/i, '', 'LNAI'],
    [/CIRP Annals[^,]*/i, '', 'CIRP<br>Annals'],
    [/International Journal of Industrial Engineering(?::\s*Theory,\s*Applications and Practice)?/i, '', 'IJIE'],
    [/International Journal of Sustainable Engineering/i, '', 'IJSE'],
    [/International Journal of Sustainable Transportation/i, '', 'IJST'],
    [/Journal of Manufacturing Systems/i, '', 'JMS'],
    [/Applied Mathematical Modelling/i, '', 'AMM'],
    [/European Journal of Industrial Engineering/i, '', 'EJIE'],
    [/Industrial Engineering\s*(?:&|and)\s*Management Systems/i, '', 'IEMS'],
    [/Transportation Research[^,]*Part D[^,]*/i, '', 'TR-D'],
    [/Expert Systems with Applications/i, '', 'ESWA'],
    [/Asia Pacific Management Review/i, '', 'APMR'],
    [/Studies in Informatics and Control/i, '', 'SIC'],
    [/International Journal of Environmentally Conscious Design\s*(?:&|and)\s*Manufacturing/i, '', 'IJECDM'],
    [/Fundamenta Informaticae/i, '', 'FI'],
    [/Journal of Engineering Valuation and Cost Analysis/i, '', 'JEVCA'],
    [/IIE Transactions/i, '', 'IIE<br>Trans.']
  ];
  var DOM = [
    [/Journal of (?:the )?Korean Institute of Industrial Engineers[^,]*/i, 'jkiie', 'JKIIE'],
    [/IE Interfaces[^,]*/i, '', 'IE<br>Interfaces'],
    [/Journal of (?:the )?Society of Korea Industrial and Systems Engineering[^,]*/i, '', 'JKSIE'],
    [/Journal of (?:the )?Korean Society of Supply Chain Management[^,]*/i, '', 'JKSCM'],
    [/Journal of (?:the )?Korean Operations Research and Management Science Society[^,]*/i, '', 'JKORMS'],
    [/Korean Management Science Review[^,]*/i, '', 'KMSR'],
    [/Journal of (?:the )?Research Institute of Industrial Sciences[^,]*/i, '', '산업과학<br>연구소'],
    [/Journal of [^,]*(?:\([^)]*\))?/i, '', 'J'],
    [/[^,]*학회지[^,]*/i, '', 'KCI']
  ];
  var MEMBERS = ['Lee, D.-H.', 'Kim, H.-I.', 'Shin, J.-H.', 'Doh, H.-H.', 'Kim, H.-W.', 'Yu, J.-M.', 'Kim, J.-S.', 'Choi, H.-S.', 'Kim, J.-G.',
    'Kim, H.-J.', 'Kang, J.-G.', 'Sakara, D.', 'Lee, J.-Y.', 'Moon, H.-J.', 'Lee, K.-M.', 'Bai, C.', 'Youn, A.-J.', 'Kim, Y.-R.', 'Jung, H.-B.',
    'Sim, D.-G.', 'Li, X.', 'Choi, Y.-H.', 'Heo, S.-S.', 'Choi, H.', 'Cho, Y.', 'Lee, D.-K.', 'Zhou, Y.-D.', 'Ulugov, A.', 'Joo, G.-H.', 'Kim, J.-M.',
    'Huang, R.', 'Cho, Y.-H.', 'Yu, Z.-J.', 'Park, J.-H.', 'Kim, M.-G.', 'Lee, C.-W.', 'Kim, D.-H.', 'Choi, Y.-J.', 'Han, H.-J.', 'Go, H.',
    'Kang, K.-W.', 'Lee, J.-H.', 'Shim, I.-S.', 'Ahn, H.-D.', 'Ha, K.-W.', 'Ma, Y.-S.', 'Jeon, H.-B.', 'Park, S.-H.', 'Kim, S.-I.', 'Kim, H.-C.',
    'Lee, K.-B.', 'Kim, J.-D.', 'Kwon, Y.-J.', 'Cho, B.-M.', 'Shim, H.-A.', 'Lee, M.-S.', 'Jung, H.'];

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function clean(s) { return String(s).replace(/\s+/g, ' ').replace(/\s+([,.:;])/g, '$1').trim(); }
  function bold(a) {
    var h = esc(a);
    MEMBERS.forEach(function (m) {
      var e = esc(m).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      h = h.replace(new RegExp('(^|[\\s,(])(' + e + ')(?=[\\s,.;)]|$)', 'g'), '$1<b>$2</b>');
    });
    return h.replace(/<b><b>/g, '<b>').replace(/<\/b><\/b>/g, '</b>');
  }
  function bucket(y) { return y >= 2023 ? String(y) : y >= 2020 ? '2020–2022' : y >= 2010 ? '2010s' : y >= 2000 ? '2000s' : '~1999'; }

  function parse(raw, kind) {
    var s = clean(raw), url = '';
    var um = s.match(/https?:\/\/[^\s,]+/);
    if (um) { url = um[0].replace(/[.,;]+$/, ''); s = clean(s.replace(um[0], '')); }
    var doi = s.match(/\b(?:doi:\s*|DOI\s*)(10\.\d{4,}\/[^\s,]+)/i);
    if (doi && !url) { url = 'https://doi.org/' + doi[1].replace(/[.,;]+$/, ''); s = clean(s.replace(doi[0], '')); }
    var y, authors, rest, m;
    if ((m = s.match(/^(.*?)\s*\((\d{4})[a-z]?\)\s*\.?\s*(.*)$/))) { authors = m[1]; y = +m[2]; rest = m[3]; }
    else if ((m = s.match(/^(.*?),\s*(\d{4})\s*,\s*(.*)$/))) { authors = m[1]; y = +m[2]; rest = m[3]; }
    else return { y: 0, raw: s, url: url };
    var badge = '';
    var km = rest.match(/\s*[^.,]*(KCI|SCIE?|SSCI|SCOPUS)[^,]*$/);
    if (kind === 'dj' && km) { badge = km[1]; }
    rest = rest.replace(/\s*(?:공동|단독|주저자|교신)[^–-]*[–-]\s*(KCI|SCIE?|SSCI|SCOPUS)?\s*(\(\d{4}\.\d{2}\))?\s*$/, '');
    var title = rest, venue = '', details = '', cover = '', abbr = '';
    if (kind === 'ij' || kind === 'dj') {
      var list = kind === 'ij' ? INTL : DOM;
      for (var i = 0; i < list.length; i++) {
        var vm = rest.match(new RegExp('[,.]\\s*((?:The\\s+)?' + list[i][0].source + ')', 'i'));
        if (vm && vm.index > 8) {
          title = rest.slice(0, vm.index); venue = vm[1];
          details = rest.slice(vm.index + vm[0].length).replace(/^[\s,.:]+/, '').replace(/[\s.]+$/, '');
          cover = list[i][1]; abbr = list[i][2]; break;
        }
      }
    } else {
      var cm = rest.match(/[,.]\s*((?:Proceedings|Proc\.|Book of Abstracts|Abstracts)[^]*)$/i) ||
        rest.match(/[,.]\s*([^,]*(?:Conference|Congress|Symposium|Workshop|Meeting|Forum|General Assembly|학술대회)[^]*)$/i);
      if (cm && cm.index > 8) { title = rest.slice(0, cm.index); venue = cm[1].replace(/\.?\s*\((\d{4}\.\d{1,2})\)\s*$/, ' ($1)').replace(/[\s.]+$/, ''); }
    }
    title = clean(title).replace(/[\s.,]+$/, '');
    return { y: y, authors: clean(authors).replace(/[\s,]+$/, ''), title: title, venue: clean(venue), details: clean(details),
      url: url, cover: cover, abbr: abbr, badge: badge };
  }

  function item(p, kind) {
    var q = esc((p.title + ' ' + (p.authors || '') + ' ' + (p.venue || '') + ' ' + (p.raw || '')).toLowerCase());
    var cv = '';
    if (kind === 'ij' || kind === 'dj') {
      cv = p.cover ? '<span class="cv"><img src="' + D + COV[p.cover] + '" alt="" width="150" height="200" loading="lazy" decoding="async"></span>'
        : '<span class="cv tile" aria-hidden="true">' + (p.abbr || (kind === 'dj' ? 'KCI' : 'J')) + '</span>';
    }
    var body;
    if (!p.y || !p.venue) {
      body = '<div class="t">' + esc(p.title || p.raw) + '</div>' + (p.authors ? '<div class="au">' + bold(p.authors) + '</div>' : '') +
        (p.venue ? '<div class="vn"><em>' + esc(p.venue) + '</em></div>' : '');
    } else {
      body = (p.url ? '<a class="t" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.title) + '</a>' : '<div class="t">' + esc(p.title) + '</div>') +
        '<div class="au">' + bold(p.authors) + '</div>' +
        '<div class="vn"><em>' + esc(p.venue) + '</em>' + (p.details ? ', ' + esc(p.details) : '') + (p.badge ? ' <span class="ix">' + p.badge + '</span>' : '') + '</div>';
    }
    if (p.url) body += '<div class="bt"><a href="' + esc(p.url) + '" target="_blank" rel="noopener">' + (/doi\.org/.test(p.url) ? 'DOI' : 'Link') + ' ↗</a></div>';
    return '<article class="pli-pub' + (cv ? ' has-cv' : '') + '" data-q="' + q + '">' + cv + '<div class="bd">' + body + '</div></article>';
  }

  window.PLI_PUBGEN = function (entries, kind) {
    var ps = entries.map(function (e) { return parse(e, kind); });
    var bad = ps.filter(function (p) { return !p.y || !p.venue; }).length;
    var groups = {}, years = [];
    ps.forEach(function (p) { var y = p.y || 0; if (!groups[y]) { groups[y] = []; years.push(y); } groups[y].push(p); });
    years.sort(function (a, b) { return b - a; });
    var html = years.map(function (y) {
      var g = groups[y];
      return '<section class="pli-ygrp" data-b="' + (y ? bucket(y) : 'etc') + '"><h3>' + (y || '—') + '<small>' + g.length + (kind === 'ij' || kind === 'dj' ? ' paper' : ' paper') + (g.length > 1 ? 's' : '') + '</small></h3><div>' +
        g.map(function (p) { return item(p, kind); }).join('') + '</div></section>';
    }).join('');
    return { html: html, n: ps.length, bad: bad, parsed: ps };
  };
})();
