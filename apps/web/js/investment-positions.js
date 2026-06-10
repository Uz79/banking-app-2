/**
 * Investment product details — Positions list from a curated set of well-known
 * equities (3 US, 1 European, 1 Japanese), priced via Yahoo Finance quote API.
 */
(function () {
  'use strict';

  var QUOTE_URL = '/api/yahoo/v7/finance/quote';
  var USD_TO_CHF = 0.88;

  /** Fixed portfolio mix — order preserved in the Positions list. */
  var CURATED_EQUITIES = [
    { symbol: 'AAPL', shortName: 'Apple Inc.', typeDisp: 'Equity' },
    { symbol: 'MSFT', shortName: 'Microsoft Corporation', typeDisp: 'Equity' },
    { symbol: 'NVDA', shortName: 'NVIDIA Corporation', typeDisp: 'Equity' },
    { symbol: 'SAP', shortName: 'SAP SE', typeDisp: 'Equity' },
    { symbol: 'TM', shortName: 'Toyota Motor Corporation', typeDisp: 'Equity' }
  ];

  var FALLBACK_BY_SYMBOL = {
    AAPL: { regularMarketPrice: 227.5, regularMarketChange: 1.82, regularMarketChangePercent: 0.81, regularMarketDayHigh: 229.4, regularMarketDayLow: 225.1 },
    MSFT: { regularMarketPrice: 442.3, regularMarketChange: -2.15, regularMarketChangePercent: -0.48, regularMarketDayHigh: 446.8, regularMarketDayLow: 439.6 },
    NVDA: { regularMarketPrice: 135.4, regularMarketChange: 3.62, regularMarketChangePercent: 2.75, regularMarketDayHigh: 138.2, regularMarketDayLow: 130.8 },
    SAP: { regularMarketPrice: 268.9, regularMarketChange: 0.94, regularMarketChangePercent: 0.35, regularMarketDayHigh: 271.5, regularMarketDayLow: 266.2 },
    TM: { regularMarketPrice: 193.6, regularMarketChange: -1.24, regularMarketChangePercent: -0.64, regularMarketDayHigh: 196.1, regularMarketDayLow: 191.8 }
  };

  function formatMoney(n) {
    if (window.UZBankPayState && window.UZBankPayState.formatMoney) {
      return window.UZBankPayState.formatMoney(n);
    }
    if (typeof n !== 'number' || isNaN(n)) return '0.00';
    var sign = n < 0 ? '-' : '';
    var absStr = Math.abs(n).toFixed(2);
    var parts = absStr.split('.');
    return sign + parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "'") + '.' + parts[1];
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatPercent(pct) {
    var sign = pct >= 0 ? '+' : '';
    return sign + pct.toFixed(2) + ' %';
  }

  function quantityForSymbol(symbol) {
    var sum = 0;
    for (var i = 0; i < symbol.length; i++) {
      sum += symbol.charCodeAt(i);
    }
    return 5 + (sum % 46);
  }

  function usdToChf(usd) {
    return usd * USD_TO_CHF;
  }

  function mergeWithCurated(quote) {
    var curated = CURATED_EQUITIES.filter(function (entry) {
      return entry.symbol === quote.symbol;
    })[0];

    if (!curated) return quote;

    return {
      symbol: curated.symbol,
      shortName: quote.shortName || quote.longName || curated.shortName,
      typeDisp: quote.typeDisp || curated.typeDisp,
      regularMarketPrice: quote.regularMarketPrice,
      regularMarketChange: quote.regularMarketChange,
      regularMarketChangePercent: quote.regularMarketChangePercent,
      regularMarketDayHigh: quote.regularMarketDayHigh,
      regularMarketDayLow: quote.regularMarketDayLow
    };
  }

  function fallbackQuote(entry) {
    var fb = FALLBACK_BY_SYMBOL[entry.symbol] || {};
    return {
      symbol: entry.symbol,
      shortName: entry.shortName,
      typeDisp: entry.typeDisp,
      regularMarketPrice: fb.regularMarketPrice || 0,
      regularMarketChange: fb.regularMarketChange || 0,
      regularMarketChangePercent: fb.regularMarketChangePercent || 0,
      regularMarketDayHigh: fb.regularMarketDayHigh,
      regularMarketDayLow: fb.regularMarketDayLow
    };
  }

  function fetchQuotes() {
    var symbols = CURATED_EQUITIES.map(function (entry) { return entry.symbol; });

    return fetch(QUOTE_URL + '?symbols=' + encodeURIComponent(symbols.join(',')))
      .then(function (res) {
        if (!res.ok) throw new Error('Quote request failed');
        return res.json();
      })
      .then(function (data) {
        var results = (data && data.quoteResponse && data.quoteResponse.result) || [];
        var bySymbol = {};

        results.forEach(function (quote) {
          if (quote && quote.symbol) bySymbol[quote.symbol] = quote;
        });

        return CURATED_EQUITIES.map(function (entry) {
          var live = bySymbol[entry.symbol];
          if (live && live.regularMarketPrice != null) {
            return mergeWithCurated(live);
          }
          return fallbackQuote(entry);
        });
      })
      .catch(function () {
        return CURATED_EQUITIES.map(fallbackQuote);
      });
  }

  function mapQuoteToPosition(quote) {
    var symbol = quote.symbol || '';
    var name = quote.shortName || quote.longName || quote.displayName || symbol;
    var priceChf = usdToChf(quote.regularMarketPrice || 0);
    var changeUsd = quote.regularMarketChange || 0;
    var changePct = quote.regularMarketChangePercent || 0;
    var qty = quantityForSymbol(symbol);
    var changeChf = usdToChf(changeUsd) * qty;
    var totalChf = priceChf * qty;
    var isPositive = changePct >= 0;

    var dayHighChf = quote.regularMarketDayHigh != null ? usdToChf(quote.regularMarketDayHigh) : null;
    var dayLowChf = quote.regularMarketDayLow != null ? usdToChf(quote.regularMarketDayLow) : null;

    return {
      symbol: symbol,
      name: name,
      subtitle: quote.typeDisp || 'Equity',
      priceChf: priceChf,
      quantity: qty,
      totalChf: totalChf,
      changeChf: changeChf,
      changePct: changePct,
      isPositive: isPositive,
      href: symbol
        ? 'details-of-position.html?symbol=' + encodeURIComponent(symbol)
          + '&name=' + encodeURIComponent(name)
          + '&qty=' + encodeURIComponent(String(qty))
          + '&price=' + encodeURIComponent(priceChf.toFixed(2))
          + '&change=' + encodeURIComponent(usdToChf(changeUsd).toFixed(2))
          + '&changePct=' + encodeURIComponent(changePct.toFixed(2))
          + (dayHighChf != null ? '&dayHigh=' + encodeURIComponent(dayHighChf.toFixed(2)) : '')
          + (dayLowChf != null ? '&dayLow=' + encodeURIComponent(dayLowChf.toFixed(2)) : '')
        : '#'
    };
  }

  function buildPositionRow(position) {
    var changeSign = position.changeChf >= 0 ? '+' : '';
    var trendIcon = position.isPositive ? 'i-trending-up' : 'i-trending-down';

    return (
      '<a class="list-item list-item--position" href="' + escapeHtml(position.href) + '" data-source="yahoo">' +
        '<div class="list-item__body type-stack-tight">' +
          '<span class="list-item__title type-sm type-bold type-trim">' + escapeHtml(position.name) + '</span>' +
          '<span class="list-item__subtitle type-xs type-trim">' + escapeHtml(position.subtitle) + '</span>' +
          '<span class="list-item__performance type-sm type-trim">' +
            '<svg class="list-item__performance-icon" aria-hidden="true" focusable="false"><use href="#' + trendIcon + '"/></svg>' +
            '<span class="list-item__performance-values">' +
              '<span class="list-item__performance-value">' + changeSign + formatMoney(position.changeChf) + ' CHF</span>' +
              '<span class="list-item__performance-value">' + formatPercent(position.changePct) + '</span>' +
            '</span>' +
          '</span>' +
        '</div>' +
        '<div class="list-item__end list-item__end--position type-stack-tight">' +
          '<div class="list-item__price type-sm type-trim">' +
            '<span class="list-item__currency type-xs">CHF</span>' +
            '<span class="list-item__value type-sm type-bold">' + formatMoney(position.priceChf) + '</span>' +
          '</div>' +
          '<span class="list-item__quantity type-xs type-trim">pcs. ' + position.quantity + '</span>' +
          '<div class="list-item__total type-sm type-trim">' +
            '<span class="list-item__currency type-xs">CHF</span>' +
            '<span class="list-item__value type-sm">' + formatMoney(position.totalChf) + '</span>' +
          '</div>' +
        '</div>' +
      '</a>'
    );
  }

  function buildPositionEntry(position, showDivider) {
    return (
      '<div class="positions-list__entry">' +
        buildPositionRow(position) +
        (showDivider ? '<div class="divider"></div>' : '') +
      '</div>'
    );
  }

  function markPositionsRevealReady() {
    var list = document.querySelector('[data-positions-list][data-shell-reveal="when-ready"]');
    if (list) list.classList.add('shell-reveal--ready');
  }

  function renderPositions(quotes) {
    var container = document.querySelector('[data-positions-list]');
    if (!container) return;

    var positions = quotes.map(mapQuoteToPosition);
    container.innerHTML = positions.map(function (position, index) {
      return buildPositionEntry(position, index < positions.length - 1);
    }).join('');
    container.removeAttribute('aria-busy');
    markPositionsRevealReady();
  }

  function initPositions() {
    var container = document.querySelector('[data-positions-list]');
    if (!container) return;

    container.setAttribute('aria-busy', 'true');
    fetchQuotes().then(renderPositions);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPositions);
  } else {
    initPositions();
  }
})();
