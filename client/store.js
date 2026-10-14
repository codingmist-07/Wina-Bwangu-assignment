/* ============================================================================
   store.js — every number the dashboard shows is computed here, once

   Money model used throughout (stated plainly so it can be defended):
     commission = transaction amount x revenue per kwacha
     VAT        = commission x 16%
     net revenue after tax = commission - VAT
     amount after tax      = transaction amount - VAT   (what leaves the float)
     capital    = sum of transaction amounts — the credit a booth must hold
   ========================================================================== */

var WinaStore = (function () {
  'use strict';

  var TAX = WINA.RULES.TAX_RATE;

  function priceOne(amount, rate) {
    var commission = amount * rate;
    var vat = commission * TAX;
    return {
      amount: amount,
      commission: commission,
      vat: vat,
      netRevenue: commission - vat,
      amountAfterTax: amount - vat
    };
  }

  function price(transaction) {
    return priceOne(transaction.transactionAmount, transaction.revenuePerKwacha);
  }

  /* Totals across the whole register. */
  function totals(transactions) {
    var out = { count: 0, capital: 0, revenue: 0, vat: 0, netRevenue: 0 };
    transactions.forEach(function (t) {
      var p = price(t);
      out.count += 1;
      out.capital += p.amount;
      out.revenue += p.commission;
      out.vat += p.vat;
      out.netRevenue += p.netRevenue;
    });
    return out;
  }

  /* Per service: cumulative total, revenue, and what is left of the monthly
     limit — the number an agent needs before accepting a transaction. */
  function byService(transactions) {
    var index = {};
    WINA.SERVICES.forEach(function (s) {
      index[s.name] = {
        service: s.name,
        hue: s.hue,
        rate: s.rate,
        limit: s.limit,
        used: 0,
        remaining: s.limit,
        utilisation: 0,
        count: 0,
        revenue: 0,
        vat: 0
      };
    });
    transactions.forEach(function (t) {
      var row = index[t.service];
      if (!row) { return; }
      var p = price(t);
      row.used += p.amount;
      row.count += 1;
      row.revenue += p.commission;
      row.vat += p.vat;
    });
    return WINA.SERVICES.map(function (s) {
      var row = index[s.name];
      row.remaining = row.limit - row.used;
      row.utilisation = row.limit ? row.used / row.limit : 0;
      return row;
    });
  }

  /* Per booth: throughput, cumulative revenue, tax owed, busiest service. */
  function byBooth(transactions) {
    var index = {};
    WINA.BOOTHS.forEach(function (b) {
      index[b.code] = {
        booth: b.code,
        location: b.location,
        count: 0,
        capital: 0,
        revenue: 0,
        vat: 0,
        netRevenue: 0,
        services: {},
        topService: '—'
      };
    });
    transactions.forEach(function (t) {
      var row = index[t.booth];
      if (!row) { return; }
      var p = price(t);
      row.count += 1;
      row.capital += p.amount;
      row.revenue += p.commission;
      row.vat += p.vat;
      row.netRevenue += p.netRevenue;
      row.services[t.service] = (row.services[t.service] || 0) + 1;
    });
    return WINA.BOOTHS.map(function (b) {
      var row = index[b.code];
      var best = null;
      Object.keys(row.services).forEach(function (name) {
        if (!best || row.services[name] > row.services[best]) { best = name; }
      });
      row.topService = best || '—';
      row.share = 0;
      return row;
    });
  }

  /* How often each service is sold at each booth (case study item h). */
  function frequencyMatrix(transactions) {
    var rows = WINA.BOOTHS.map(function (b) {
      var cells = WINA.SERVICES.map(function (s) {
        return {
          service: s.name,
          hue: s.hue,
          count: 0,
          offered: (WINA.CATALOGUE[b.code] || []).indexOf(s.name) !== -1
        };
      });
      return { booth: b.code, location: b.location, cells: cells, total: 0 };
    });
    var lookup = {};
    rows.forEach(function (r) {
      lookup[r.booth] = {};
      r.cells.forEach(function (c) { lookup[r.booth][c.service] = c; });
    });
    transactions.forEach(function (t) {
      var cell = lookup[t.booth] && lookup[t.booth][t.service];
      if (!cell) { return; }
      cell.count += 1;
    });
    var peak = 0;
    rows.forEach(function (r) {
      r.cells.forEach(function (c) {
        r.total += c.count;
        if (c.count > peak) { peak = c.count; }
      });
    });
    return { rows: rows, peak: peak };
  }

  /* Can this transaction go through? Used by the capture form. */
  function checkFloat(transactions, service, amount) {
    if (!service) { return { ok: false, reason: 'unknown service' }; }
    var used = 0;
    transactions.forEach(function (t) {
      if (t.service === service.service_name) { used += t.transactionAmount; }
    });
    var remaining = Number(service.month_limit) - used;
    return {
      ok: amount <= remaining,
      limit: Number(service.month_limit),
      used: used,
      remaining: remaining,
      shortfall: Math.max(0, amount - remaining),
      after: remaining - amount
    };
  }

  return {
    price: price,
    priceOne: priceOne,
    totals: totals,
    byService: byService,
    byBooth: byBooth,
    frequencyMatrix: frequencyMatrix,
    checkFloat: checkFloat,
    TAX_RATE: TAX
  };
})();
