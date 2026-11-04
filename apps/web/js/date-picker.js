/**
 * The execution-date calendar (roadmap 28): a month grid the app draws itself, shown in the form sheet
 * (js/form-field-sheet.js, `openDateSheet`) from "Execute on" in Pay and the internal transfer.
 *
 * Dates that can be picked (D3): Monday to Friday, from the next working day to the same date twelve months
 * ahead. Today has a ring but is "as soon as possible", so it can't be picked (D2).
 *
 * Keyboard (D8): one day in the grid takes focus (roving tabindex). Arrows move a day or a week, Page Up /
 * Page Down a month, Home / End to the start or end of the week; Enter or Space picks. Days that can't be
 * picked still take focus, so moving never skips a day, but they don't pick.
 */
(function () {
  'use strict';

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  var uid = 0;

  function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function sameDay(a, b) { return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
  function isWeekend(d) { var w = d.getDay(); return w === 0 || w === 6; }
  /* Monday is the first column */
  function weekdayIndex(d) { return (d.getDay() + 6) % 7; }

  /* A month away, on the same day where it exists (31 January → 28 or 29 February) */
  function addMonths(d, n) {
    var target = new Date(d.getFullYear(), d.getMonth() + n, 1);
    var last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
    return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), last));
  }

  function nextWorkingDay(from) {
    var d = addDays(startOfDay(from || new Date()), 1);
    while (isWeekend(d)) d = addDays(d, 1);
    return d;
  }

  /* The dates "Execute on" allows (D3) */
  function executionRange(today) {
    today = startOfDay(today || new Date());
    var min = nextWorkingDay(today);
    var max = addMonths(today, 12);
    return {
      today: today,
      min: min,
      max: max,
      allows: function (d) { return !!d && d >= min && d <= max && !isWeekend(d); }
    };
  }

  /* The flows keep the date as its DD.MM.YYYY label (D6) */
  function formatLabel(d) {
    return String(d.getDate()).padStart(2, '0') + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + d.getFullYear();
  }

  function parseLabel(label) {
    var m = String(label || '').match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if (!m) return null;
    var d = new Date(+m[3], +m[2] - 1, +m[1]);
    return d.getDate() === +m[1] && d.getMonth() === +m[2] - 1 ? d : null;
  }

  /* "Monday, 9 November 2026" */
  function longLabel(d) {
    return DAYS[weekdayIndex(d)] + ', ' + d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
  }

  function icon(id) {
    return '<svg class="date-picker__nav-icon" aria-hidden="true" focusable="false"><use href="#' + id + '"/></svg>';
  }

  /**
   * Draw the calendar into `container`.
   * options: { selected: Date, range: executionRange(), onPick(date) }
   * Returns { focusDay() } to put focus on the selected (or first allowed) day.
   */
  function render(container, options) {
    var range = options.range || executionRange();
    var selected = options.selected && range.allows(options.selected) ? startOfDay(options.selected) : range.min;
    var focusDate = selected;
    var view = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
    var labelId = 'date-picker-month-' + (++uid);

    container.innerHTML = '';
    var root = document.createElement('div');
    root.className = 'date-picker';
    root.innerHTML =
      '<div class="date-picker__header">' +
      '<button type="button" class="date-picker__nav" data-dp-step="-1" aria-label="Previous month">' + icon('i-chevron-left') + '</button>' +
      '<p class="date-picker__month" id="' + labelId + '" aria-live="polite"></p>' +
      '<button type="button" class="date-picker__nav" data-dp-step="1" aria-label="Next month">' + icon('i-chevron-right') + '</button>' +
      '</div>' +
      '<table class="date-picker__grid" role="grid" aria-labelledby="' + labelId + '">' +
      '<thead><tr>' + DAYS.map(function (name) {
        return '<th scope="col" class="date-picker__weekday" abbr="' + name + '">' + name.slice(0, 2) + '</th>';
      }).join('') + '</tr></thead>' +
      '<tbody></tbody>' +
      '</table>';
    container.appendChild(root);

    var monthEl = root.querySelector('.date-picker__month');
    var body = root.querySelector('tbody');
    var prevBtn = root.querySelector('[data-dp-step="-1"]');
    var nextBtn = root.querySelector('[data-dp-step="1"]');
    var firstMonth = new Date(range.min.getFullYear(), range.min.getMonth(), 1);
    var lastMonth = new Date(range.max.getFullYear(), range.max.getMonth(), 1);

    function draw() {
      monthEl.textContent = MONTHS[view.getMonth()] + ' ' + view.getFullYear();
      prevBtn.setAttribute('aria-disabled', view <= firstMonth ? 'true' : 'false');
      nextBtn.setAttribute('aria-disabled', view >= lastMonth ? 'true' : 'false');

      var html = '';
      var day = new Date(view);
      var lead = weekdayIndex(day);
      var cells = [];
      for (var i = 0; i < lead; i++) cells.push('<td></td>');
      while (day.getMonth() === view.getMonth()) {
        var allowed = range.allows(day);
        var cls = 'date-picker__day' +
          (sameDay(day, selected) ? ' date-picker__day--selected' : '') +
          (sameDay(day, range.today) ? ' date-picker__day--today' : '');
        cells.push('<td role="gridcell"' + (sameDay(day, selected) ? ' aria-selected="true"' : '') + '>' +
          '<button type="button" class="' + cls + '" data-dp-date="' + formatLabel(day) + '"' +
          ' tabindex="' + (sameDay(day, focusDate) ? '0' : '-1') + '"' +
          ' aria-label="' + longLabel(day) + '"' +
          (allowed ? '' : ' aria-disabled="true"') + '>' + day.getDate() + '</button></td>');
        day = addDays(day, 1);
      }
      while (cells.length % 7) cells.push('<td></td>');
      for (var r = 0; r < cells.length; r += 7) html += '<tr>' + cells.slice(r, r + 7).join('') + '</tr>';
      body.innerHTML = html;
    }

    function dayButton(d) {
      return body.querySelector('[data-dp-date="' + formatLabel(d) + '"]');
    }

    function focusDay() {
      var btn = dayButton(focusDate);
      if (btn) btn.focus();
    }

    /* Move focus within the range, redrawing when it lands in another month */
    function moveTo(d) {
      if (d < range.min) d = range.min;
      if (d > range.max) d = range.max;
      focusDate = d;
      if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()) {
        view = new Date(d.getFullYear(), d.getMonth(), 1);
      }
      draw();
      focusDay();
    }

    function stepMonth(n) {
      var target = new Date(view.getFullYear(), view.getMonth() + n, 1);
      if (target < firstMonth || target > lastMonth) return;
      view = target;
      var d = addMonths(focusDate, n);
      if (d < range.min) d = range.min;
      if (d > range.max) d = range.max;
      focusDate = d;
      draw();
    }

    prevBtn.addEventListener('click', function () { stepMonth(-1); });
    nextBtn.addEventListener('click', function () { stepMonth(1); });

    body.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-dp-date]');
      if (!btn || btn.getAttribute('aria-disabled') === 'true') return;
      var d = parseLabel(btn.getAttribute('data-dp-date'));
      if (d && typeof options.onPick === 'function') options.onPick(d);
    });

    body.addEventListener('keydown', function (e) {
      var btn = e.target.closest('[data-dp-date]');
      if (!btn) return;
      var d = parseLabel(btn.getAttribute('data-dp-date'));
      var next = null;
      switch (e.key) {
        case 'ArrowLeft': next = addDays(d, -1); break;
        case 'ArrowRight': next = addDays(d, 1); break;
        case 'ArrowUp': next = addDays(d, -7); break;
        case 'ArrowDown': next = addDays(d, 7); break;
        case 'PageUp': next = addMonths(d, -1); break;
        case 'PageDown': next = addMonths(d, 1); break;
        case 'Home': next = addDays(d, -weekdayIndex(d)); break;
        case 'End': next = addDays(d, 6 - weekdayIndex(d)); break;
        default: return;
      }
      e.preventDefault();
      moveTo(next);
    });

    draw();
    return { focusDay: focusDay };
  }

  window.UZBankDatePicker = {
    render: render,
    executionRange: executionRange,
    nextWorkingDay: nextWorkingDay,
    formatLabel: formatLabel,
    parseLabel: parseLabel,
    longLabel: longLabel
  };
})();
