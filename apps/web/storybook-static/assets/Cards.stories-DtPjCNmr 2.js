import{n as e}from"./chunk-DnJy8xQt.js";var t,n,r,i,a,o,s,c,l,u,d,f,p;e((()=>{t={title:`Components/Card`},n={name:`Product Item — configurable (use Controls ↓)`,args:{name:`Household`,iban:`CH35 0900 0000 2470 2920 1`,currency:`CHF`,amount:`10'570.00`},argTypes:{name:{control:`text`,description:`Account name`},iban:{control:`text`,description:`IBAN / account number`},currency:{control:`radio`,options:[`CHF`,`USD`,`EUR`],description:`Currency code`},amount:{control:`text`,description:`Formatted balance`}},render:({name:e,iban:t,currency:n,amount:r})=>`
    <div style="padding:1rem;max-width:28rem;">
      <a class="product-item" href="#">
        <svg class="product-item__icon" aria-hidden="true" focusable="false"><use href="#i-home"/></svg>
        <div class="product-item__info type-stack-tight">
          <span class="product-item__name type-sm type-trim">${e}</span>
          <span class="product-item__iban type-xs type-trim">${t}</span>
        </div>
        <span class="product-item__amount">
          <span class="product-item__currency">${n}</span>
          <span class="product-item__value">${r}</span>
        </span>
      </a>
    </div>
  `},r={name:`Section Card — configurable (use Controls ↓)`,args:{title:`Accounts & investment`,showTotal:!0,totalCurrency:`CHF`,totalAmount:`65'570.00`},argTypes:{title:{control:`text`,description:`Card title`},showTotal:{control:`boolean`,description:`Show total in header`},totalCurrency:{control:`radio`,options:[`CHF`,`USD`,`EUR`],description:`Total currency`},totalAmount:{control:`text`,description:`Total formatted amount`}},render:({title:e,showTotal:t,totalCurrency:n,totalAmount:r})=>`
    <div style="padding:1rem;max-width:28rem;">
      <div class="section-card">
        <div class="section-card__header">
          <span class="section-card__title">${e}</span>
          ${t?`<span class="section-card__amount">
            <span class="section-card__currency">${n}</span>
            <span class="section-card__value">${r}</span>
          </span>`:``}
        </div>
        <div class="section-card__body">
          <a class="product-item" href="#">
            <svg class="product-item__icon" aria-hidden="true" focusable="false"><use href="#i-home"/></svg>
            <div class="product-item__info type-stack-tight">
              <span class="product-item__name type-sm type-trim">Household</span>
              <span class="product-item__iban type-xs type-trim">CH35 0900 0000 2470 2920 1</span>
            </div>
            <span class="product-item__amount">
              <span class="product-item__currency">${n}</span>
              <span class="product-item__value">10'570.00</span>
            </span>
          </a>
        </div>
      </div>
    </div>
  `},i={name:`Section Card — Accounts & Investment`,render:()=>`
    <div style="padding:1rem;max-width:28rem;">
      <div class="section-card">
        <div class="section-card__header">
          <span class="section-card__title">Accounts &amp; investment</span>
          <span class="section-card__amount">
            <span class="section-card__currency">CHF</span>
            <span class="section-card__value">65'570.00</span>
          </span>
        </div>
        <div class="section-card__body">
          <a class="product-item" href="#" data-account="household">
            <svg class="product-item__icon" aria-hidden="true" focusable="false"><use href="#i-home"/></svg>
            <div class="product-item__info type-stack-tight">
              <span class="product-item__name type-sm type-trim">Household</span>
              <span class="product-item__iban type-xs type-trim">CH35 0900 0000 2470 2920 1</span>
            </div>
            <span class="product-item__amount">
              <span class="product-item__currency">CHF</span>
              <span class="product-item__value">10'570.00</span>
            </span>
          </a>
          <a class="product-item" href="#" data-account="savings">
            <svg class="product-item__icon" aria-hidden="true" focusable="false"><use href="#i-shield"/></svg>
            <div class="product-item__info type-stack-tight">
              <span class="product-item__name type-sm type-trim">Savings account</span>
              <span class="product-item__iban type-xs type-trim">CH35 0900 0000 2470 2920 2</span>
            </div>
            <span class="product-item__amount">
              <span class="product-item__currency">CHF</span>
              <span class="product-item__value">25'000.00</span>
            </span>
          </a>
          <a class="product-item" href="#" data-account="deposit">
            <svg class="product-item__icon" aria-hidden="true" focusable="false"><use href="#i-clock"/></svg>
            <div class="product-item__info type-stack-tight">
              <span class="product-item__name type-sm type-trim">Deposit</span>
              <span class="product-item__iban type-xs type-trim">123.456.78</span>
            </div>
            <span class="product-item__amount">
              <span class="product-item__currency">CHF</span>
              <span class="product-item__value">20'000.00</span>
            </span>
          </a>
          <a class="product-item" href="#" data-account="retirement">
            <svg class="product-item__icon" aria-hidden="true" focusable="false"><use href="#i-trending-up"/></svg>
            <div class="product-item__info type-stack-tight">
              <span class="product-item__name type-sm type-trim">Retirement savings 3a</span>
              <span class="product-item__iban type-xs type-trim">7740205-08</span>
            </div>
            <span class="product-item__amount">
              <span class="product-item__currency">CHF</span>
              <span class="product-item__value">10'000.00</span>
            </span>
          </a>
        </div>
      </div>
    </div>
  `},a={name:`Product Item — single (account)`,render:()=>`
    <div style="padding:1rem;max-width:28rem;">
      <a class="product-item" href="#">
        <svg class="product-item__icon" aria-hidden="true" focusable="false"><use href="#i-home"/></svg>
        <div class="product-item__info type-stack-tight">
          <span class="product-item__name type-sm type-trim">Household</span>
          <span class="product-item__iban type-xs type-trim">CH35 0900 0000 2470 2920 1</span>
        </div>
        <span class="product-item__amount">
          <span class="product-item__currency">CHF</span>
          <span class="product-item__value">10'570.00</span>
        </span>
      </a>
    </div>
  `},o={name:`Section Card — Other Products`,render:()=>`
    <div style="padding:1rem;max-width:28rem;">
      <div class="section-card">
        <div class="section-card__header">
          <span class="section-card__title">Other products</span>
        </div>
        <div class="section-card__body">
          <div class="list-item">
            <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-credit-card"/></svg>
            <div class="list-item__content type-stack-tight">
              <span class="list-item__title type-sm type-trim">VISA Gold</span>
              <span class="list-item__subtitle type-xs type-trim">available CHF 4'700.00</span>
            </div>
            <span class="list-item__amount">
              <span class="list-item__currency type-xs">Limit CHF</span>
              <span class="list-item__value type-sm type-bold">5'000.00</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  `},s={name:`List Item — group account`,render:()=>`
    <div style="padding:1rem;max-width:28rem;">
      <article class="list-item list-item--group-account list-item--static" aria-label="Savings account">
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
    </div>
  `},c={name:`List Item — with amount (credit card)`,render:()=>`
    <div style="padding:1rem;max-width:28rem;">
      <div class="list-item">
        <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-credit-card"/></svg>
        <div class="list-item__content type-stack-tight">
          <span class="list-item__title type-sm type-trim">VISA Gold</span>
          <span class="list-item__subtitle type-xs type-trim">available CHF 4'700.00</span>
        </div>
        <span class="list-item__amount">
          <span class="list-item__currency type-xs">Limit CHF</span>
          <span class="list-item__value type-sm type-bold">5'000.00</span>
        </span>
      </div>
    </div>
  `},l={name:`List Item — with chevron (offer)`,render:()=>`
    <div style="padding:1rem;max-width:28rem;">
      <div class="list-item">
        <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-shield"/></svg>
        <div class="list-item__content type-stack-tight">
          <span class="list-item__title type-sm type-trim">Accounts</span>
          <span class="list-item__subtitle type-xs type-trim">Private &amp; saving accounts</span>
        </div>
        <svg class="list-item__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-right"/></svg>
      </div>
    </div>
  `},u={name:`Section Card — Offers`,render:()=>`
    <div style="padding:1rem;max-width:28rem;">
      <div class="section-card">
        <div class="section-card__header">
          <span class="section-card__title">Offers</span>
        </div>
        <div class="section-card__body">
          <div class="list-item">
            <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-shield"/></svg>
            <div class="list-item__content type-stack-tight">
              <span class="list-item__title type-sm type-trim">Accounts</span>
              <span class="list-item__subtitle type-xs type-trim">Private &amp; saving accounts</span>
            </div>
            <svg class="list-item__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-right"/></svg>
          </div>
          <div class="list-item">
            <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-credit-card"/></svg>
            <div class="list-item__content type-stack-tight">
              <span class="list-item__title type-sm type-trim">Cards</span>
              <span class="list-item__subtitle type-xs type-trim">Order NEW cards, monitor</span>
            </div>
            <svg class="list-item__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-right"/></svg>
          </div>
          <div class="list-item">
            <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-trending-up"/></svg>
            <div class="list-item__content type-stack-tight">
              <span class="list-item__title type-sm type-trim">Investment</span>
              <span class="list-item__subtitle type-xs type-trim">Fonds, trading, asset management</span>
            </div>
            <svg class="list-item__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-right"/></svg>
          </div>
        </div>
      </div>
    </div>
  `},d={name:`Section Card Header — with total`,render:()=>`
    <div style="padding:1rem;max-width:28rem;">
      <div class="section-card">
        <div class="section-card__header">
          <span class="section-card__title">Accounts &amp; investment</span>
          <span class="section-card__amount">
            <span class="section-card__currency">CHF</span>
            <span class="section-card__value">65'570.00</span>
          </span>
        </div>
      </div>
    </div>
  `},f={name:`Section Card Header — title only`,render:()=>`
    <div style="padding:1rem;max-width:28rem;">
      <div class="section-card">
        <div class="section-card__header">
          <span class="section-card__title">Other products</span>
        </div>
      </div>
    </div>
  `},n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: 'Product Item — configurable (use Controls ↓)',
  args: {
    name: 'Household',
    iban: 'CH35 0900 0000 2470 2920 1',
    currency: 'CHF',
    amount: "10'570.00"
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'Account name'
    },
    iban: {
      control: 'text',
      description: 'IBAN / account number'
    },
    currency: {
      control: 'radio',
      options: ['CHF', 'USD', 'EUR'],
      description: 'Currency code'
    },
    amount: {
      control: 'text',
      description: 'Formatted balance'
    }
  },
  render: ({
    name,
    iban,
    currency,
    amount
  }) => \`
    <div style="padding:1rem;max-width:28rem;">
      <a class="product-item" href="#">
        <svg class="product-item__icon" aria-hidden="true" focusable="false"><use href="#i-home"/></svg>
        <div class="product-item__info type-stack-tight">
          <span class="product-item__name type-sm type-trim">\${name}</span>
          <span class="product-item__iban type-xs type-trim">\${iban}</span>
        </div>
        <span class="product-item__amount">
          <span class="product-item__currency">\${currency}</span>
          <span class="product-item__value">\${amount}</span>
        </span>
      </a>
    </div>
  \`
}`,...n.parameters?.docs?.source}}},r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: 'Section Card — configurable (use Controls ↓)',
  args: {
    title: 'Accounts & investment',
    showTotal: true,
    totalCurrency: 'CHF',
    totalAmount: "65'570.00"
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Card title'
    },
    showTotal: {
      control: 'boolean',
      description: 'Show total in header'
    },
    totalCurrency: {
      control: 'radio',
      options: ['CHF', 'USD', 'EUR'],
      description: 'Total currency'
    },
    totalAmount: {
      control: 'text',
      description: 'Total formatted amount'
    }
  },
  render: ({
    title,
    showTotal,
    totalCurrency,
    totalAmount
  }) => \`
    <div style="padding:1rem;max-width:28rem;">
      <div class="section-card">
        <div class="section-card__header">
          <span class="section-card__title">\${title}</span>
          \${showTotal ? \`<span class="section-card__amount">
            <span class="section-card__currency">\${totalCurrency}</span>
            <span class="section-card__value">\${totalAmount}</span>
          </span>\` : ''}
        </div>
        <div class="section-card__body">
          <a class="product-item" href="#">
            <svg class="product-item__icon" aria-hidden="true" focusable="false"><use href="#i-home"/></svg>
            <div class="product-item__info type-stack-tight">
              <span class="product-item__name type-sm type-trim">Household</span>
              <span class="product-item__iban type-xs type-trim">CH35 0900 0000 2470 2920 1</span>
            </div>
            <span class="product-item__amount">
              <span class="product-item__currency">\${totalCurrency}</span>
              <span class="product-item__value">10'570.00</span>
            </span>
          </a>
        </div>
      </div>
    </div>
  \`
}`,...r.parameters?.docs?.source}}},i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: 'Section Card — Accounts & Investment',
  render: () => \`
    <div style="padding:1rem;max-width:28rem;">
      <div class="section-card">
        <div class="section-card__header">
          <span class="section-card__title">Accounts &amp; investment</span>
          <span class="section-card__amount">
            <span class="section-card__currency">CHF</span>
            <span class="section-card__value">65'570.00</span>
          </span>
        </div>
        <div class="section-card__body">
          <a class="product-item" href="#" data-account="household">
            <svg class="product-item__icon" aria-hidden="true" focusable="false"><use href="#i-home"/></svg>
            <div class="product-item__info type-stack-tight">
              <span class="product-item__name type-sm type-trim">Household</span>
              <span class="product-item__iban type-xs type-trim">CH35 0900 0000 2470 2920 1</span>
            </div>
            <span class="product-item__amount">
              <span class="product-item__currency">CHF</span>
              <span class="product-item__value">10'570.00</span>
            </span>
          </a>
          <a class="product-item" href="#" data-account="savings">
            <svg class="product-item__icon" aria-hidden="true" focusable="false"><use href="#i-shield"/></svg>
            <div class="product-item__info type-stack-tight">
              <span class="product-item__name type-sm type-trim">Savings account</span>
              <span class="product-item__iban type-xs type-trim">CH35 0900 0000 2470 2920 2</span>
            </div>
            <span class="product-item__amount">
              <span class="product-item__currency">CHF</span>
              <span class="product-item__value">25'000.00</span>
            </span>
          </a>
          <a class="product-item" href="#" data-account="deposit">
            <svg class="product-item__icon" aria-hidden="true" focusable="false"><use href="#i-clock"/></svg>
            <div class="product-item__info type-stack-tight">
              <span class="product-item__name type-sm type-trim">Deposit</span>
              <span class="product-item__iban type-xs type-trim">123.456.78</span>
            </div>
            <span class="product-item__amount">
              <span class="product-item__currency">CHF</span>
              <span class="product-item__value">20'000.00</span>
            </span>
          </a>
          <a class="product-item" href="#" data-account="retirement">
            <svg class="product-item__icon" aria-hidden="true" focusable="false"><use href="#i-trending-up"/></svg>
            <div class="product-item__info type-stack-tight">
              <span class="product-item__name type-sm type-trim">Retirement savings 3a</span>
              <span class="product-item__iban type-xs type-trim">7740205-08</span>
            </div>
            <span class="product-item__amount">
              <span class="product-item__currency">CHF</span>
              <span class="product-item__value">10'000.00</span>
            </span>
          </a>
        </div>
      </div>
    </div>
  \`
}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  name: 'Product Item — single (account)',
  render: () => \`
    <div style="padding:1rem;max-width:28rem;">
      <a class="product-item" href="#">
        <svg class="product-item__icon" aria-hidden="true" focusable="false"><use href="#i-home"/></svg>
        <div class="product-item__info type-stack-tight">
          <span class="product-item__name type-sm type-trim">Household</span>
          <span class="product-item__iban type-xs type-trim">CH35 0900 0000 2470 2920 1</span>
        </div>
        <span class="product-item__amount">
          <span class="product-item__currency">CHF</span>
          <span class="product-item__value">10'570.00</span>
        </span>
      </a>
    </div>
  \`
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: 'Section Card — Other Products',
  render: () => \`
    <div style="padding:1rem;max-width:28rem;">
      <div class="section-card">
        <div class="section-card__header">
          <span class="section-card__title">Other products</span>
        </div>
        <div class="section-card__body">
          <div class="list-item">
            <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-credit-card"/></svg>
            <div class="list-item__content type-stack-tight">
              <span class="list-item__title type-sm type-trim">VISA Gold</span>
              <span class="list-item__subtitle type-xs type-trim">available CHF 4'700.00</span>
            </div>
            <span class="list-item__amount">
              <span class="list-item__currency type-xs">Limit CHF</span>
              <span class="list-item__value type-sm type-bold">5'000.00</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  \`
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: 'List Item — group account',
  render: () => \`
    <div style="padding:1rem;max-width:28rem;">
      <article class="list-item list-item--group-account list-item--static" aria-label="Savings account">
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
    </div>
  \`
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: 'List Item — with amount (credit card)',
  render: () => \`
    <div style="padding:1rem;max-width:28rem;">
      <div class="list-item">
        <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-credit-card"/></svg>
        <div class="list-item__content type-stack-tight">
          <span class="list-item__title type-sm type-trim">VISA Gold</span>
          <span class="list-item__subtitle type-xs type-trim">available CHF 4'700.00</span>
        </div>
        <span class="list-item__amount">
          <span class="list-item__currency type-xs">Limit CHF</span>
          <span class="list-item__value type-sm type-bold">5'000.00</span>
        </span>
      </div>
    </div>
  \`
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: 'List Item — with chevron (offer)',
  render: () => \`
    <div style="padding:1rem;max-width:28rem;">
      <div class="list-item">
        <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-shield"/></svg>
        <div class="list-item__content type-stack-tight">
          <span class="list-item__title type-sm type-trim">Accounts</span>
          <span class="list-item__subtitle type-xs type-trim">Private &amp; saving accounts</span>
        </div>
        <svg class="list-item__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-right"/></svg>
      </div>
    </div>
  \`
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: 'Section Card — Offers',
  render: () => \`
    <div style="padding:1rem;max-width:28rem;">
      <div class="section-card">
        <div class="section-card__header">
          <span class="section-card__title">Offers</span>
        </div>
        <div class="section-card__body">
          <div class="list-item">
            <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-shield"/></svg>
            <div class="list-item__content type-stack-tight">
              <span class="list-item__title type-sm type-trim">Accounts</span>
              <span class="list-item__subtitle type-xs type-trim">Private &amp; saving accounts</span>
            </div>
            <svg class="list-item__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-right"/></svg>
          </div>
          <div class="list-item">
            <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-credit-card"/></svg>
            <div class="list-item__content type-stack-tight">
              <span class="list-item__title type-sm type-trim">Cards</span>
              <span class="list-item__subtitle type-xs type-trim">Order NEW cards, monitor</span>
            </div>
            <svg class="list-item__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-right"/></svg>
          </div>
          <div class="list-item">
            <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-trending-up"/></svg>
            <div class="list-item__content type-stack-tight">
              <span class="list-item__title type-sm type-trim">Investment</span>
              <span class="list-item__subtitle type-xs type-trim">Fonds, trading, asset management</span>
            </div>
            <svg class="list-item__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-right"/></svg>
          </div>
        </div>
      </div>
    </div>
  \`
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: 'Section Card Header — with total',
  render: () => \`
    <div style="padding:1rem;max-width:28rem;">
      <div class="section-card">
        <div class="section-card__header">
          <span class="section-card__title">Accounts &amp; investment</span>
          <span class="section-card__amount">
            <span class="section-card__currency">CHF</span>
            <span class="section-card__value">65'570.00</span>
          </span>
        </div>
      </div>
    </div>
  \`
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: 'Section Card Header — title only',
  render: () => \`
    <div style="padding:1rem;max-width:28rem;">
      <div class="section-card">
        <div class="section-card__header">
          <span class="section-card__title">Other products</span>
        </div>
      </div>
    </div>
  \`
}`,...f.parameters?.docs?.source}}},p=[`ConfigurableProductItem`,`ConfigurableSectionCard`,`CardAccountsInvestment`,`ProductItemSingle`,`CardOtherProducts`,`ListItemGroupAccount`,`ListItemWithAmount`,`ListItemWithChevron`,`CardOffers`,`CardHeaderWithTotal`,`CardHeaderTitleOnly`]}))();export{i as CardAccountsInvestment,f as CardHeaderTitleOnly,d as CardHeaderWithTotal,u as CardOffers,o as CardOtherProducts,n as ConfigurableProductItem,r as ConfigurableSectionCard,s as ListItemGroupAccount,c as ListItemWithAmount,l as ListItemWithChevron,a as ProductItemSingle,p as __namedExportsOrder,t as default};