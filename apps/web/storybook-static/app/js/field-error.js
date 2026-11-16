/**
 * Field errors (roadmap 54): the form-field error state, as the admin sign-in has it.
 *
 * show(field, input, message): outlines the field, writes the message with the alert icon in the row under the
 * control and marks the input invalid; clear(field, input) undoes it. The row is made once per field, hidden while
 * there is no error, and read politely when it appears (D11).
 */
(function () {
  'use strict';

  var count = 0;

  function rowOf(field, input) {
    var row = field.querySelector(':scope > .form-field__error-row');
    if (row) return row;
    row = document.createElement('p');
    row.className = 'form-field__error-row';
    row.id = (input.id || 'uz-field-' + (++count)) + '-error';
    row.setAttribute('aria-live', 'polite');
    row.hidden = true;
    /* In the info row's place, which hides while the error shows (D3) */
    var info = field.querySelector(':scope > .form-field__optional-row');
    field.insertBefore(row, info || null);
    return row;
  }

  function describe(input, id, on) {
    var ids = (input.getAttribute('aria-describedby') || '').split(/\s+/).filter(function (t) {
      return t && t !== id;
    });
    if (on) ids.push(id);
    if (ids.length) input.setAttribute('aria-describedby', ids.join(' '));
    else input.removeAttribute('aria-describedby');
  }

  function show(field, input, message) {
    if (!field || !input) return;
    var row = rowOf(field, input);
    field.classList.add('form-field--error');
    input.setAttribute('aria-invalid', 'true');
    describe(input, row.id, true);
    if (row.hidden || row.textContent !== message) {
      row.innerHTML = '<svg width="16" height="16" aria-hidden="true" focusable="false" style="fill:none"><use href="#i-alert-triangle"/></svg><span></span>';
      row.lastChild.textContent = message;
    }
    row.hidden = false;
  }

  function clear(field, input) {
    if (!field) return;
    field.classList.remove('form-field--error');
    var row = field.querySelector(':scope > .form-field__error-row');
    if (input) {
      input.removeAttribute('aria-invalid');
      if (row) describe(input, row.id, false);
    }
    if (row) {
      row.hidden = true;
      row.textContent = '';
    }
  }

  function isShown(field) {
    return !!field && field.classList.contains('form-field--error');
  }

  window.UZBankFieldError = { show: show, clear: clear, isShown: isShown };
})();
