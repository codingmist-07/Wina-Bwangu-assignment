/* ============================================================================
   transactions.js — the register

   Case study item e: all 308 rows from Appendix 1, priced, filterable and
   paged. Every row carries its own tax working so a figure on the dashboard
   can always be traced back to the transactions behind it.
   ========================================================================== */

(function () {
  'use strict';

  var PAGE_SIZE = 25;
  var state = {
    transactions: [],
    filtered: [],
    page: 1,
    sort: 'id-asc',
    booth: '',
    service: '',
    query: ''
  };

  document.addEventListener('DOMContentLoaded', function () {
    UI.initNav();
    fillFilters();
    UI.setBusy(true);

    WinaAPI.loadTransactions(function (error, result) {
      UI.setBusy(false);
      if (error) {
        UI.toast('Register did not load', 'Reload the page to try again.', 'error');
        return;
      }
      state.transactions = result.transactions;
      apply();
      UI.announceSource(result);
    });

    UI.$('#f-booth').addEventListener('change', function () {
      state.booth = this.value; state.page = 1; apply(true);
    });
    UI.$('#f-service').addEventListener('change', function () {
      state.service = this.value; state.page = 1; apply(true);
    });
    UI.$('#f-sort').addEventListener('change', function () {
      state.sort = this.value; apply();
    });
    UI.$('#f-search').addEventListener('input', function () {
      state.query = this.value.trim().toLowerCase(); state.page = 1; apply();
    });
    UI.$('#f-reset').addEventListener('click', reset);
    UI.$('#prev').addEventListener('click', function () { turn(-1); });
    UI.$('#next').addEventListener('click', function () { turn(1); });
  });

  function fillFilters() {
    var booth = UI.$('#f-booth');
    WINA.BOOTHS.forEach(function (b) {
      var option = document.createElement('option');
      option.value = b.code;
      option.textContent = b.code + ' — ' + b.location;
      booth.appendChild(option);
    });
    var service = UI.$('#f-service');
    WINA.SERVICES.forEach(function (s) {
      var option = document.createElement('option');
      option.value = s.name;
      option.textContent = s.name;
      service.appendChild(option);
    });
  }

  function apply(announce) {
    var rows = state.transactions.filter(function (t) {
      if (state.booth && t.booth !== state.booth) { return false; }
      if (state.service && t.service !== state.service) { return false; }
      if (state.query) {
        var hay = (t.transactionId + ' ' + t.booth + ' ' + t.location + ' ' + t.service).toLowerCase();
        if (hay.indexOf(state.query) === -1) { return false; }
      }
      return true;
    });

    rows.sort(sorter(state.sort));
    state.filtered = rows;
    renderRows();
    renderSummary();
    renderPager();

    if (announce) {
      if (!rows.length) {
        UI.toast('Nothing matches those filters', 'Clear one of them to see transactions again.', 'warning');
      } else {
        UI.toast('Filter applied', UI.number(rows.length) + ' of ' + UI.number(state.transactions.length) + ' transactions shown.', 'info');
      }
    }
  }

  function sorter(mode) {
    switch (mode) {
      case 'amount-desc': return function (a, b) { return b.transactionAmount - a.transactionAmount; };
      case 'amount-asc':  return function (a, b) { return a.transactionAmount - b.transactionAmount; };
      case 'revenue-desc': return function (a, b) {
        return WinaStore.price(b).commission - WinaStore.price(a).commission;
      };
      case 'booth': return function (a, b) {
        return a.booth.localeCompare(b.booth) || a.transactionId.localeCompare(b.transactionId);
      };
      case 'id-desc': return function (a, b) { return b.transactionId.localeCompare(a.transactionId); };
      default: return function (a, b) { return a.transactionId.localeCompare(b.transactionId); };
    }
  }

  function renderRows() {
    var body = UI.$('#register-rows');
    body.innerHTML = '';

    if (!state.filtered.length) {
      var tr = document.createElement('tr');
      var td = document.createElement('td');
      td.colSpan = 9;
      var empty = UI.el('div', 'empty');
      empty.appendChild(UI.el('strong', '', 'No transactions match'));
      empty.appendChild(UI.el('span', '', 'Widen the booth or service filter, or clear the search box.'));
      td.appendChild(empty);
      tr.appendChild(td);
      body.appendChild(tr);
      return;
    }

    var start = (state.page - 1) * PAGE_SIZE;
    state.filtered.slice(start, start + PAGE_SIZE).forEach(function (t) {
      var p = WinaStore.price(t);
      var tr = document.createElement('tr');
      tr.appendChild(cell(t.transactionId, 'mono-id'));
      tr.appendChild(cell(t.booth));
      tr.appendChild(cell(t.location));

      var service = document.createElement('td');
      var pill = UI.el('span', 'pill', t.service);
      pill.style.color = WINA.hueOf(t.service);
      service.appendChild(pill);
      tr.appendChild(service);

      tr.appendChild(cell(t.revenuePerKwacha.toFixed(3), 'num'));
      tr.appendChild(cell(UI.money(t.transactionAmount, 0), 'num'));
      tr.appendChild(cell(UI.money(p.commission), 'num'));
      tr.appendChild(cell(UI.money(p.vat), 'num'));
      tr.appendChild(cell(UI.money(p.amountAfterTax), 'num'));
      body.appendChild(tr);
    });
  }

  function renderSummary() {
    var t = WinaStore.totals(state.filtered);
    UI.$('#sum-count').textContent = UI.number(t.count);
    UI.$('#sum-amount').textContent = UI.money(t.capital, 0);
    UI.$('#sum-revenue').textContent = UI.money(t.revenue);
    UI.$('#sum-tax').textContent = UI.money(t.vat);
  }

  function renderPager() {
    var pages = Math.max(1, Math.ceil(state.filtered.length / PAGE_SIZE));
    if (state.page > pages) { state.page = pages; }
    var start = state.filtered.length ? (state.page - 1) * PAGE_SIZE + 1 : 0;
    var end = Math.min(state.page * PAGE_SIZE, state.filtered.length);
    UI.$('#pager-status').textContent =
      'Showing ' + UI.number(start) + '–' + UI.number(end) + ' of ' + UI.number(state.filtered.length);
    UI.$('#prev').disabled = state.page <= 1;
    UI.$('#next').disabled = state.page >= pages;
  }

  function turn(direction) {
    var pages = Math.max(1, Math.ceil(state.filtered.length / PAGE_SIZE));
    state.page = Math.min(pages, Math.max(1, state.page + direction));
    renderRows();
    renderPager();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function reset() {
    state.booth = ''; state.service = ''; state.query = ''; state.sort = 'id-asc'; state.page = 1;
    UI.$('#f-booth').value = '';
    UI.$('#f-service').value = '';
    UI.$('#f-search').value = '';
    UI.$('#f-sort').value = 'id-asc';
    apply();
    UI.toast('Filters cleared', 'All ' + UI.number(state.transactions.length) + ' transactions are shown.', 'info');
  }

  function cell(text, className) {
    var td = document.createElement('td');
    if (className) { td.className = className; }
    td.textContent = text;
    return td;
  }
})();
