/** Read a custom property from :root (resolved value, e.g. "16px"). */
export function readRootCssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Padding / gap / height from a row element (computed pixels). */
export function readRowMetrics(el) {
  if (!el) return null;
  const cs = getComputedStyle(el);
  return {
    paddingTop: cs.paddingTop,
    paddingBottom: cs.paddingBottom,
    paddingLeft: cs.paddingLeft,
    paddingRight: cs.paddingRight,
    gap: cs.gap,
    height: cs.height,
  };
}

/** Fill <dd data-probe-dd="key"> nodes inside a probe block. */
export function fillProbeValues(root, values) {
  for (const [key, value] of Object.entries(values)) {
    const dd = root.querySelector(`[data-probe-dd="${key}"]`);
    if (dd) dd.textContent = value;
  }
}
