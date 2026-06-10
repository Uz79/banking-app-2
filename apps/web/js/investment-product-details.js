(function () {
  'use strict';

  var CHART_HEIGHT = 164;
  var CHART_BASELINE_Y = 132;
  var CHART_Y_AXIS_TOP = 20;
  var CHART_Y_AXIS_BOTTOM = 132;
  var isPositionScreen = document.body.getAttribute('data-screen') === 'details-of-position';
  var CHART_Y_AXIS_TICKS = [0, 20, 40, 60];
  var CHART_Y_AXIS_MAX = isPositionScreen ? 1100 : 80000;
  var CHART_RIGHT_GUTTER = 36;
  var CHART_X_PADDING = 24;
  var TOOLTIP_HEIGHT = 43;
  var TOOLTIP_RX = 8;
  var TOOLTIP_DOT_RADIUS = 7;
  var TOOLTIP_GAP = 10;
  var TOOLTIP_MIN_WIDTH = 200;
  var TOOLTIP_MAX_WIDTH = 300;
  var TOOLTIP_PADDING_X = 16;
  var TOOLTIP_TEXT_Y_OFFSET = 27;

  var chartLayout = {
    viewWidth: 388,
    plotWidth: 352,
    yAxisX: 384
  };

  var activeYDomain = { min: 0, max: CHART_Y_AXIS_MAX };

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var X_AXIS_MONTHS = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
  var MS_HOUR = 60 * 60 * 1000;
  var MS_DAY = 24 * MS_HOUR;

  var CHART_END = isPositionScreen
    ? new Date(2026, 5, 10, 18, 0, 0)
    : new Date(2026, 4, 5, 16, 0, 0);

  function readPositionEndAmount() {
    var params = new URLSearchParams(window.location.search);
    var price = parseFloat(params.get('price'));
    return isNaN(price) ? 1008.5 : price;
  }

  var END_AMOUNT = isPositionScreen ? readPositionEndAmount() : 20000;
  var activeRangeKey = isPositionScreen ? '1d' : 'max';

  var MS_MINUTE = 60 * 1000;

  var DEPOSIT_CHART_RANGE_DEFS = {
    '1w': {
      startOffsetMs: 6 * MS_DAY,
      stepMs: MS_DAY,
      startAmount: 19840,
      seed: 1.7,
      xLabelFormat: 'short',
      volatility: { amplitudes: [380, 210, 110], frequencies: [5.2, 9.4, 2.8], smoothWindow: 0 }
    },
    '1m': {
      startOffsetMs: 30 * MS_DAY,
      stepMs: 2 * MS_DAY,
      startAmount: 19620,
      seed: 2.3,
      xLabelFormat: 'short',
      volatility: { amplitudes: [260, 145, 75], frequencies: [3.8, 7.1, 1.9], smoothWindow: 0 }
    },
    '3m': {
      startOffsetMs: 90 * MS_DAY,
      stepMs: 3 * MS_DAY,
      startAmount: 19240,
      seed: 3.1,
      xLabelFormat: 'month',
      volatility: { amplitudes: [120, 65, 35], frequencies: [2.2, 4.1, 1.1], smoothWindow: 1 }
    },
    ytd: {
      startAt: new Date(2026, 0, 1, 0, 0, 0),
      stepMs: 7 * MS_DAY,
      startAmount: 19120,
      seed: 4.4,
      xLabelFormat: 'month',
      volatility: { amplitudes: [180, 95, 48], frequencies: [1.6, 3.2, 0.75], smoothWindow: 0 }
    },
    max: {
      startAt: new Date(2025, 1, 1, 0, 0, 0),
      stepMs: 14 * MS_DAY,
      startAmount: 15000,
      seed: 5.9,
      xLabelFormat: 'monthYear',
      volatility: { amplitudes: [920, 540, 280], frequencies: [2.4, 4.8, 1.1], smoothWindow: 0 }
    }
  };

  var POSITION_CHART_RANGE_DEFS = {
    ytd: {
      startAt: new Date(2026, 0, 1, 0, 0, 0),
      stepMs: 7 * MS_DAY,
      startAmountOffset: 45,
      seed: 4.4,
      xLabelFormat: 'month',
      volatility: { amplitudes: [8, 4, 2], frequencies: [1.6, 3.2, 0.75], smoothWindow: 0 }
    },
    '1d': {
      startOffsetMs: 3 * MS_HOUR,
      stepMs: 15 * MS_MINUTE,
      startAmountOffset: 12,
      seed: 0.9,
      xLabelFormat: 'hourOnly',
      volatility: { amplitudes: [3.5, 2, 1], frequencies: [8.5, 14.2, 3.1], smoothWindow: 1 }
    },
    '1w': {
      startOffsetMs: 6 * MS_DAY,
      stepMs: MS_DAY,
      startAmountOffset: 18,
      seed: 1.7,
      xLabelFormat: 'short',
      volatility: { amplitudes: [12, 7, 4], frequencies: [5.2, 9.4, 2.8], smoothWindow: 0 }
    },
    '1m': {
      startOffsetMs: 30 * MS_DAY,
      stepMs: 2 * MS_DAY,
      startAmountOffset: 28,
      seed: 2.3,
      xLabelFormat: 'short',
      volatility: { amplitudes: [9, 5, 3], frequencies: [3.8, 7.1, 1.9], smoothWindow: 0 }
    },
    '3m': {
      startOffsetMs: 90 * MS_DAY,
      stepMs: 3 * MS_DAY,
      startAmountOffset: 45,
      seed: 3.1,
      xLabelFormat: 'month',
      volatility: { amplitudes: [6, 3, 2], frequencies: [2.2, 4.1, 1.1], smoothWindow: 1 }
    },
    '6m': {
      startOffsetMs: 180 * MS_DAY,
      stepMs: 7 * MS_DAY,
      startAmountOffset: 120,
      seed: 4.8,
      xLabelFormat: 'month',
      volatility: { amplitudes: [14, 8, 4], frequencies: [1.8, 3.4, 0.9], smoothWindow: 1 }
    },
    '1y': {
      startOffsetMs: 365 * MS_DAY,
      stepMs: 14 * MS_DAY,
      startAmountOffset: 250,
      seed: 6.2,
      xLabelFormat: 'monthYear',
      volatility: { amplitudes: [28, 16, 8], frequencies: [2.4, 4.8, 1.1], smoothWindow: 0 }
    }
  };

  var CHART_RANGE_DEFS = isPositionScreen ? POSITION_CHART_RANGE_DEFS : DEPOSIT_CHART_RANGE_DEFS;

  var CHART_RANGES = {};
  var activeChartPoints = [];

  function formatAmount(amount) {
    if (isPositionScreen) {
      var sign = amount < 0 ? '-' : '';
      var absStr = Math.abs(amount).toFixed(2);
      var parts = absStr.split('.');
      return sign + parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "'") + '.' + parts[1];
    }
    var whole = Math.round(amount);
    var str = String(Math.abs(whole));
    var grouped = str.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
    return grouped + '.00';
  }

  function formatAxisLabel(amount) {
    if (isPositionScreen) {
      var rounded = Math.round(amount * 100) / 100;
      if (Math.abs(rounded - Math.round(rounded)) < 0.001) {
        var whole = Math.round(rounded);
        return String(whole).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
      }
      var parts = rounded.toFixed(2).split('.');
      return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "'") + '.' + parts[1];
    }
    return String(Math.round(amount / 1000));
  }

  function formatDate(date, format) {
    var day = date.getDate();
    var month = MONTHS[date.getMonth()];
    var year = date.getFullYear();
    var dayStr = day < 10 ? '0' + day : String(day);
    var hour = date.getHours();
    var hourStr = hour < 10 ? '0' + hour : String(hour);

    if (format === 'hour') {
      return hourStr + ':00 · ' + dayStr + '.' + month + ' ' + year;
    }
    if (format === 'short') {
      return dayStr + '.' + month;
    }
    if (format === 'monthYear') {
      return month + ' ' + String(year).slice(-2);
    }
    return dayStr + '.' + month + ' ' + year;
  }

  function formatXLabel(date, format) {
    if (format === 'hourOnly') {
      var hour = date.getHours();
      return (hour < 10 ? '0' : '') + hour + ':00';
    }
    if (format === 'month') {
      return X_AXIS_MONTHS[date.getMonth()];
    }
    if (format === 'monthYear') {
      return X_AXIS_MONTHS[date.getMonth()] + ' ' + String(date.getFullYear()).slice(-2);
    }
    return formatDate(date, 'short');
  }

  function wiggle(seed, t, volatility) {
    var cfg = volatility || {
      amplitudes: [75, 40, 22],
      frequencies: [0.85, 1.65, 0.35]
    };
    var amps = cfg.amplitudes;
    var freqs = cfg.frequencies;

    return (
      Math.sin(t * freqs[0] + seed * 3.1) * amps[0] +
      Math.sin(t * freqs[1] + seed * 1.7) * amps[1] +
      Math.sin(t * freqs[2] + seed * 0.4) * amps[2]
    );
  }

  function smoothSeries(points, windowSize) {
    if (windowSize < 1 || points.length <= 2) return points;

    return points.map(function (point, index) {
      if (index === 0 || index === points.length - 1) return point;

      var from = Math.max(0, index - windowSize);
      var to = Math.min(points.length - 1, index + windowSize);
      var sum = 0;
      var count = 0;

      for (var i = from; i <= to; i++) {
        sum += points[i].amount;
        count++;
      }

      return {
        amount: isPositionScreen
          ? Math.round((sum / count) * 100) / 100
          : Math.round(sum / count),
        value: formatAmount(isPositionScreen ? sum / count : Math.round(sum / count)),
        date: point.date,
        timestamp: point.timestamp
      };
    });
  }

  function resolveStartAmount(def) {
    if (def.startAmount != null) return def.startAmount;
    if (def.startAmountOffset != null) return END_AMOUNT + def.startAmountOffset;
    return END_AMOUNT * 0.85;
  }

  function buildSeries(def) {
    var start = def.startAt
      ? new Date(def.startAt.getTime())
      : new Date(CHART_END.getTime() - def.startOffsetMs);
    var end = new Date(CHART_END.getTime());
    var step = def.stepMs;
    var points = [];
    var total = end.getTime() - start.getTime();
    var t = start.getTime();
    var seriesStart = resolveStartAmount(def);

    while (t <= end.getTime()) {
      var progress = total === 0 ? 1 : (t - start.getTime()) / total;
      var base = seriesStart + (END_AMOUNT - seriesStart) * progress;
      var amount = base + wiggle(def.seed, progress * 100, def.volatility);
      amount = isPositionScreen
        ? Math.round(amount * 100) / 100
        : Math.round(amount);

      points.push({
        amount: amount,
        value: formatAmount(amount),
        date: def.xLabelFormat === 'hourOnly'
          ? formatDate(new Date(t), 'hour')
          : formatDate(new Date(t), 'default'),
        timestamp: t
      });

      t += step;
    }

    if (!points.length || points[points.length - 1].timestamp !== end.getTime()) {
      points.push({
        amount: END_AMOUNT,
        value: formatAmount(END_AMOUNT),
        date: formatDate(end, 'default'),
        timestamp: end.getTime()
      });
    } else {
      points[points.length - 1].amount = END_AMOUNT;
      points[points.length - 1].value = formatAmount(END_AMOUNT);
    }

    return smoothSeries(points, def.volatility && def.volatility.smoothWindow != null
      ? def.volatility.smoothWindow
      : 1);
  }

  function buildXLabels(points, format) {
    if (points.length <= 1) {
      return [formatXLabel(new Date(points[0].timestamp), format)];
    }

    var indices = [
      0,
      Math.round((points.length - 1) / 3),
      Math.round(((points.length - 1) * 2) / 3),
      points.length - 1
    ];

    return indices.map(function (index, labelIndex) {
      var safeIndex = Math.min(index, points.length - 1);
      if (labelIndex > 0 && safeIndex <= indices[labelIndex - 1]) {
        safeIndex = Math.min(indices[labelIndex - 1] + 1, points.length - 1);
      }
      return formatXLabel(new Date(points[safeIndex].timestamp), format);
    });
  }

  function initChartRanges() {
    Object.keys(CHART_RANGE_DEFS).forEach(function (key) {
      var def = CHART_RANGE_DEFS[key];
      var points = buildSeries(def);
      CHART_RANGES[key] = {
        points: points,
        xLabels: buildXLabels(points, def.xLabelFormat)
      };
    });
  }

  function computeYDomain(points) {
    if (!points.length) {
      return { min: 0, max: CHART_Y_AXIS_MAX };
    }

    var minAmount = points[0].amount;
    var maxAmount = points[0].amount;

    points.forEach(function (point) {
      if (point.amount < minAmount) minAmount = point.amount;
      if (point.amount > maxAmount) maxAmount = point.amount;
    });

    var span = Math.max(maxAmount - minAmount, isPositionScreen ? Math.max(END_AMOUNT * 0.01, 0.5) : 1200);
    var pad = Math.max(span * 0.15, isPositionScreen ? Math.max(END_AMOUNT * 0.008, 0.25) : 800);

    if (isPositionScreen) {
      var step;
      if (span <= 15) step = 1;
      else if (span <= 60) step = 5;
      else if (span <= 200) step = 10;
      else step = Math.max(10, Math.ceil(span / 3 / 10) * 10);
      var min = Math.floor((minAmount - pad) / step) * step;
      var max = Math.ceil((maxAmount + pad) / step) * step;
      if (max - min < step * 3) max = min + step * 3;
      return {
        min: Math.max(0, min),
        max: max
      };
    }

    return {
      min: Math.max(0, Math.floor((minAmount - pad) / 1000) * 1000),
      max: Math.ceil((maxAmount + pad) / 1000) * 1000
    };
  }

  function amountToY(amount, domain) {
    var yDomain = domain || activeYDomain;
    var span = yDomain.max - yDomain.min;
    if (span <= 0) return CHART_Y_AXIS_BOTTOM;

    var ratio = (amount - yDomain.min) / span;
    var clamped = Math.max(0, Math.min(1, ratio));
    return CHART_Y_AXIS_BOTTOM - clamped * (CHART_Y_AXIS_BOTTOM - CHART_Y_AXIS_TOP);
  }

  function buildYAxisLabels(domain) {
    return CHART_Y_AXIS_TICKS.map(function (_tick, index) {
      var ratio = CHART_Y_AXIS_TICKS.length === 1
        ? 0
        : index / (CHART_Y_AXIS_TICKS.length - 1);
      var value = domain.min + (domain.max - domain.min) * ratio;
      return formatAxisLabel(value);
    });
  }

  function syncChartLayout(svg) {
    if (!svg) return;

    var width = svg.clientWidth;
    if (!width || width < 1) width = 388;

    chartLayout.viewWidth = Math.round(width);
    chartLayout.plotWidth = Math.max(chartLayout.viewWidth - CHART_RIGHT_GUTTER, 100);
    chartLayout.yAxisX = chartLayout.viewWidth - 4;
    svg.setAttribute('viewBox', '0 0 ' + chartLayout.viewWidth + ' ' + CHART_HEIGHT);

    var gradient = svg.querySelector('#performance-chart-fill');
    if (gradient) {
      var centerX = chartLayout.plotWidth / 2;
      gradient.setAttribute('x1', String(centerX));
      gradient.setAttribute('x2', String(centerX));
    }
  }

  function xLabelPositions() {
    var left = CHART_X_PADDING;
    var span = Math.max(chartLayout.plotWidth - left, 0);
    return [0, 1 / 3, 2 / 3, 1].map(function (ratio) {
      return left + span * ratio;
    });
  }

  function mapPoints(rawPoints, domain) {
    return rawPoints.map(function (point, index) {
      var x = rawPoints.length === 1
        ? chartLayout.plotWidth / 2
        : (index / (rawPoints.length - 1)) * chartLayout.plotWidth;
      var y = amountToY(point.amount, domain);

      return {
        x: x,
        y: y,
        value: point.value,
        date: point.date
      };
    });
  }

  function buildLinePath(points) {
    return points.map(function (point, index) {
      return (index === 0 ? 'M' : 'L') + point.x.toFixed(1) + ' ' + point.y.toFixed(1);
    }).join(' ');
  }

  function buildAreaPath(points) {
    if (!points.length) return '';
    var line = buildLinePath(points);
    var first = points[0];
    return line + ' V' + CHART_BASELINE_Y + ' H' + first.x.toFixed(1) + ' Z';
  }

  function updateYLabels(svg, domain) {
    var labels = buildYAxisLabels(domain);
    var nodes = svg.querySelectorAll('.performance-card__chart-axis--y');

    nodes.forEach(function (node, index) {
      var valueIndex = labels.length - 1 - index;
      if (labels[valueIndex] == null) return;
      node.textContent = String(labels[valueIndex]);
      node.setAttribute('x', String(chartLayout.yAxisX));
      node.setAttribute('text-anchor', 'end');
    });
  }

  function updateXLabels(svg, labels) {
    var nodes = svg.querySelectorAll('[data-performance-chart-x-label]');
    var positions = xLabelPositions();

    nodes.forEach(function (node, index) {
      if (labels[index]) {
        node.textContent = labels[index];
        node.setAttribute('x', String(positions[index] || positions[positions.length - 1]));
        node.removeAttribute('hidden');
      } else {
        node.setAttribute('hidden', '');
      }
    });
  }

  function renderChart(rangeKey) {
    var svg = document.querySelector('[data-performance-chart]');
    var config = CHART_RANGES[rangeKey];
    if (!svg || !config) return;

    activeRangeKey = rangeKey;
    syncChartLayout(svg);
    activeYDomain = computeYDomain(config.points);
    activeChartPoints = mapPoints(config.points, activeYDomain);

    var linePath = buildLinePath(activeChartPoints);
    var areaPath = buildAreaPath(activeChartPoints);

    svg.querySelector('[data-performance-chart-line]').setAttribute('d', linePath);
    svg.querySelector('[data-performance-chart-area]').setAttribute('d', areaPath);
    svg.querySelector('[data-performance-chart-line-hit]').setAttribute('d', linePath);

    updateYLabels(svg, activeYDomain);
    updateXLabels(svg, config.xLabels);

    var hoverGroup = svg.querySelector('[data-performance-chart-hover]');
    if (hoverGroup) hoverGroup.setAttribute('hidden', '');
  }

  function bindPerformanceRange() {
    var group = document.querySelector('[data-performance-range]');
    if (!group) return;

    group.addEventListener('click', function (event) {
      var button = event.target.closest('[data-range]');
      if (!button || !group.contains(button)) return;

      var rangeKey = button.getAttribute('data-range');
      if (!rangeKey || !CHART_RANGES[rangeKey]) return;

      group.querySelectorAll('.performance-card__range-chip--active').forEach(function (el) {
        el.classList.remove('performance-card__range-chip--active');
        el.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('performance-card__range-chip--active');
      button.setAttribute('aria-pressed', 'true');

      activeRangeKey = rangeKey;
      renderChart(rangeKey);
    });
  }

  function svgPoint(svg, clientX) {
    var pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = 0;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  function nearestPoint(x) {
    var best = activeChartPoints[0];
    var bestDist = Infinity;

    activeChartPoints.forEach(function (point) {
      var dist = Math.abs(point.x - x);
      if (dist < bestDist) {
        bestDist = dist;
        best = point;
      }
    });

    return best;
  }

  function estimateTooltipWidth(value, date) {
    var valueWidth = String(value).length * 7.5;
    var dateWidth = String(date).length * 6.5;
    var innerWidth = valueWidth + dateWidth + TOOLTIP_PADDING_X * 2;
    return Math.min(
      TOOLTIP_MAX_WIDTH,
      Math.max(TOOLTIP_MIN_WIDTH, Math.ceil(innerWidth))
    );
  }

  function positionTooltip(hoverGroup, point) {
    var marker = hoverGroup.querySelector('[data-performance-chart-marker]');
    var dot = hoverGroup.querySelector('[data-performance-chart-dot]');
    var tooltip = hoverGroup.querySelector('[data-performance-chart-tooltip]');
    var tooltipValue = hoverGroup.querySelector('[data-performance-chart-tooltip-value]');
    var tooltipDate = hoverGroup.querySelector('[data-performance-chart-tooltip-date]');

    tooltipValue.textContent = point.value;
    tooltipDate.textContent = point.date;

    var tooltipWidth = estimateTooltipWidth(point.value, point.date);
    var tooltipX = Math.min(
      Math.max(point.x - tooltipWidth / 2, 4),
      chartLayout.viewWidth - tooltipWidth - 4
    );
    var tooltipY = Math.max(
      point.y - TOOLTIP_DOT_RADIUS - TOOLTIP_GAP - TOOLTIP_HEIGHT,
      4
    );
    var textY = tooltipY + TOOLTIP_TEXT_Y_OFFSET;
    var valueX = tooltipX + TOOLTIP_PADDING_X;
    var dateX = tooltipX + tooltipWidth - TOOLTIP_PADDING_X;

    marker.setAttribute('x1', String(point.x));
    marker.setAttribute('x2', String(point.x));
    marker.setAttribute('y1', String(point.y));
    marker.setAttribute('y2', String(CHART_BASELINE_Y));
    dot.setAttribute('cx', String(point.x));
    dot.setAttribute('cy', String(point.y));
    tooltip.setAttribute('x', String(tooltipX));
    tooltip.setAttribute('y', String(tooltipY));
    tooltip.setAttribute('width', String(tooltipWidth));
    tooltip.setAttribute('height', String(TOOLTIP_HEIGHT));
    tooltip.setAttribute('rx', String(TOOLTIP_RX));
    tooltipValue.setAttribute('x', String(valueX));
    tooltipValue.setAttribute('y', String(textY));
    tooltipValue.setAttribute('text-anchor', 'start');
    tooltipDate.setAttribute('x', String(dateX));
    tooltipDate.setAttribute('y', String(textY));
    tooltipDate.setAttribute('text-anchor', 'end');
  }

  function bindPerformanceChart() {
    var svg = document.querySelector('[data-performance-chart]');
    if (!svg) return;

    var hitPath = svg.querySelector('[data-performance-chart-line-hit]');
    var hoverGroup = svg.querySelector('[data-performance-chart-hover]');
    if (!hitPath || !hoverGroup) return;

    function showTooltip(clientX) {
      if (!activeChartPoints.length) return;
      var point = nearestPoint(svgPoint(svg, clientX).x);
      positionTooltip(hoverGroup, point);
      hoverGroup.removeAttribute('hidden');
    }

    function hideTooltip() {
      hoverGroup.setAttribute('hidden', '');
    }

    hitPath.addEventListener('mousemove', function (event) {
      showTooltip(event.clientX);
    });

    hitPath.addEventListener('mouseenter', function (event) {
      showTooltip(event.clientX);
    });

    hitPath.addEventListener('mouseleave', hideTooltip);
  }

  function bindChartResize() {
    var svg = document.querySelector('[data-performance-chart]');
    if (!svg) return;

    function rerenderActiveRange() {
      renderChart(activeRangeKey);
    }

    if (typeof ResizeObserver !== 'undefined') {
      var observer = new ResizeObserver(function () {
        rerenderActiveRange();
      });
      observer.observe(svg);
    } else {
      window.addEventListener('resize', rerenderActiveRange);
    }
  }

  function setEndAmount(amount) {
    if (!isPositionScreen || typeof amount !== 'number' || isNaN(amount)) return;
    END_AMOUNT = amount;
    initChartRanges();
    renderChart(activeRangeKey);
  }

  if (typeof window !== 'undefined') {
    window.UZBankPerformanceChart = { setEndAmount: setEndAmount };
  }

  document.addEventListener('DOMContentLoaded', function () {
    initChartRanges();

    var activeRange = document.querySelector('[data-performance-range] .performance-card__range-chip--active');
    var initialRange = activeRange
      ? activeRange.getAttribute('data-range')
      : (isPositionScreen ? '1d' : 'max');
    activeRangeKey = initialRange;
    renderChart(initialRange);
    bindPerformanceRange();
    bindPerformanceChart();
    bindChartResize();
  });
})();
