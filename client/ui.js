/* ============================================================================
   ui.js — navigation, toasts, formatting and the two chart primitives

   Nothing in here knows about Wina Bwangu's business rules. It is the shared
   vocabulary the four page scripts draw on.
   ========================================================================== */

var UI = (function () {
  'use strict';

  /* --- small helpers ------------------------------------------------------ */
  function $(selector, scope) { return (scope || document).querySelector(selector); }
  function $$(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined && text !== null) { node.textContent = text; }
    return node;
  }

  /* --- formatting --------------------------------------------------------- */
  function money(value, decimals) {
    var places = decimals === undefined ? 2 : decimals;
    var fixed = Math.abs(Number(value)).toFixed(places);
    var parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (Number(value) < 0 ? '-K' : 'K') + parts.join('.');
  }
  function number(value) {
    return String(Math.round(Number(value))).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  function percent(fraction, decimals) {
    return (Number(fraction) * 100).toFixed(decimals === undefined ? 1 : decimals) + '%';
  }

  /* --- navigation ---------------------------------------------------------
     One rail on wide screens, a disclosure menu under 900px. The current page
     is marked from the body's data-page attribute so no page hard-codes it. */
  function initNav() {
    var current = document.body.getAttribute('data-page');
    $$('.nav-link').forEach(function (link) {
      if (link.getAttribute('data-nav') === current) {
        link.classList.add('is-current');
        link.setAttribute('aria-current', 'page');
      }
 
    });

    var toggle = $('.nav-toggle');
    var rail = $('.rail');
    if (!toggle || !rail) { return; }
    toggle.addEventListener('click', function () {
      var open = rail.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        rail.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && rail.classList.contains('is-open')) {
        rail.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* --- logout --------------------------------------------------------------*/
  function initLogout () {
    var button = document.getElementById("logoutBtn");
    if (!button) return;

    button.addEventListener("click", function () {
      sessionStorage.removeItem("winaUser");
      sessionStorage.removeItem("winaRole");
      window.location.href = "login.html";
    });
  }  

  /* --- toasts -------------------------------------------------------------
     Feedback channel for every asynchronous outcome: loaded, saved, rejected.
     Announced to screen readers via the live region on each page. */
  var TOAST_LIFE = { success: 3600, info: 3600, warning: 5200, error: 6400 };

  function toast(title, message, kind) {
    var tray = $('.toast-tray');
    if (!tray) { return null; }
    var type = kind || 'info';
    var node = el('div', 'toast toast--' + type);
    node.setAttribute('role', type === 'error' ? 'alert' : 'status');

    var body = el('div', 'toast__body');
    body.appendChild(el('p', 'toast__title', title));
    if (message) { body.appendChild(el('p', 'toast__message', message)); }

    var close = el('button', 'toast__close', '\u00d7');
    close.type = 'button';
    close.setAttribute('aria-label', 'Dismiss notification');

    node.appendChild(el('span', 'toast__rule'));
    node.appendChild(body);
    node.appendChild(close);
    tray.appendChild(node);

    var timer = window.setTimeout(dismiss, TOAST_LIFE[type] || 4000);
    function dismiss() {
      window.clearTimeout(timer);
      node.classList.add('is-leaving');
      window.setTimeout(function () {
        if (node.parentNode) { node.parentNode.removeChild(node); }
      }, 220);
    }
    close.addEventListener('click', dismiss);
    return dismiss;
  }

  /* --- data bar -----------------------------------------------------------
     A proportion drawn inside a table cell. Always paired with the figure in
     text, never the only way the value is communicated. */
  function dataBar(fraction, hue, label) {
    var wrap = el('span', 'databar');
    var track = el('span', 'databar__track');
    var fill = el('span', 'databar__fill');
    var width = Math.max(0, Math.min(1, fraction)) * 100;
    fill.style.width = width.toFixed(2) + '%';
    if (hue) { fill.style.background = hue; }
    track.appendChild(fill);
    wrap.appendChild(track);
    wrap.appendChild(el('span', 'databar__value', label));
    return wrap;
  }

  /* --- pie chart ----------------------------------------------------------
     Hand-built SVG so the prototype carries no chart library. Slices are
     drawn as arcs; each one is focusable and labelled for keyboard and
     screen-reader users. */
  function pieChart(target, slices, options) {
    var config = options || {};
    var size = config.size || 260;
    var radius = size / 2;
    var inner = config.inner === undefined ? radius * 0.56 : config.inner;
    var total = slices.reduce(function (sum, s) { return sum + s.value; }, 0);
    target.innerHTML = '';
    if (!total) {
      target.appendChild(el('p', 'empty', 'No transactions to chart yet.'));
      return;
    }

    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + size + ' ' + size);
    svg.setAttribute('class', 'pie');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', config.label || 'Pie chart');

    var angle = -Math.PI / 2;
    slices.forEach(function (slice) {
      var sweep = (slice.value / total) * Math.PI * 2;
      var end = angle + sweep;
      var path = document.createElementNS(NS, 'path');
      path.setAttribute('d', arc(radius, radius, radius - 2, inner, angle, end));
      path.setAttribute('fill', slice.hue);
      path.setAttribute('class', 'pie__slice');
      var title = document.createElementNS(NS, 'title');
      title.textContent =
        slice.label + ' — ' + slice.display + ' (' + percent(slice.value / total) + ')';
      path.appendChild(title);
      svg.appendChild(path);
      angle = end;
    });

    if (inner > 0 && config.centre) {
      var centre = document.createElementNS(NS, 'text');
      centre.setAttribute('x', radius);
      centre.setAttribute('y', radius - 2);
      centre.setAttribute('class', 'pie__centre');
      centre.setAttribute('text-anchor', 'middle');
      centre.textContent = config.centre;
      svg.appendChild(centre);
      if (config.centreLabel) {
        var sub = document.createElementNS(NS, 'text');
        sub.setAttribute('x', radius);
        sub.setAttribute('y', radius + 16);
        sub.setAttribute('class', 'pie__centre-label');
        sub.setAttribute('text-anchor', 'middle');
        sub.textContent = config.centreLabel;
        svg.appendChild(sub);
      }
    }

    var figure = el('div', 'pie-wrap');
    figure.appendChild(svg);

    var key = el('ul', 'key');
    slices.forEach(function (slice) {
      var item = el('li', 'key__item');
      var swatch = el('span', 'key__swatch');
      swatch.style.background = slice.hue;
      item.appendChild(swatch);
      item.appendChild(el('span', 'key__label', slice.label));
      item.appendChild(el('span', 'key__value', slice.display));
      item.appendChild(el('span', 'key__share', percent(slice.value / total, 1)));
      key.appendChild(item);
    });
    figure.appendChild(key);
    target.appendChild(figure);
  }

  function arc(cx, cy, outer, inner, start, end) {
    var large = end - start > Math.PI ? 1 : 0;
    var x1 = cx + outer * Math.cos(start), y1 = cy + outer * Math.sin(start);
    var x2 = cx + outer * Math.cos(end),   y2 = cy + outer * Math.sin(end);
    if (inner <= 0) {
      return 'M ' + cx + ' ' + cy + ' L ' + x1 + ' ' + y1 +
             ' A ' + outer + ' ' + outer + ' 0 ' + large + ' 1 ' + x2 + ' ' + y2 + ' Z';
    }
    var x3 = cx + inner * Math.cos(end),   y3 = cy + inner * Math.sin(end);
    var x4 = cx + inner * Math.cos(start), y4 = cy + inner * Math.sin(start);
    return 'M ' + x1 + ' ' + y1 +
           ' A ' + outer + ' ' + outer + ' 0 ' + large + ' 1 ' + x2 + ' ' + y2 +
           ' L ' + x3 + ' ' + y3 +
           ' A ' + inner + ' ' + inner + ' 0 ' + large + ' 0 ' + x4 + ' ' + y4 + ' Z';
  }

  /* --- loading state ------------------------------------------------------ */
  function setBusy(on) {
    var bar = $('.loading');
    if (bar) { bar.hidden = !on; }
  }

  /* --- source notice ------------------------------------------------------ */
  function announceSource(result) {
    var count = result.transactions.length;
    var captured = result.captured
      ? ' Includes ' + result.captured + ' captured in this session.'
      : '';

    setRegisterCount(count);

    if (result.source === 'network') {
      toast('Register loaded',
        number(count) + ' transactions received from ' + WinaAPI.endpoint + '.' + captured,
        'success');
    } else if (result.source === 'offline') {
      toast(
        'Loaded from the built-in copy',
        'The browser blocked the request (' + (result.reason || 'no access') +
        '). Serve the folder over HTTP to exercise the live request.' + captured,
        'warning'
      );
    }
  }

  function setRegisterCount(count) {
    var badge = $('[data-nav="register"] .nav-link__meta');
    if (badge) { badge.textContent = number(count); }
  }

  return {
    $: $, $$: $$, el: el,
    money: money, number: number, percent: percent,
    initNav: initNav, toast: toast, dataBar: dataBar, pieChart: pieChart,
    setBusy: setBusy, announceSource: announceSource, setRegisterCount: setRegisterCount,
    initLogout: initLogout
  };
})();
