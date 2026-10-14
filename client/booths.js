/* ============================================================================
   booths.js — booth performance

   Case study item g, read at booth level: how much each booth turns over, what
   it earns, what it owes, and which services carry it. The service mix bar is
   the part a regional manager acts on — a booth leaning on one service is a
   booth that stops trading when that service runs out of float.
   ========================================================================== */

(function () {
  'use strict';

  var state = { transactions: [] };

  document.addEventListener('DOMContentLoaded', function () {
    UI.initNav();
    UI.setBusy(true);

    WinaAPI.loadTransactions(function (error, result) {
      UI.setBusy(false);
      if (error) {
        UI.toast('Booth data did not load', 'Reload the page to try again.', 'error');
        return;
      }
      state.transactions = result.transactions;
      render();
      UI.announceSource(result);
    });
  });

  function render() {
    var rows = WinaStore.byBooth(state.transactions);
    var totals = WinaStore.totals(state.transactions);
    var best = rows.reduce(function (max, r) { return Math.max(max, r.revenue); }, 0);
    var host = UI.$('#booth-cards');
    host.innerHTML = '';

    rows.slice()
      .sort(function (a, b) { return b.revenue - a.revenue; })
      .forEach(function (row, index) {
        host.appendChild(card(row, index + 1, best, totals.revenue));
      });

    var leader = rows.slice().sort(function (a, b) { return b.revenue - a.revenue; })[0];
    var quietest = rows.slice().sort(function (a, b) { return a.revenue - b.revenue; })[0];
    UI.$('#booth-lede').textContent =
      leader.booth + ' at ' + leader.location + ' earns ' +
      (quietest.revenue ? (leader.revenue / quietest.revenue).toFixed(1) : '—') +
      ' times what ' + quietest.booth + ' earns at ' + quietest.location + '.';
  }

  function card(row, rank, best, totalRevenue) {
    var panel = UI.el('article', 'panel');

    var head = UI.el('div', 'panel__head');
    var title = UI.el('div', '');
    title.appendChild(UI.el('div', 'panel__title', row.booth + ' — ' + row.location));
    title.appendChild(UI.el('div', 'panel__meta',
      UI.number(row.count) + ' transactions · ' +
      UI.percent(totalRevenue ? row.revenue / totalRevenue : 0, 1) + ' of company revenue'));
    head.appendChild(title);
    head.appendChild(UI.el('div', 'panel__meta', rank === 1 ? 'Highest earning' : 'Rank ' + rank));
    panel.appendChild(head);

    panel.appendChild(readout('Cumulative revenue', UI.money(row.revenue)));
    panel.appendChild(readout('Capital turned over', UI.money(row.capital, 0)));
    panel.appendChild(readout('Tax on commission', UI.money(row.vat)));
    panel.appendChild(readout('Revenue after tax', UI.money(row.netRevenue)));

    var against = UI.el('div', '');
    against.style.marginTop = 'var(--s4)';
    against.appendChild(UI.el('div', 'panel__meta', 'Against the strongest booth'));
    against.appendChild(UI.dataBar(best ? row.revenue / best : 0, null, UI.percent(best ? row.revenue / best : 0, 0)));
    panel.appendChild(against);

    var mix = UI.el('div', '');
    mix.style.marginTop = 'var(--s4)';
    mix.appendChild(UI.el('div', 'panel__meta', 'Service mix by transaction count'));

    var bar = UI.el('div', '');
    bar.style.display = 'flex';
    bar.style.height = '10px';
    bar.style.borderRadius = '999px';
    bar.style.overflow = 'hidden';
    bar.style.margin = '8px 0 12px';
    bar.style.background = 'var(--paper)';

    /* The catalogue, plus anything actually recorded against this booth that
       the catalogue does not cover — so the bar always adds up to 100%. */
    var carried = WINA.CATALOGUE[row.booth] || [];
    var listed = carried.slice();
    Object.keys(row.services).forEach(function (name) {
      if (listed.indexOf(name) === -1) { listed.push(name); }
    });

    var list = UI.el('ul', 'key');
    listed.forEach(function (name) {
      var count = row.services[name] || 0;
      var offCatalogue = carried.indexOf(name) === -1;
      var share = row.count ? count / row.count : 0;
      if (share > 0) {
        var segment = UI.el('span', '');
        segment.style.width = (share * 100).toFixed(2) + '%';
        segment.style.background = WINA.hueOf(name);
        bar.appendChild(segment);
      }
      var item = UI.el('li', 'key__item');
      var swatch = UI.el('span', 'key__swatch');
      swatch.style.background = WINA.hueOf(name);
      item.appendChild(swatch);
      var label = UI.el('span', 'key__label', name);
      if (offCatalogue) {
        label.textContent = name + ' — not carried here';
        label.style.color = 'var(--danger)';
        label.title = row.booth + ' is not listed as carrying ' + name;
      }
      item.appendChild(label);
      item.appendChild(UI.el('span', 'key__value', UI.number(count)));
      item.appendChild(UI.el('span', 'key__share', UI.percent(share, 0)));
      list.appendChild(item);
    });

    mix.appendChild(bar);
    mix.appendChild(list);
    panel.appendChild(mix);
    return panel;
  }

  function readout(label, value) {
    var row = UI.el('div', 'readout');
    row.appendChild(UI.el('span', 'readout__label', label));
    row.appendChild(UI.el('span', 'readout__value', value));
    return row;
  }
})();
