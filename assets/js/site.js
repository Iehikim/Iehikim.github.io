(function () {
  'use strict';

  // Header: hairline once the page scrolls
  var header = document.querySelector('[data-header]');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Mobile menu
  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var icon = toggle.querySelector('i');
    var setOpen = function (open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (icon) { icon.className = open ? 'fas fa-times' : 'fas fa-bars'; }
    };
    toggle.addEventListener('click', function () {
      setOpen(!nav.classList.contains('is-open'));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 820) { setOpen(false); }
    });
  }

  // News: show / hide older entries
  document.querySelectorAll('[data-older-toggle]').forEach(function (btn) {
    var list = document.getElementById(btn.getAttribute('aria-controls'));
    if (!list) { return; }
    var labelMore = btn.textContent;
    btn.addEventListener('click', function () {
      var expanded = list.classList.toggle('is-expanded');
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      btn.textContent = expanded ? 'Show fewer' : labelMore;
    });
  });

  // Publications: filter by type
  var bar = document.querySelector('[data-filter-bar]');
  if (bar) {
    var buttons = bar.querySelectorAll('button[data-filter]');
    var groups = document.querySelectorAll('[data-pub-group]');
    var apply = function (filter) {
      buttons.forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-filter') === filter ? 'true' : 'false');
      });
      groups.forEach(function (g) {
        var cats = (g.getAttribute('data-pub-group') || '').split(' ');
        g.hidden = !(filter === 'all' || cats.indexOf(filter) !== -1);
      });
    };
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.getAttribute('data-filter');
        apply(f);
        if (history.replaceState) {
          history.replaceState(null, '', f === 'all' ? location.pathname : '#' + f);
        }
      });
    });
    var fromHash = function () {
      var h = (location.hash || '').replace('#', '');
      var valid = Array.prototype.some.call(buttons, function (b) { return b.getAttribute('data-filter') === h; });
      apply(valid ? h : 'all');
    };
    window.addEventListener('hashchange', fromHash);
    fromHash();
  }
})();
