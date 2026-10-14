/* ============================================================================
   dashboard.js — renders every figure required by case study items d, f, g,
   h, i and j from the register returned by the API.
   ========================================================================== */

(function () {
  'use strict';

  var state = { transactions: [], pieMode: 'revenue' };

  document.addEventListener('DOMContentLoaded', function () {
    UI.initNav();
    UI.initLogout();
    UI.setBusy(true);

    WinaAPI.loadTransactions(function (error, result) {
      UI.setBusy(false);
      if (error) {
        UI.toast('Register did not load', 'Reload the page to try again.', 'error');
        return;
      }
      state.transactions = result.transactions;
      render();
      UI.announceSource(result);
      flagTightFloat();
    });

    UI.$$('.pie-toggle button').forEach(function (button) {
      button.addEventListener('click', function () {
        state.pieMode = button.getAttribute('data-mode');
        UI.$$('.pie-toggle button').forEach(function (b) {
          b.classList.toggle('btn--quiet', b !== button);
          b.setAttribute('aria-pressed', b === button ? 'true' : 'false');
        });
        renderPie();
      });
    });
  });

  function render() {
    renderBoard();
    renderTotals();
    renderPie();
    renderServiceTable();
    renderBoothTable();
    renderMatrix();
  }

  /* --- float board --------------------------------------------------------
     Fill height is the share of the monthly limit already consumed; the number
     above each gauge is what is left, because that is the operational figure. */
  function renderBoard() {
    var host = UI.$('#board-gauges');
    var services = WinaStore.byService(state.transactions);
    host.innerHTML = '';

    services.forEach(function (row) {
      var gauge = UI.el('div', 'gauge');
      if (row.utilisation >= 1) { gauge.classList.add('is-spent'); }
      else if (row.utilisation >= 0.9) { gauge.classList.add('is-tight'); }

      gauge.appendChild(UI.el('span', 'gauge__remaining', UI.money(row.remaining, 0)));
      gauge.appendChild(UI.el('span', 'gauge__caption', 'left of ' + UI.money(row.limit, 0)));

      var track = UI.el('div', 'gauge__track');
      var fill = UI.el('span', 'gauge__fill');
      fill.style.background = row.hue;
      fill.style.height = '0%';
      track.appendChild(fill);

      var mark = UI.el('div', 'gauge__mark');
      mark.style.bottom = '90%';
      mark.appendChild(UI.el('span', '', '90%'));
      track.appendChild(mark);
      gauge.appendChild(track);

      var foot = UI.el('div', 'gauge__foot');
      foot.appendChild(UI.el('span', 'gauge__name', row.service));
      foot.appendChild(UI.el('span', 'gauge__use', UI.percent(row.utilisation, 0) + ' used'));
      gauge.appendChild(foot);

      host.appendChild(gauge);

      window.setTimeout(function () {
        fill.style.height = Math.min(100, row.utilisation * 100).toFixed(2) + '%';
      }, 60);
    });
  }

  /* --- summaries (case study item i) -------------------------------------- */
  function renderTotals() {
    var t = WinaStore.totals(state.transactions);
    UI.$('#total-revenue').textContent = UI.money(t.revenue);
    UI.$('#total-revenue-note').textContent =
      UI.number(t.count) + ' transactions, commission before tax';
    UI.$('#total-capital').textContent = UI.money(t.capital, 0);
    UI.$('#total-tax').textContent = UI.money(t.vat);
    UI.$('#total-net').textContent = UI.money(t.netRevenue);
    UI.$('#count-transactions').textContent = UI.number(t.count);
  }

  /* --- pie chart (case study item j) -------------------------------------- */
  function renderPie() {
    var rows = WinaStore.byService(state.transactions);
    var revenue = state.pieMode === 'revenue';
    var slices = rows.map(function (row) {
      var value = revenue ? row.revenue : row.used;
      return {
        label: row.service,
        hue: row.hue,
        value: value,
        display: UI.money(value, revenue ? 2 : 0)
      };
    });
    var total = slices.reduce(function (sum, s) { return sum + s.value; }, 0);
    UI.pieChart(UI.$('#pie'), slices, {
      size: 240,
      inner: 68,
      centre: UI.money(total, 0),
      centreLabel: revenue ? 'total revenue' : 'total capital',
      label: revenue ? 'Revenue by service' : 'Capital required by service'
    });
    UI.$('#pie-caption').textContent = revenue
      ? 'Commission earned per service across all six booths.'
      : 'Credit each service must be floated with to clear the month.';
  }

  /* --- service table (case study item f) ---------------------------------- */
  function renderServiceTable() {
    var body = UI.$('#service-rows');
    body.innerHTML = '';
    WinaStore.byService(state.transactions).forEach(function (row) {
      var tr = document.createElement('tr');

      var name = document.createElement('td');
      var pill = UI.el('span', 'pill', row.service);
      pill.style.color = row.hue;
      var wrap = UI.el('span', '');
      wrap.appendChild(pill);
      name.appendChild(wrap);
      tr.appendChild(name);

      tr.appendChild(cell(UI.money(row.limit, 0), 'num'));
      tr.appendChild(cell(UI.money(row.used, 0), 'num'));

      var bar = document.createElement('td');
      bar.appendChild(UI.dataBar(row.utilisation, row.hue, UI.percent(row.utilisation, 1)));
      tr.appendChild(bar);

      var remaining = cell(UI.money(row.remaining, 0), 'num');
      if (row.remaining <= 0) { remaining.style.color = 'var(--danger)'; }
      else if (row.utilisation >= 0.9) { remaining.style.color = 'var(--warn)'; }
      tr.appendChild(remaining);

      tr.appendChild(cell(UI.number(row.count), 'num'));
      tr.appendChild(cell(UI.money(row.revenue), 'num'));
      body.appendChild(tr);
    });
  }

  /* --- booth table (case study item g) ------------------------------------ */
  function renderBoothTable() {
    var body = UI.$('#booth-rows');
    var rows = WinaStore.byBooth(state.transactions);
    var best = rows.reduce(function (max, r) { return Math.max(max, r.revenue); }, 0);
    body.innerHTML = '';

    rows.slice().sort(function (a, b) { return b.revenue - a.revenue; }).forEach(function (row) {
      var tr = document.createElement('tr');
      tr.appendChild(cell(row.booth, 'mono-id'));
      tr.appendChild(cell(row.location));
      tr.appendChild(cell(UI.number(row.count), 'num'));
      tr.appendChild(cell(UI.money(row.capital, 0), 'num'));

      var bar = document.createElement('td');
      bar.appendChild(UI.dataBar(best ? row.revenue / best : 0, null, UI.money(row.revenue)));
      tr.appendChild(bar);

      var tax = document.createElement('td');
      tax.className = 'num';
      tax.appendChild(UI.dataBar(
        best ? row.vat / (best * WinaStore.TAX_RATE) : 0,
        'var(--warn)',
        UI.money(row.vat)
      ));
      tr.appendChild(tax);

      tr.appendChild(cell(row.topService));
      body.appendChild(tr);
    });
  }

  /* --- frequency matrix (case study item h) ------------------------------- */
  function renderMatrix() {
    var head = UI.$('#matrix-head');
    var body = UI.$('#matrix-rows');
    head.innerHTML = '';
    body.innerHTML = '';

    var corner = document.createElement('th');
    corner.textContent = 'Booth';
    head.appendChild(corner);
    WINA.SERVICES.forEach(function (s) {
      var th = document.createElement('th');
      th.textContent = s.name;
      head.appendChild(th);
    });
    var totalHead = document.createElement('th');
    totalHead.textContent = 'All services';
    head.appendChild(totalHead);

    var matrix = WinaStore.frequencyMatrix(state.transactions);
    matrix.rows.forEach(function (row) {
      var tr = document.createElement('tr');
      var label = document.createElement('td');
      label.appendChild(UI.el('span', 'mono-id', row.booth));
      label.appendChild(UI.el('span', 'muted', '  ' + row.location));
      tr.appendChild(label);

      row.cells.forEach(function (c) {
        var td = document.createElement('td');
        var off = !c.offered;
        var box = UI.el('span', 'cell', off && !c.count ? 'not offered' : UI.number(c.count));
        if (off && c.count) {
          /* Recorded against a service the booth is not listed as carrying —
             shown, not swallowed, because it is a control failure. */
          box.classList.add('cell--flag');
          box.title = row.booth + ' is not listed as carrying ' + c.service;
        } else if (off) {
          box.classList.add('cell--off');
        } else {
          var weight = matrix.peak ? c.count / matrix.peak : 0;
          box.style.background = tint(c.hue, 0.1 + weight * 0.55);
          box.style.color = weight > 0.55 ? '#FFFFFF' : 'var(--text)';
        }
        td.appendChild(box);
        tr.appendChild(td);
      });

      tr.appendChild(cell(UI.number(row.total), 'num'));
      body.appendChild(tr);
    });

    reportExceptions(matrix);
  }

  /* Transactions recorded against a service the booth does not carry. The
     prototype's own capture form cannot produce one, so any that appear came
     in before the control existed — worth naming on the dashboard. */
  function reportExceptions(matrix) {
    var host = UI.$('#matrix-note');
    var offenders = [];
    matrix.rows.forEach(function (row) {
      row.cells.forEach(function (c) {
        if (!c.offered && c.count) {
          offenders.push(row.booth + ' recorded ' + UI.number(c.count) + ' on ' + c.service);
        }
      });
    });
    if (!offenders.length) {
      host.textContent = 'Every transaction sits inside its booth\u2019s service catalogue.';
      return;
    }
    host.textContent = offenders.join('; ') +
      ' \u2014 outside the catalogue in the case study. Flagged in red above.';
    host.style.color = 'var(--danger)';
  }

  /* --- helpers ------------------------------------------------------------ */
  function cell(text, className) {
    var td = document.createElement('td');
    if (className) { td.className = className; }
    td.textContent = text;
    return td;
  }

  function tint(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha.toFixed(2) + ')';
  }

  /* Any service within 10% of its ceiling is worth interrupting for. */
  function flagTightFloat() {
    var tight = WinaStore.byService(state.transactions).filter(function (row) {
      return row.utilisation >= 0.9;
    });
    if (!tight.length) { return; }
    var names = tight.map(function (r) { return r.service; }).join(', ');
    UI.toast(
      'Float running low',
      names + ' ' + (tight.length > 1 ? 'are' : 'is') +
        ' above 90% of the monthly limit. Top up before the next large transaction.',
      'warning'
    );
  }
})();
