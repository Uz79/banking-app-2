/**
 * Step indicator — multi-step flows (Components)
 *
 * A row of short segments under the flow title: one per step, filled up to the
 * current step (the screenshot in Motion Specimens No. 004 was the reference).
 *
 * Flows:
 *  - Payment (.modal--payment-flow, data-step): Recipient · Amount · Time schedule ·
 *    Summary → 4 segments. The recipient search before it is a pre-flow step: the
 *    indicator stays hidden there and appears (first segment filling) once a recipient
 *    has been picked.
 *  - Internal account transfer (.modal--iat-flow, data-iat-step): Amount & recipient ·
 *    Time schedule · Summary → 3 segments
 *  - Buy & sell is a single step, so it gets none.
 *
 * Motion (css/styles.css › Step indicator):
 *  - Forward: the next segment fills left → right (ease-out, like every entry).
 *  - Back: the segment you leave empties right → left, a little quicker.
 *  - First paint and re-opening the sheet: no animation, the state is simply there.
 *
 * It only watches which .modal__step is active, so the flow scripts stay untouched.
 * A document observer covers overlays that are injected from partials later.
 */
(function () {
  'use strict';

  var FLOWS = [
    {
      modal: '.modal--payment-flow',
      attr: 'data-step',
      groups: [['recipient'], ['amount'], ['schedule'], ['summary']],
      labels: ['Recipient', 'Amount', 'Time schedule', 'Summary'],
      preFlow: ['recipient-search']   // not a flow step yet: no indicator
    },
    {
      modal: '.modal--iat-flow',
      attr: 'data-iat-step',
      groups: [['recipient'], ['schedule'], ['summary']],
      labels: ['Amount & recipient', 'Time schedule', 'Summary']
    }
  ];

  function indexOf(flow, name) {
    for (var i = 0; i < flow.groups.length; i++) {
      if (flow.groups[i].indexOf(name) >= 0) return i;
    }
    return -1;
  }

  function setup(modal, flow) {
    if (modal._uzStepIndicator) return;
    var nav = modal.querySelector('.modal__nav');
    if (!nav) return;

    var el = document.createElement('div');
    el.className = 'step-indicator step-indicator--instant';
    el.setAttribute('role', 'progressbar');
    el.setAttribute('aria-valuemin', '1');
    el.setAttribute('aria-valuemax', String(flow.groups.length));
    for (var i = 0; i < flow.groups.length; i++) {
      var seg = document.createElement('span');
      seg.className = 'step-indicator__seg';
      seg.setAttribute('aria-hidden', 'true');
      el.appendChild(seg);
    }
    nav.insertAdjacentElement('afterend', el);

    var segs = el.children;
    var current = -1;
    var frame = 0;

    function update(animate) {
      var active = modal.querySelector('.modal__step--active[' + flow.attr + ']');
      if (!active) return;
      var name = active.getAttribute(flow.attr);
      if (flow.preFlow && flow.preFlow.indexOf(name) >= 0) {
        // Pre-flow: hide and empty, so the first segment fills when the flow starts.
        if (current === -1 && el.classList.contains('step-indicator--hidden')) return;
        el.classList.add('step-indicator--hidden', 'step-indicator--instant');
        for (var j = 0; j < segs.length; j++) segs[j].classList.remove('is-filled');
        current = -1;
        el.removeAttribute('aria-valuenow');
        el.removeAttribute('aria-valuetext');
        return;
      }
      var idx = indexOf(flow, name);
      if (idx < 0 || idx === current) return;

      if (el.classList.contains('step-indicator--hidden')) {
        el.classList.remove('step-indicator--hidden');
        el.offsetWidth;                                   // paint the empty row first
        if (animate) el.classList.remove('step-indicator--instant');
      }

      // Not on screen (sheet closed / reset while offscreen): jump, don't animate.
      var shell = modal.closest('.modal-shell');
      var hidden = shell && shell.classList.contains('modal-shell--offscreen');
      if (!animate || hidden) el.classList.add('step-indicator--instant');
      el.classList.toggle('step-indicator--back', idx < current);

      for (var i = 0; i < segs.length; i++) segs[i].classList.toggle('is-filled', i <= idx);
      current = idx;

      el.setAttribute('aria-valuenow', String(idx + 1));
      el.setAttribute('aria-valuetext', 'Step ' + (idx + 1) + ' of ' + segs.length + ': ' + flow.labels[idx]);

      if (el.classList.contains('step-indicator--instant')) {
        el.offsetWidth; // commit the jump before transitions come back
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { el.classList.remove('step-indicator--instant'); });
        });
      }
    }

    new MutationObserver(function (records) {
      // Ignore our own class changes, and batch the rest into one update per frame.
      var relevant = records.some(function (r) { return !el.contains(r.target); });
      if (!relevant || frame) return;
      frame = requestAnimationFrame(function () { frame = 0; update(true); });
    }).observe(modal, { subtree: true, attributes: true, attributeFilter: ['class'] });

    modal._uzStepIndicator = el;
    update(false);
  }

  function scan(root) {
    FLOWS.forEach(function (flow) {
      if (root.matches && root.matches(flow.modal)) setup(root, flow);
      if (root.querySelectorAll) {
        root.querySelectorAll(flow.modal).forEach(function (m) { setup(m, flow); });
      }
    });
  }

  function start() {
    scan(document);
    new MutationObserver(function (records) {
      records.forEach(function (r) {
        r.addedNodes.forEach(function (n) { if (n.nodeType === 1) scan(n); });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
