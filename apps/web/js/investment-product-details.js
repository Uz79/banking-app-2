(function () {
  'use strict';

  var CHART_POINTS = [
    { x: 0, y: 74, value: "18'500.00", date: '01.Nov 2025' },
    { x: 29, y: 67, value: "19'100.00", date: '01.Dec 2025' },
    { x: 57, y: 70, value: "18'900.00", date: '01.Jan 2026' },
    { x: 85, y: 54, value: "21'200.00", date: '01.Feb 2026' },
    { x: 113, y: 62, value: "20'400.00", date: '01.Mar 2026' },
    { x: 141, y: 50, value: "22'000.00", date: '01.Apr 2026' },
    { x: 169, y: 60, value: "20'600.00", date: '01.May 2026' },
    { x: 197, y: 44, value: "25'000.00", date: '05.May 2026' },
    { x: 225, y: 52, value: "23'400.00", date: '01.Jun 2026' },
    { x: 253, y: 40, value: "25'800.00", date: '01.Jul 2026' },
    { x: 281, y: 50, value: "24'200.00", date: '01.Aug 2026' },
    { x: 309, y: 46, value: "25'100.00", date: '01.Sep 2026' },
    { x: 337, y: 54, value: "23'900.00", date: '01.Oct 2026' },
    { x: 352, y: 48, value: "24'600.00", date: '01.Nov 2026' }
  ];

  function bindPerformanceRange() {
    var group = document.querySelector('[data-performance-range]');
    if (!group) return;

    group.addEventListener('click', function (event) {
      var button = event.target.closest('[data-range]');
      if (!button || !group.contains(button)) return;

      group.querySelectorAll('.performance-card__range-chip--active').forEach(function (el) {
        el.classList.remove('performance-card__range-chip--active');
        el.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('performance-card__range-chip--active');
      button.setAttribute('aria-pressed', 'true');
    });
  }

  function svgPoint(svg, clientX) {
    var pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = 0;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  function nearestPoint(x) {
    var best = CHART_POINTS[0];
    var bestDist = Infinity;

    CHART_POINTS.forEach(function (point) {
      var dist = Math.abs(point.x - x);
      if (dist < bestDist) {
        bestDist = dist;
        best = point;
      }
    });

    return best;
  }

  function positionTooltip(hoverGroup, point) {
    var marker = hoverGroup.querySelector('[data-performance-chart-marker]');
    var dot = hoverGroup.querySelector('[data-performance-chart-dot]');
    var tooltip = hoverGroup.querySelector('[data-performance-chart-tooltip]');
    var tooltipValue = hoverGroup.querySelector('[data-performance-chart-tooltip-value]');
    var tooltipDate = hoverGroup.querySelector('[data-performance-chart-tooltip-date]');
    var tooltipWidth = 240;
    var tooltipHeight = 40;
    var tooltipX = Math.min(Math.max(point.x - tooltipWidth / 2, 8), 388 - tooltipWidth - 8);
    var tooltipY = Math.max(point.y - 52, 8);

    marker.setAttribute('x1', String(point.x));
    marker.setAttribute('x2', String(point.x));
    marker.setAttribute('y1', String(point.y));
    dot.setAttribute('cx', String(point.x));
    dot.setAttribute('cy', String(point.y));
    tooltip.setAttribute('x', String(tooltipX));
    tooltip.setAttribute('y', String(tooltipY));
    tooltipValue.setAttribute('x', String(tooltipX + tooltipWidth / 2));
    tooltipValue.setAttribute('y', String(tooltipY + 18));
    tooltipDate.setAttribute('x', String(tooltipX + tooltipWidth / 2));
    tooltipDate.setAttribute('y', String(tooltipY + 32));
    tooltipValue.textContent = point.value;
    tooltipDate.textContent = point.date;
  }

  function bindPerformanceChart() {
    var svg = document.querySelector('[data-performance-chart]');
    if (!svg) return;

    var hitPath = svg.querySelector('.performance-card__chart-line-hit');
    var hoverGroup = svg.querySelector('[data-performance-chart-hover]');
    if (!hitPath || !hoverGroup) return;

    function showTooltip(clientX) {
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

  document.addEventListener('DOMContentLoaded', function () {
    bindPerformanceRange();
    bindPerformanceChart();
  });
})();
