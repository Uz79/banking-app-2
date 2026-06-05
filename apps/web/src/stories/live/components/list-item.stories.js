export default {
  title: 'Live/Components/List item',
  parameters: {
    docs: {
      description: {
        component: 'Hover and press list rows to preview the state overlay (Tier A surfaces).',
      },
    },
  },
};

export const InteractiveStateLayer = {
  name: 'State layer (hover / press)',
  render: () => `
    <div style="padding:1.5rem;max-width:28rem;display:flex;flex-direction:column;gap:0;">
      <p style="margin:0 0 1rem;font:var(--font-family);font-size:0.875rem;color:var(--color-fg-muted);">
        Pointer over each row — background uses the container + ::before overlay, not a flat fill.
      </p>
      <div class="list-item">
        <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-shield"/></svg>
        <div class="list-item__content">
          <span class="list-item__title">Accounts</span>
          <span class="list-item__subtitle">Private &amp; saving accounts</span>
        </div>
        <svg class="list-item__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-right"/></svg>
      </div>
      <div class="divider"></div>
      <div class="list-item list-item--group-account">
        <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-home"/></svg>
        <div class="list-item__content">
          <span class="list-item__title">Household</span>
          <span class="list-item__subtitle">CH35 0900 0000 2470 2920 1</span>
        </div>
        <span class="list-item__amount">
          <span class="list-item__currency">CHF</span>
          <span class="list-item__value">10'000.00</span>
        </span>
      </div>
      <div class="divider"></div>
      <div class="booking-row">
        <svg class="booking-row__icon" aria-hidden="true" focusable="false"><use href="#i-corner-up-right"/></svg>
        <span class="booking-row__name">Apple</span>
        <span class="booking-row__amount">
          <span class="booking-row__currency">CHF</span>
          <span class="booking-row__value">-100.00</span>
        </span>
      </div>
      <div class="product-item">
        <svg class="product-item__icon" aria-hidden="true" focusable="false"><use href="#i-home"/></svg>
        <div class="product-item__info">
          <span class="product-item__name">Household</span>
          <span class="product-item__iban">CH35 0900 0000 2470 2920 1</span>
        </div>
        <span class="product-item__amount">
          <span class="product-item__currency">CHF</span>
          <span class="product-item__value">10'570.00</span>
        </span>
      </div>
    </div>
  `,
};
