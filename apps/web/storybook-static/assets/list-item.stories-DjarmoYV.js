import{n as e}from"./chunk-DnJy8xQt.js";var t,n,r,i,a,o,s,c,l;e((()=>{t={title:`Live/Components/List item`,parameters:{layout:`padded`,docs:{description:{component:"Interactive list rows using the Figma state-layer pattern (`::before` overlay). Hover rows to compare tint on white vs transparent containers."}}}},n=e=>`
  <div style="max-width:28rem;display:flex;flex-direction:column;gap:var(--space-4);">
    ${e}
  </div>
`,r={name:`Group account (carousel card)`,render:()=>n(`
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
  `)},i={name:`Group account (static / readonly)`,render:()=>n(`
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
  `)},a={name:`Product item`,render:()=>n(`
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
  `)},o={name:`Booking row`,render:()=>n(`
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
  `)},s={name:`Row with chevron`,render:()=>n(`
    <div class="list-item">
      <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-shield"/></svg>
      <div class="list-item__content type-stack-tight">
        <span class="list-item__title type-sm type-trim">Accounts</span>
        <span class="list-item__subtitle type-xs type-trim">Private &amp; saving accounts</span>
      </div>
      <svg class="list-item__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-right"/></svg>
    </div>
  `)},c={name:`State layer — side by side`,render:()=>`
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
  `},r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: 'Group account (carousel card)',
  render: () => wrap(\`
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
  \`)
}`,...r.parameters?.docs?.source}}},i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: 'Group account (static / readonly)',
  render: () => wrap(\`
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
  \`)
}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  name: 'Product item',
  render: () => wrap(\`
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
  \`)
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: 'Booking row',
  render: () => wrap(\`
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
  \`)
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: 'Row with chevron',
  render: () => wrap(\`
    <div class="list-item">
      <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-shield"/></svg>
      <div class="list-item__content type-stack-tight">
        <span class="list-item__title type-sm type-trim">Accounts</span>
        <span class="list-item__subtitle type-xs type-trim">Private &amp; saving accounts</span>
      </div>
      <svg class="list-item__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-right"/></svg>
    </div>
  \`)
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: 'State layer — side by side',
  render: () => \`
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
  \`
}`,...c.parameters?.docs?.source}}},l=[`GroupAccountInteractive`,`GroupAccountStatic`,`ProductItem`,`BookingRow`,`RowWithChevron`,`StateLayerComparison`]}))();export{o as BookingRow,r as GroupAccountInteractive,i as GroupAccountStatic,a as ProductItem,s as RowWithChevron,c as StateLayerComparison,l as __namedExportsOrder,t as default};