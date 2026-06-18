/**
 * Position details — hydrate from URL query params and Yahoo Finance quote (daily performance).
 */
(function () {
  'use strict';

  var QUOTE_URL = '/api/yahoo/v7/finance/quote';
  var USD_TO_CHF = 0.88;
  var MONTHS_FULL = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  var FALLBACK_QUOTES = {
    AAPL: { regularMarketPrice: 227.5, regularMarketChange: 1.82, regularMarketChangePercent: 0.81, regularMarketDayHigh: 229.4, regularMarketDayLow: 225.1 },
    MSFT: { regularMarketPrice: 442.3, regularMarketChange: -2.15, regularMarketChangePercent: -0.48, regularMarketDayHigh: 446.8, regularMarketDayLow: 439.6 },
    NVDA: { regularMarketPrice: 135.4, regularMarketChange: 3.62, regularMarketChangePercent: 2.75, regularMarketDayHigh: 138.2, regularMarketDayLow: 130.8 },
    SAP: { regularMarketPrice: 268.9, regularMarketChange: 0.94, regularMarketChangePercent: 0.35, regularMarketDayHigh: 271.5, regularMarketDayLow: 266.2 },
    TM: { regularMarketPrice: 193.6, regularMarketChange: -1.24, regularMarketChangePercent: -0.64, regularMarketDayHigh: 196.1, regularMarketDayLow: 191.8 }
  };

  var DEPOSIT_ACCOUNT_LABEL = 'Custody account 123.456.78';

  /** USD close on 14 Feb 2025 (deposit opening month) — StatMuse / market data. */
  var ACQUISITION_PRICE_USD = {
    AAPL: 243.31,
    MSFT: 403.64,
    NVDA: 138.64,
    SAP: 283.16,
    TM: 175.17
  };

  var DEFAULT_POSITION = {
    symbol: 'ABB',
    name: 'ABB Ltd',
    isin: 'CH0012221711',
    exchange: 'SWX',
    price: 1008.5,
    changePerShare: 8.5,
    changePct: 0.85,
    quantity: 5,
    acquisitionPrice: 980,
    value: 5042.5,
    unrealizedPl: 142.5,
    totalPl: 142.5,
    high: 1015,
    low: 992.5
  };

  function formatMoney(n) {
    if (typeof n !== 'number' || isNaN(n)) return '0.00';
    var sign = n < 0 ? '-' : '';
    var absStr = Math.abs(n).toFixed(2);
    var parts = absStr.split('.');
    return sign + parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "'") + '.' + parts[1];
  }

  function formatSignedMoney(n) {
    var sign = n >= 0 ? '+ ' : '- ';
    return sign + formatMoney(Math.abs(n));
  }

  function formatPercent(pct) {
    var sign = pct >= 0 ? '+' : '';
    return sign + pct.toFixed(2) + ' %';
  }

  function formatMarketDate(date) {
    return date.getDate() + '. ' + MONTHS_FULL[date.getMonth()] + ' ' + date.getFullYear();
  }

  function toIsoDate(date) {
    var y = date.getFullYear();
    var m = String(date.getMonth() + 1).padStart(2, '0');
    var d = String(date.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + d;
  }

  function usdToChf(usd) {
    return usd * USD_TO_CHF;
  }

  function acquisitionPriceForSymbol(symbol) {
    var usd = ACQUISITION_PRICE_USD[symbol];
    return usd != null ? usdToChf(usd) : null;
  }

  function enrichPositionMetrics(position) {
    var acq = acquisitionPriceForSymbol(position.symbol);
    if (acq != null) {
      position.acquisitionPrice = acq;
    }
    position.value = position.price * position.quantity;
    if (position.acquisitionPrice != null) {
      position.unrealizedPl = (position.price - position.acquisitionPrice) * position.quantity;
      position.totalPl = position.unrealizedPl;
    }
    return position;
  }

  function readPositionFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var symbol = params.get('symbol') || DEFAULT_POSITION.symbol;
    var name = params.get('name') || DEFAULT_POSITION.name;
    var quantity = parseInt(params.get('qty'), 10);
    var price = parseFloat(params.get('price'));
    var changePerShare = parseFloat(params.get('change'));
    var changePct = parseFloat(params.get('changePct'));
    var dayHigh = parseFloat(params.get('dayHigh'));
    var dayLow = parseFloat(params.get('dayLow'));

    if (window.UZBankPayState && typeof window.UZBankPayState.getPosition === 'function') {
      var stored = window.UZBankPayState.getPosition(symbol);
      if (stored) {
        if (stored.name) name = stored.name;
        if (typeof stored.quantity === 'number') quantity = stored.quantity;
      }
    }

    var position = {
      symbol: symbol,
      name: name,
      isin: params.get('isin') || DEFAULT_POSITION.isin,
      exchange: params.get('exchange') || DEFAULT_POSITION.exchange,
      price: isNaN(price) ? DEFAULT_POSITION.price : price,
      changePerShare: isNaN(changePerShare) ? DEFAULT_POSITION.changePerShare : changePerShare,
      changePct: isNaN(changePct) ? DEFAULT_POSITION.changePct : changePct,
      quantity: isNaN(quantity) ? DEFAULT_POSITION.quantity : quantity,
      acquisitionPrice: DEFAULT_POSITION.acquisitionPrice,
      value: DEFAULT_POSITION.value,
      unrealizedPl: DEFAULT_POSITION.unrealizedPl,
      totalPl: DEFAULT_POSITION.totalPl,
      high: isNaN(dayHigh) ? DEFAULT_POSITION.high : dayHigh,
      low: isNaN(dayLow) ? DEFAULT_POSITION.low : dayLow,
      marketDate: null
    };

    return enrichPositionMetrics(position);
  }

  function applyQuoteToPosition(position, quote) {
    if (!quote) return position;

    var priceChf = usdToChf(quote.regularMarketPrice || 0);
    var changePerShare = usdToChf(quote.regularMarketChange || 0);
    var changePct = quote.regularMarketChangePercent || 0;
    var marketTime = quote.regularMarketTime;

    position.price = priceChf;
    position.changePerShare = changePerShare;
    position.changePct = changePct;
    position.value = priceChf * position.quantity;
    position.marketDate = marketTime ? new Date(marketTime * 1000) : new Date();

    if (quote.regularMarketDayHigh != null) {
      position.high = usdToChf(quote.regularMarketDayHigh);
    }
    if (quote.regularMarketDayLow != null) {
      position.low = usdToChf(quote.regularMarketDayLow);
    }

    return enrichPositionMetrics(position);
  }

  function fetchQuote(symbol) {
    return fetch(QUOTE_URL + '?symbols=' + encodeURIComponent(symbol))
      .then(function (res) {
        if (!res.ok) throw new Error('Quote request failed');
        return res.json();
      })
      .then(function (data) {
        var result = data && data.quoteResponse && data.quoteResponse.result;
        return result && result[0] ? result[0] : null;
      })
      .catch(function () {
        return FALLBACK_QUOTES[symbol] || null;
      });
  }

  function setText(selector, text) {
    var el = document.querySelector(selector);
    if (el) el.textContent = text;
  }

  function markShellRevealReady() {
    document.querySelectorAll('[data-shell-reveal="when-ready"]').forEach(function (el) {
      el.classList.add('shell-reveal--ready');
    });
  }

  function hydratePage(position) {
    window.__UZ_POSITION__ = position;
    document.title = 'UZ Bank – ' + position.name;

    setText('[data-position-title]', position.name);
    setText(
      '[data-position-meta]',
      'ISIN | ' + position.isin + ' | ' + position.exchange
    );
    setText('[data-position-price]', formatMoney(position.price));

    var isPositive = position.changePct >= 0;
    setText('[data-position-change-chf]', formatSignedMoney(position.changePerShare) + ' CHF');
    setText('[data-position-change-pct]', formatPercent(position.changePct));

    var changeIcon = document.querySelector('[data-position-change-icon] use');
    if (changeIcon) {
      changeIcon.setAttribute('href', isPositive ? '#i-trending-up' : '#i-trending-down');
    }

    var marketDate = position.marketDate || new Date();
    var dateEl = document.querySelector('[data-position-date]');
    if (dateEl) {
      dateEl.dateTime = toIsoDate(marketDate);
      dateEl.textContent = formatMarketDate(marketDate);
    }

    var myPositions = document.querySelector('[data-position-my-positions]');
    if (myPositions) {
      var rows = myPositions.querySelectorAll('.data-card__row');
      if (rows[0]) rows[0].querySelector('.data-card__value').textContent = DEPOSIT_ACCOUNT_LABEL;
      if (rows[1]) rows[1].querySelector('.data-card__value').textContent = 'CHF ' + formatMoney(position.acquisitionPrice);
      if (rows[2]) rows[2].querySelector('.data-card__value').textContent = 'CHF ' + formatMoney(position.value);
      if (rows[3]) rows[3].querySelector('.data-card__value').textContent = 'pcs. ' + position.quantity;
      if (rows[4]) rows[4].querySelector('.data-card__value').textContent = 'CHF ' + formatSignedMoney(position.unrealizedPl);
      if (rows[5]) rows[5].querySelector('.data-card__value').textContent = 'CHF ' + formatSignedMoney(position.totalPl);
    }

    var keyFigures = document.querySelector('[data-position-key-figures]');
    if (keyFigures) {
      var figureRows = keyFigures.querySelectorAll('.data-card__row');
      if (figureRows[0]) figureRows[0].querySelector('.data-card__value').textContent = 'CHF ' + formatMoney(position.high);
      if (figureRows[1]) figureRows[1].querySelector('.data-card__value').textContent = 'CHF ' + formatMoney(position.low);
    }

    if (window.UZBankPerformanceChart && typeof window.UZBankPerformanceChart.setEndAmount === 'function') {
      window.UZBankPerformanceChart.setEndAmount(position.price);
    }
  }

  function init() {
    if (document.body.getAttribute('data-screen') !== 'details-of-position') return;

    var position = readPositionFromUrl();
    hydratePage(position);
    markShellRevealReady();

    fetchQuote(position.symbol).then(function (quote) {
      if (!quote) return;
      var updated = readPositionFromUrl();
      hydratePage(applyQuoteToPosition(updated, quote));
    });

    document.addEventListener('uzbank:state-changed', function () {
      var refreshed = readPositionFromUrl();
      hydratePage(refreshed);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
