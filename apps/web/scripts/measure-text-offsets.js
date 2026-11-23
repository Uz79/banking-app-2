/**
 * Size check for native text trim (roadmap 86, D6, D7). Paste into the browser console on a page, or run through the
 * browser tool. For each pair [edge selector, text selector] it reports, in px, the distance from the edge element's
 * top to the text's cap top, and from the text's baseline to the edge element's bottom, for the first and last line.
 * Compare with `specs/2026-11-23-native-text-trim/targets.md`.
 *
 *   uzMeasureTextOffsets([['.status-message', '.status-message__title']])
 *   uzMeasureTextOffsets(pairs, { expect: { '.status-message .status-message__title': [16, null] } })
 *
 * A trimmed element (`text-box-trim` is not `none`) has its box on the cap top and the baseline. An untrimmed one is
 * worked out from the font's own metrics (a canvas measure of the loaded face), which is what the browser would trim.
 */
(function () {
  function metricsFor(cs) {
    var c = document.createElement('canvas').getContext('2d');
    c.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
    var m = c.measureText('H');
    var cap = m.actualBoundingBoxAscent;
    var asc = m.fontBoundingBoxAscent;
    var desc = m.fontBoundingBoxDescent;
    return { cap: cap, asc: asc, desc: desc };
  }

  function offsets(edgeSel, textSel) {
    var edge = document.querySelector(edgeSel);
    var el = edge && edge.querySelector(textSel) || document.querySelector(textSel);
    if (!edge || !el) return { edge: edgeSel, text: textSel, error: 'not found' };
    var cs = getComputedStyle(el);
    var er = edge.getBoundingClientRect();
    var rr = el.getBoundingClientRect();
    var trimmed = cs.textBoxTrim && cs.textBoxTrim !== 'none';
    var capTop;
    var baseline;
    if (trimmed) {
      capTop = rr.top;
      baseline = rr.bottom;
    } else {
      var m = metricsFor(cs);
      var lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
      var firstTop = rr.top + parseFloat(cs.paddingTop);
      var lastBottom = rr.bottom - parseFloat(cs.paddingBottom);
      var hl = (lh - (m.asc + m.desc)) / 2;
      capTop = firstTop + hl + (m.asc - m.cap);
      baseline = lastBottom - hl - m.desc;
    }
    return {
      edge: edgeSel,
      text: textSel,
      trimmed: !!trimmed,
      capTop: +(capTop - er.top).toFixed(2),
      baselineToBottom: +(er.bottom - baseline).toFixed(2),
    };
  }

  window.uzMeasureTextOffsets = function (pairs, options) {
    var expect = (options && options.expect) || {};
    return pairs.map(function (p) {
      var o = offsets(p[0], p[1]);
      var want = expect[p[0] + ' ' + p[1]];
      if (want && !o.error) {
        o.expectCapTop = want[0];
        o.expectBaselineToBottom = want[1];
        o.diffCapTop = want[0] == null ? null : +(o.capTop - want[0]).toFixed(2);
        o.diffBaseline = want[1] == null ? null : +(o.baselineToBottom - want[1]).toFixed(2);
        o.ok = (o.diffCapTop == null || Math.abs(o.diffCapTop) <= 1) && (o.diffBaseline == null || Math.abs(o.diffBaseline) <= 1);
      }
      return o;
    });
  };
})();
