import { fillProbeValues, readRootCssVar, readRowMetrics } from '../../utils/css-var-probe.js';

export default {
  title: 'Live/Components/List item',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Interactive list rows using the Figma state-layer pattern (`::before` overlay). Hover rows to compare tint on white vs transparent containers.',
      },
    },
  },
};

const wrap = (inner) => `
  <div style="max-width:28rem;display:flex;flex-direction:column;gap:var(--space-4);">
    ${inner}
  </div>
`;

export const GroupAccountInteractive = {
  name: 'Group account (carousel card)',
  render: () => wrap(`
    <p style="margin:0;font-size:var(--fs-text-sm);color:var(--color-fg-secondary);">
      White container — hover should show a 10% foreground tint without replacing the card fill.
    </p>
    <article class="list-item list-item--group-account" aria-label="Savings account">
      <div class="list-item__media">
        <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-anchor"/></svg>
      </div>
      <div class="list-item__body type-stack-tight">
        <span class="list-item__title type-sm type-trim">Savings account</span>
        <span class="list-item__subtitle type-xs type-trim">CH35 0900 0000 2470 2920 2</span>
      </div>
      <div class="list-item__end">
        <span class="list-item__currency type-xs">CHF</span>
        <span class="list-item__value type-sm type-bold">25'000.00</span>
      </div>
    </article>
  `),
};

export const GroupAccountStatic = {
  name: 'Group account (static / readonly)',
  render: () => wrap(`
    <article class="list-item list-item--group-account list-item--static" aria-label="Summary card">
      <div class="list-item__media">
        <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-home"/></svg>
      </div>
      <div class="list-item__body type-stack-tight">
        <span class="list-item__title type-sm type-trim">Household</span>
        <span class="list-item__subtitle type-xs type-trim">CH35 0900 0000 2470 2920 1</span>
      </div>
      <div class="list-item__end">
        <span class="list-item__currency type-xs">CHF</span>
        <span class="list-item__value type-sm type-bold">10'000.00</span>
      </div>
    </article>
  `),
};

export const ListRowSpacing = {
  name: 'List row spacing (derived from tokens)',
  render: () => `
    <div data-probe="list-row-spacing" style="max-width:28rem;display:flex;flex-direction:column;gap:var(--space-4);">
      <p style="margin:0;font-size:var(--fs-text-sm);color:var(--color-fg-secondary);">
        Figma grouped/wealth account rows: 56dp hug height, space/3 (16dp) vertical padding.
        CSS uses <code>--list-row-pad-y</code> / <code>--list-row-pad-x</code> / <code>--list-row-gap</code>.
      </p>
      <a class="product-item" data-probe-row="product" href="#">
        <svg class="product-item__icon" aria-hidden="true" focusable="false"><use href="#i-home"/></svg>
        <div class="product-item__info type-stack-tight">
          <span class="product-item__name type-sm type-trim">Household</span>
          <span class="product-item__iban type-xs type-trim">CH35 0900 0000 2470 2920 1</span>
        </div>
        <span class="product-item__amount">
          <span class="product-item__currency">CHF</span>
          <span class="product-item__value">10'000.00</span>
        </span>
      </a>
      <article class="list-item list-item--group-account" data-probe-row="group" aria-label="Savings account">
        <div class="list-item__media">
          <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-anchor"/></svg>
        </div>
        <div class="list-item__body type-stack-tight">
          <span class="list-item__title type-sm type-trim">Savings account</span>
          <span class="list-item__subtitle type-xs type-trim">CH35 0900 0000 2470 2920 2</span>
        </div>
        <div class="list-item__end">
          <span class="list-item__currency type-xs">CHF</span>
          <span class="list-item__value type-sm type-bold">25'000.00</span>
        </div>
      </article>
      <dl style="margin:0;font-size:var(--fs-text-sm);line-height:var(--lh-text);display:grid;grid-template-columns:auto 1fr;gap:var(--space-2) var(--space-4);">
        <dt style="color:var(--color-fg-secondary);">Token --list-row-pad-y</dt>
        <dd data-probe-dd="token-pad-y" style="margin:0;font-family:monospace;">…</dd>
        <dt style="color:var(--color-fg-secondary);">.product-item padding-block</dt>
        <dd data-probe-dd="product-pad-block" style="margin:0;font-family:monospace;">…</dd>
        <dt style="color:var(--color-fg-secondary);">.product-item height</dt>
        <dd data-probe-dd="product-height" style="margin:0;font-family:monospace;">…</dd>
        <dt style="color:var(--color-fg-secondary);">.list-item--group-account padding-block</dt>
        <dd data-probe-dd="group-pad-block" style="margin:0;font-family:monospace;">…</dd>
        <dt style="color:var(--color-fg-secondary);">.list-item--group-account height</dt>
        <dd data-probe-dd="group-height" style="margin:0;font-family:monospace;">…</dd>
        <dt style="color:var(--color-fg-secondary);">Figma target height</dt>
        <dd style="margin:0;font-family:monospace;">56px</dd>
      </dl>
    </div>
  `,
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-probe="list-row-spacing"]');
    const product = root?.querySelector('[data-probe-row="product"]');
    const group = root?.querySelector('[data-probe-row="group"]');
    const productM = readRowMetrics(product);
    const groupM = readRowMetrics(group);
    const padY = readRootCssVar('--list-row-pad-y');
    fillProbeValues(root, {
      'token-pad-y': padY,
      'product-pad-block': productM ? `${productM.paddingTop} / ${productM.paddingBottom}` : '—',
      'product-height': productM?.height ?? '—',
      'group-pad-block': groupM ? `${groupM.paddingTop} / ${groupM.paddingBottom}` : '—',
      'group-height': groupM?.height ?? '—',
    });
  },
};

export const ProductItem = {
  name: 'Product item',
  render: () => wrap(`
    <div style="padding:var(--space-2);border-radius:var(--radius-regular);background:var(--color-bg);border:1px solid var(--color-separator);">
      <a class="product-item" href="#">
        <svg class="product-item__icon" aria-hidden="true" focusable="false"><use href="#i-home"/></svg>
        <div class="product-item__info type-stack-tight">
          <span class="product-item__name type-sm type-trim">Household</span>
          <span class="product-item__iban type-xs type-trim">CH35 0900 0000 2470 2920 1</span>
        </div>
        <span class="product-item__amount">
          <span class="product-item__currency">CHF</span>
          <span class="product-item__value">10'000.00</span>
        </span>
      </a>
    </div>
  `),
};

export const BookingRow = {
  name: 'Booking row',
  render: () => wrap(`
    <div class="bookings-card" style="padding:var(--space-2) 0;">
      <div class="booking-row">
        <svg class="booking-row__icon" aria-hidden="true" focusable="false"><use href="#i-corner-up-right"/></svg>
        <span class="booking-row__name">Apple</span>
        <span class="booking-row__amount">
          <span class="booking-row__currency">CHF</span>
          <span class="booking-row__value">-100.00</span>
        </span>
      </div>
      <div class="booking-row">
        <svg class="booking-row__icon" aria-hidden="true" focusable="false"><use href="#i-repeat"/></svg>
        <span class="booking-row__name">Transfer to Savings Account</span>
        <span class="booking-row__amount">
          <span class="booking-row__currency">CHF</span>
          <span class="booking-row__value">-500.00</span>
        </span>
      </div>
    </div>
  `),
};

export const RowWithChevron = {
  name: 'Row with chevron',
  render: () => wrap(`
    <div class="list-item">
      <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-shield"/></svg>
      <div class="list-item__content type-stack-tight">
        <span class="list-item__title type-sm type-trim">Accounts</span>
        <span class="list-item__subtitle type-xs type-trim">Private &amp; saving accounts</span>
      </div>
      <svg class="list-item__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-right"/></svg>
    </div>
  `),
};

export const StateLayerComparison = {
  name: 'State layer — side by side',
  render: () => `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(16rem,1fr));gap:var(--space-4);max-width:56rem;">
      <div>
        <p style="margin:0 0 var(--space-2);font-size:var(--fs-text-xs);color:var(--color-fg-secondary);">On white (bookings card)</p>
        <div class="bookings-card" style="padding:var(--space-2) 0;">
          <div class="booking-row"><svg class="booking-row__icon" aria-hidden="true" focusable="false"><use href="#i-corner-up-right"/></svg><span class="booking-row__name">Booking row</span><span class="booking-row__amount"><span class="booking-row__currency">CHF</span><span class="booking-row__value">-10.00</span></span></div>
        </div>
      </div>
      <div>
        <p style="margin:0 0 var(--space-2);font-size:var(--fs-text-xs);color:var(--color-fg-secondary);">On white card (group account)</p>
        <article class="list-item list-item--group-account" aria-label="Compare">
          <div class="list-item__media"><svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-anchor"/></svg></div>
          <div class="list-item__body type-stack-tight"><span class="list-item__title type-sm type-trim">Savings</span><span class="list-item__subtitle type-xs type-trim">IBAN</span></div>
          <div class="list-item__end"><span class="list-item__currency type-xs">CHF</span><span class="list-item__value type-sm type-bold">25'000.00</span></div>
        </article>
      </div>
    </div>
    <p style="margin:var(--space-3) 0 0;font-size:var(--fs-text-sm);color:var(--color-fg-secondary);max-width:40rem;">
      Hover each row — the tint should match (same <code>--color-surface-state-hover</code> overlay).
    </p>
  `,
};
