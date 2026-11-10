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
    jkiie: 'pli-cover-jkiie.webp/8954f0f8-7205-5e43-dfbc-fd79c042b1a6',
    amm: 'pli-cover-amm.webp/0a2b439a-5016-a92a-cc09-75a2e2559394',
    apmr: 'pli-cover-apmr.webp/ec28a954-fe83-5c41-e14e-0cdbd12b5216',
    cirp: 'pli-cover-cirp.webp/148350f4-30f0-0a57-4af4-552e64b2a1a0',
    ejie: 'pli-cover-ejie.webp/206e4b77-6025-6446-aaec-be8bc2503e48',
    eo: 'pli-cover-eo.webp/03447c1e-df67-3e22-57d3-d5bb9ff29a27',
    eswa: 'pli-cover-eswa.webp/607e1df6-0e7c-64c5-b491-d63a4555c63e',
    iise: 'pli-cover-iise.webp/f4b675af-6c97-91d4-7726-cff00d10afa3',
    ijse: 'pli-cover-ijse.webp/bdde3287-96a5-70e9-21c7-1cd51fa68450',
    ijst: 'pli-cover-ijst.webp/69af503e-516b-bf80-ea73-1a478da01f70',
    jms: 'pli-cover-jms.webp/df2c35a6-55af-22d6-c19b-3cb30ff3340d',
    lnai: 'pli-cover-lnai.webp/24274452-511a-ac73-3506-bb77048368f8',
    lncs: 'pli-cover-lncs.webp/7b975077-14ae-ae96-2ae0-63e255dc1d2f',
    trd: 'pli-cover-trd.webp/4bbe2d50-f44e-efa9-b356-cfc6459a8533'
  };
  // Clarivate JCR (jcr.clarivate.com journal profiles), matched to each paper's publication year.
  // JH[abbr][JCR year] = [JIF as listed, best-category rank r/n, category]. Papers newer than the latest
  // JCR year use the latest one; years before a journal's first JCR year (or before 1997) get no metrics.
  var JCR_LATEST = 2025;
  var JH = {"IJPR":{"1998":["0.584","3/29","ENGINEERING, MANUFACTURING"],"2001":["0.438","9/35","ENGINEERING, MANUFACTURING"],"2004":["0.558","15/33","ENGINEERING, INDUSTRIAL"],"2006":["0.799","10/32","ENGINEERING, INDUSTRIAL"],"2007":["0.560","17/33","ENGINEERING, INDUSTRIAL"],"2008":["0.774","21/38","ENGINEERING, MANUFACTURING"],"2011":["1.115","11/37","ENGINEERING, MANUFACTURING"],"2012":["1.460","22/79","OPERATIONS RESEARCH & MANAGEMENT SCIENCE"],"2013":["1.323","29/79","OPERATIONS RESEARCH & MANAGEMENT SCIENCE"],"2015":["1.693","26/82","OPERATIONS RESEARCH & MANAGEMENT SCIENCE"],"2017":["2.623","20/84","OPERATIONS RESEARCH & MANAGEMENT SCIENCE"],"2020":["8.568","2/84","OPERATIONS RESEARCH & MANAGEMENT SCIENCE"],"2023":["7.0","7/106","OPERATIONS RESEARCH & MANAGEMENT SCIENCE"],"2025":["8.7","9/109","OPERATIONS RESEARCH & MANAGEMENT SCIENCE"]},"EJOR":{"2001":["0.494","19/53","OPERATIONS RESEARCH & MANAGEMENT SCIENCE"],"2013":["1.843","15/79","OPERATIONS RESEARCH & MANAGEMENT SCIENCE"],"2025":["7.0","11/109","OPERATIONS RESEARCH & MANAGEMENT SCIENCE"]},"CAIE":{"1997":["0.117","20/24","ENGINEERING, INDUSTRIAL"],"2009":["1.491","10/37","ENGINEERING, INDUSTRIAL"],"2011":["1.589","9/43","ENGINEERING, INDUSTRIAL"],"2013":["1.690","11/43","ENGINEERING, INDUSTRIAL"],"2018":["3.518","24/106","COMPUTER SCIENCE, INTERDISCIPLINARY APPLICATIONS"],"2020":["5.431","21/111","COMPUTER SCIENCE, INTERDISCIPLINARY APPLICATIONS"],"2024":["6.5","25/177","COMPUTER SCIENCE, INTERDISCIPLINARY APPLICATIONS"],"2025":["7.3","30/185","COMPUTER SCIENCE, INTERDISCIPLINARY APPLICATIONS"]},"PIME-B":{"2001":["0.295","18/35","ENGINEERING, MANUFACTURING"],"2004":["0.249","76/103","ENGINEERING, MECHANICAL"],"2006":["0.386","65/106","ENGINEERING, MECHANICAL"],"2007":["0.203","87/107","ENGINEERING, MECHANICAL"],"2009":["0.412","83/116","ENGINEERING, MECHANICAL"],"2010":["0.699","55/122","ENGINEERING, MECHANICAL"],"2015":["0.978","79/132","ENGINEERING, MECHANICAL"],"2018":["1.752","66/129","ENGINEERING, MECHANICAL"],"2021":["2.759","64/137","ENGINEERING, MECHANICAL"],"2023":["1.9","92/183","ENGINEERING, MECHANICAL"],"2024":["1.9","103/182","ENGINEERING, MECHANICAL"]},"IJAMT":{"2009":["1.128","12/37","ENGINEERING, MANUFACTURING"],"2012":["1.205","18/39","ENGINEERING, MANUFACTURING"],"2013":["1.779","10/39","ENGINEERING, MANUFACTURING"],"2016":["2.209","25/60","AUTOMATION & CONTROL SYSTEMS"],"2017":["2.601","15/46","ENGINEERING, MANUFACTURING"],"2018":["2.496","29/62","AUTOMATION & CONTROL SYSTEMS"]},"JORS":{"1998":["0.552","7/44","OPERATIONS RESEARCH & MANAGEMENT SCIENCE"],"2004":["0.515","31/56","OPERATIONS RESEARCH & MANAGEMENT SCIENCE"],"2005":["0.603","29/56","OPERATIONS RESEARCH & MANAGEMENT SCIENCE"],"2006":["0.597","33/60","OPERATIONS RESEARCH & MANAGEMENT SCIENCE"],"2009":["1.009","36/73","OPERATIONS RESEARCH & MANAGEMENT SCIENCE"],"2012":["0.989","37/79","OPERATIONS RESEARCH & MANAGEMENT SCIENCE"],"2015":["1.225","41/82","OPERATIONS RESEARCH & MANAGEMENT SCIENCE"]},"ENG<br>OPT":{"2017":["1.622","33/86","ENGINEERING, MULTIDISCIPLINARY"],"2019":["2.165","35/83","OPERATIONS RESEARCH & MANAGEMENT SCIENCE"],"2022":["2.7","35/86","OPERATIONS RESEARCH & MANAGEMENT SCIENCE"]},"IJIE":{"2003":["0.093","30/33","ENGINEERING, INDUSTRIAL"],"2014":["0.396","36/40","ENGINEERING, MANUFACTURING"],"2018":["0.532","47/49","ENGINEERING, MANUFACTURING"]},"CIRP<br>Annals":{"2003":["0.974","2/33","ENGINEERING, INDUSTRIAL"]},"JMS":{"1998":["0.380","10/30","ENGINEERING, INDUSTRIAL"],"1999":["0.507","5/31","ENGINEERING, INDUSTRIAL"]},"TR-D":{"2013":["1.626","33/98","ENVIRONMENTAL STUDIES"]},"IJST":{"2019":["2.709","49/123","ENVIRONMENTAL STUDIES"]},"EJIE":{"2018":["1.217","58/84","OPERATIONS RESEARCH & MANAGEMENT SCIENCE"]},"AMM":{"2024":["5.1","8/136","MATHEMATICS, INTERDISCIPLINARY APPLICATIONS"]},"ESWA":{"2011":["2.203","5/77","OPERATIONS RESEARCH & MANAGEMENT SCIENCE"]},"IIE<br>Trans.":{"2000":["0.383","9/31","ENGINEERING, INDUSTRIAL"]},"LNCS":{"2005":["0.402","62/71","COMPUTER SCIENCE, THEORY & METHODS"]},"LNAI":{"2005":["0.302","70/79","COMPUTER SCIENCE, ARTIFICIAL INTELLIGENCE"]},"FSMJ":{"2025":["3.5","33/109","OPERATIONS RESEARCH & MANAGEMENT SCIENCE"]}};
  function metrics(abbr, y) {
    var d = JH[abbr]; if (!d || !y) return '';
    var yy = Math.min(y, JCR_LATEST), m = d[yy];
    if (!m) return '';
    var rn = m[1].split('/'), z = rn[0] / rn[1], q = z <= .25 ? 1 : z <= .5 ? 2 : z <= .75 ? 3 : 4;
    return '<span class="m q q' + q + '" title="JCR ' + yy + ' · ' + esc(m[2]) + ' ' + m[1] + '">Q' + q + '</span>' +
      '<span class="m">JCR ' + yy + ' · top ' + (z * 100).toFixed(1) + '%</span>' +
      '<span class="m">IF ' + m[0] + '</span>';
  }
  // [regex for the venue as written, cover key or '', abbreviation for the text tile]
  var INTL = [
    [/International Journal of Production Research/i, 'ijpr', 'IJPR'],
    [/Proceedings of the Institution of Mechanical Engineers[^,]*(?:,\s*Part B[^,]*)?(?::\s*Journal of Engineering Manufacture)?/i, 'pimeb', 'PIME-B'],
    [/Computers\s*(?:&|and)\s*Industrial Engineering/i, 'caie', 'CAIE'],
    [/Journal of the Operational Research Society/i, 'jors', 'JORS'],
    [/International Journal of Advanced Manufacturing Technology/i, 'ijamt', 'IJAMT'],
    [/European Journal of Operational Research/i, 'ejor', 'EJOR'],
    [/Flexible Services and Manufacturing Journal/i, 'fsmj', 'FSMJ'],
    [/Engineering Optimi[sz]ation/i, 'eo', 'ENG<br>OPT'],
    [/Lecture Notes in Computer Science/i, 'lncs', 'LNCS'],
    [/Lecture Notes in Artificial Intelligence/i, 'lnai', 'LNAI'],
    [/CIRP Annals[^,]*/i, 'cirp', 'CIRP<br>Annals'],
    [/International Journal of Industrial Engineering(?::\s*Theory,\s*Applications and Practice)?/i, '', 'IJIE'],
    [/International Journal of Sustainable Engineering/i, 'ijse', 'IJSE'],
    [/International Journal of Sustainable Transportation/i, 'ijst', 'IJST'],
    [/Journal of Manufacturing Systems/i, 'jms', 'JMS'],
    [/Applied Mathematical Modelling/i, 'amm', 'AMM'],
    [/European Journal of Industrial Engineering/i, 'ejie', 'EJIE'],
    [/Industrial Engineering\s*(?:&|and)\s*Management Systems/i, '', 'IEMS'],
    [/Transportation Research[^,]*Part D[^,]*/i, 'trd', 'TR-D'],
    [/Expert Systems with Applications/i, 'eswa', 'ESWA'],
    [/Asia Pacific Management Review/i, 'apmr', 'APMR'],
    [/Studies in Informatics and Control/i, '', 'SIC'],
    [/International Journal of Environmentally Conscious Design\s*(?:&|and)\s*Manufacturing/i, '', 'IJECDM'],
    [/Fundamenta Informaticae/i, '', 'FI'],
    [/Journal of Engineering Valuation and Cost Analysis/i, '', 'JEVCA'],
    [/IIE Transactions/i, 'iise', 'IIE<br>Trans.'],
    [/Management Science and Financial Engineering/i, '', 'MSFE'],
    [/International Journal of Management Science/i, '', 'IJMS']
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
    'Lee, K.-B.', 'Kim, J.-D.', 'Kwon, Y.-J.', 'Cho, B.-M.', 'Shim, H.-A.', 'Shim, H.', 'Lee, M.-S.', 'Jung, H.'];

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
    var mx = kind === 'ij' && p.venue ? metrics(p.abbr, p.y) : '';
    var link = p.url ? '<a href="' + esc(p.url) + '" target="_blank" rel="noopener">' + (/doi\.org/.test(p.url) ? 'DOI' : 'Link') + ' ↗</a>' : '';
    if (mx || link) body += '<div class="bt">' + mx + link + '</div>';
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
