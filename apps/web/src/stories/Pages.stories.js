export default {
  title: 'Pages',
  parameters: {
    layout: 'fullscreen',
  },
};

// ─── Overview ─────────────────────────────────────────────────────────────────

export const Overview = {
  name: 'Overview',
  render: () => `
    <div class="app">
      <aside class="sidebar">
        <div class="sidebar__logo"><a href="#">UZ Bank</a></div>
        <nav class="sidebar__nav">
          <a class="sidebar__nav-item sidebar__nav-item--active" href="#" aria-current="page">
            <svg class="sidebar__nav-icon" aria-hidden="true" focusable="false"><use href="#i-home"/></svg>
            <span>Overview</span>
          </a>
          <a class="sidebar__nav-item" href="#">
            <svg class="sidebar__nav-icon" aria-hidden="true" focusable="false"><use href="#i-payments"/></svg>
            <span>Payments</span>
          </a>
          <a class="sidebar__nav-item" href="#">
            <svg class="sidebar__nav-icon" aria-hidden="true" focusable="false"><use href="#i-user"/></svg>
            <span>Profile</span>
          </a>
        </nav>
        <div class="sidebar__footer">
          <div class="segmented segmented--theme" role="group" aria-label="Theme">
            <button type="button" class="segmented__option">Light</button>
            <button type="button" class="segmented__option segmented__option--active">Dark</button>
          </div>
          <div class="sidebar__logout">
            <button class="sidebar__logout-btn" type="button">
              <svg class="sidebar__logout-icon" aria-hidden="true" focusable="false"><use href="#i-corner-up-right"/></svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <main class="main-content">
        <div class="main-content__inner">
          <section class="view view--active" data-view="overview">
            <div class="view__main">
              <header class="view__nav">
                <button type="button" class="view__nav-btn view__nav-btn--leading view__nav-btn--hidden" aria-hidden="true" tabindex="-1">
                  <svg class="view__nav-btn-icon" aria-hidden="true" focusable="false"><use href="#i-arrow-left"/></svg>
                </button>
                <h1 class="page-title view__nav-title">Overview</h1>
                <button type="button" class="view__nav-btn view__nav-btn--trailing view__nav-btn--hidden" aria-hidden="true" tabindex="-1">
                  <svg class="view__nav-btn-icon" aria-hidden="true" focusable="false"><use href="#i-x"/></svg>
                </button>
              </header>

              <div class="action-buttons">
                <button class="action-button" type="button">
                  <span class="action-button__circle">
                    <svg class="action-button__icon" aria-hidden="true" focusable="false"><use href="#i-camera"/></svg>
                  </span>
                  <span class="action-button__label">Scan</span>
                </button>
                <button class="action-button" type="button">
                  <span class="action-button__circle">
                    <svg class="action-button__icon" aria-hidden="true" focusable="false"><use href="#i-plus"/></svg>
                  </span>
                  <span class="action-button__label">Pay</span>
                </button>
                <button class="action-button" type="button">
                  <span class="action-button__circle">
                    <svg class="action-button__icon" aria-hidden="true" focusable="false"><use href="#i-repeat"/></svg>
                  </span>
                  <span class="action-button__label">Internal Transfer</span>
                </button>
              </div>

              <div class="section-card">
                <div class="section-card__header">
                  <span class="section-card__title">Accounts &amp; investment</span>
                  <span class="section-card__amount">
                    <span class="section-card__currency">CHF</span>
                    <span class="section-card__value">65'570.00</span>
                  </span>
                </div>
                <div class="section-card__body">
                  <a class="product-item" href="#">
                    <svg class="product-item__icon" aria-hidden="true" focusable="false"><use href="#i-home"/></svg>
                    <div class="product-item__info">
                      <span class="product-item__name">Household</span>
                      <span class="product-item__iban">CH35 0900 0000 2470 2920 1</span>
                    </div>
                    <span class="product-item__amount">
                      <span class="product-item__currency">CHF</span>
                      <span class="product-item__value">10'570.00</span>
                    </span>
                  </a>
                  <div class="divider"></div>
                  <a class="product-item" href="#">
                    <svg class="product-item__icon" aria-hidden="true" focusable="false"><use href="#i-shield"/></svg>
                    <div class="product-item__info">
                      <span class="product-item__name">Savings account</span>
                      <span class="product-item__iban">CH35 0900 0000 2470 2920 2</span>
                    </div>
                    <span class="product-item__amount">
                      <span class="product-item__currency">CHF</span>
                      <span class="product-item__value">25'000.00</span>
                    </span>
                  </a>
                  <div class="divider"></div>
                  <div class="product-item">
                    <svg class="product-item__icon" aria-hidden="true" focusable="false"><use href="#i-life-buoy"/></svg>
                    <div class="product-item__info">
                      <span class="product-item__name">Deposit</span>
                      <span class="product-item__iban">123.456.78</span>
                    </div>
                    <span class="product-item__amount">
                      <span class="product-item__currency">CHF</span>
                      <span class="product-item__value">20'000.00</span>
                    </span>
                  </div>
                  <div class="divider"></div>
                  <div class="product-item">
                    <svg class="product-item__icon" aria-hidden="true" focusable="false"><use href="#i-anchor"/></svg>
                    <div class="product-item__info">
                      <span class="product-item__name">Retirement savings 3a</span>
                      <span class="product-item__iban">7740205-08</span>
                    </div>
                    <span class="product-item__amount">
                      <span class="product-item__currency">CHF</span>
                      <span class="product-item__value">10'000.00</span>
                    </span>
                  </div>
                </div>
              </div>

              <div class="section-card">
                <div class="section-card__header">
                  <span class="section-card__title">Other products</span>
                </div>
                <div class="section-card__body">
                  <div class="list-item">
                    <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-credit-card"/></svg>
                    <div class="list-item__content">
                      <span class="list-item__title">VISA Gold</span>
                      <span class="list-item__subtitle">available CHF 4'700.00</span>
                    </div>
                    <span class="list-item__amount">
                      <span class="list-item__currency">Limit CHF</span>
                      <span class="list-item__value">5'000.00</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <aside class="view__sidebar">
              <div class="section-card">
                <div class="section-card__header">
                  <span class="section-card__title">Offers</span>
                </div>
                <div class="section-card__body">
                  <div class="list-item">
                    <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-shield"/></svg>
                    <div class="list-item__content">
                      <span class="list-item__title">Accounts</span>
                      <span class="list-item__subtitle">Private &amp; saving accounts</span>
                    </div>
                    <svg class="list-item__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-right"/></svg>
                  </div>
                  <div class="divider"></div>
                  <div class="list-item">
                    <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-credit-card"/></svg>
                    <div class="list-item__content">
                      <span class="list-item__title">Cards</span>
                      <span class="list-item__subtitle">Order NEW cards, monitor</span>
                    </div>
                    <svg class="list-item__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-right"/></svg>
                  </div>
                  <div class="divider"></div>
                  <div class="list-item">
                    <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-trending-up"/></svg>
                    <div class="list-item__content">
                      <span class="list-item__title">Investment</span>
                      <span class="list-item__subtitle">Fonds, trading, asset management</span>
                    </div>
                    <svg class="list-item__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-right"/></svg>
                  </div>
                  <button class="show-all-btn uz-btn uz-btn--tonal uz-btn--sm" type="button">
                    <span>Show all</span>
                    <svg class="show-all-btn__icon uz-btn__icon" aria-hidden="true" focusable="false"><use href="#i-arrow-right"/></svg>
                  </button>
                </div>
              </div>
            </aside>
          </section>
        </div>
      </main>

      <nav class="tab-bar">
        <a class="tab-bar__item tab-bar__item--active" href="#" aria-current="page">
          <span class="tab-bar__icon-wrap tab-bar__icon-wrap--active">
            <svg class="tab-bar__icon" aria-hidden="true" focusable="false"><use href="#i-home"/></svg>
          </span>
          <span class="tab-bar__label">Overview</span>
        </a>
        <a class="tab-bar__item" href="#">
          <span class="tab-bar__icon-wrap">
            <svg class="tab-bar__icon" aria-hidden="true" focusable="false"><use href="#i-payments"/></svg>
          </span>
          <span class="tab-bar__label">Payments</span>
        </a>
        <a class="tab-bar__item" href="#">
          <span class="tab-bar__icon-wrap">
            <svg class="tab-bar__icon" aria-hidden="true" focusable="false"><use href="#i-user"/></svg>
          </span>
          <span class="tab-bar__label">Profile</span>
        </a>
      </nav>
    </div>
  `,
};

// ─── Payments ─────────────────────────────────────────────────────────────────

export const Payments = {
  name: 'Payments',
  render: () => `
    <div class="app">
      <aside class="sidebar">
        <div class="sidebar__logo"><a href="#">UZ Bank</a></div>
        <nav class="sidebar__nav">
          <a class="sidebar__nav-item" href="#">
            <svg class="sidebar__nav-icon" aria-hidden="true" focusable="false"><use href="#i-home"/></svg>
            <span>Overview</span>
          </a>
          <a class="sidebar__nav-item sidebar__nav-item--active" href="#" aria-current="page">
            <svg class="sidebar__nav-icon" aria-hidden="true" focusable="false"><use href="#i-payments"/></svg>
            <span>Payments</span>
          </a>
          <a class="sidebar__nav-item" href="#">
            <svg class="sidebar__nav-icon" aria-hidden="true" focusable="false"><use href="#i-user"/></svg>
            <span>Profile</span>
          </a>
        </nav>
        <div class="sidebar__footer">
          <div class="segmented segmented--theme" role="group" aria-label="Theme">
            <button type="button" class="segmented__option">Light</button>
            <button type="button" class="segmented__option segmented__option--active">Dark</button>
          </div>
          <div class="sidebar__logout">
            <button class="sidebar__logout-btn" type="button">
              <svg class="sidebar__logout-icon" aria-hidden="true" focusable="false"><use href="#i-corner-up-right"/></svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <main class="main-content">
        <div class="main-content__inner">
          <section class="view view--active" data-view="payments">
            <div class="view__main">
              <header class="view__nav">
                <button type="button" class="view__nav-btn view__nav-btn--leading view__nav-btn--hidden" aria-hidden="true" tabindex="-1">
                  <svg class="view__nav-btn-icon" aria-hidden="true" focusable="false"><use href="#i-arrow-left"/></svg>
                </button>
                <h1 class="page-title view__nav-title">Payments</h1>
                <button type="button" class="view__nav-btn view__nav-btn--trailing view__nav-btn--hidden" aria-hidden="true" tabindex="-1">
                  <svg class="view__nav-btn-icon" aria-hidden="true" focusable="false"><use href="#i-x"/></svg>
                </button>
              </header>

              <div class="action-buttons">
                <button class="action-button" type="button">
                  <span class="action-button__circle">
                    <svg class="action-button__icon" aria-hidden="true" focusable="false"><use href="#i-camera"/></svg>
                  </span>
                  <span class="action-button__label">Scan</span>
                </button>
                <button class="action-button" type="button">
                  <span class="action-button__circle">
                    <svg class="action-button__icon" aria-hidden="true" focusable="false"><use href="#i-plus"/></svg>
                  </span>
                  <span class="action-button__label">Pay</span>
                </button>
                <button class="action-button" type="button">
                  <span class="action-button__circle">
                    <svg class="action-button__icon" aria-hidden="true" focusable="false"><use href="#i-repeat"/></svg>
                  </span>
                  <span class="action-button__label">Internal Transfer</span>
                </button>
              </div>

              <div class="section-card">
                <div class="section-card__header">
                  <span class="section-card__title">Pending payments</span>
                </div>
                <div class="section-card__body">
                  <span class="section-card__date">28.05.2026</span>
                  <div class="list-item">
                    <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-clock"/></svg>
                    <div class="list-item__content"><span class="list-item__title">Rent</span></div>
                    <span class="list-item__amount">
                      <span class="list-item__currency">CHF</span>
                      <span class="list-item__value">2'050.00</span>
                    </span>
                  </div>
                  <div class="divider"></div>
                  <span class="section-card__date">29.04.2026</span>
                  <div class="list-item">
                    <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-clock"/></svg>
                    <div class="list-item__content"><span class="list-item__title">Healthcare</span></div>
                    <span class="list-item__amount">
                      <span class="list-item__currency">CHF</span>
                      <span class="list-item__value">420.00</span>
                    </span>
                  </div>
                  <div class="divider"></div>
                  <button class="show-all-btn uz-btn uz-btn--tonal uz-btn--sm" type="button">
                    <span>Show all pending payments</span>
                    <svg class="show-all-btn__icon uz-btn__icon" aria-hidden="true" focusable="false"><use href="#i-arrow-right"/></svg>
                  </button>
                </div>
              </div>
            </div>

            <aside class="view__sidebar">
              <div class="section-card">
                <div class="section-card__header">
                  <span class="section-card__title">Recurring payments</span>
                </div>
                <div class="section-card__body">
                  <div class="list-item">
                    <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-rotate-ccw"/></svg>
                    <div class="list-item__content"><span class="list-item__title">Rent</span></div>
                    <svg class="list-item__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-right"/></svg>
                  </div>
                  <div class="divider"></div>
                  <div class="list-item">
                    <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-rotate-ccw"/></svg>
                    <div class="list-item__content"><span class="list-item__title">Fonds Investment</span></div>
                    <svg class="list-item__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-right"/></svg>
                  </div>
                  <div class="divider"></div>
                  <div class="list-item">
                    <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-rotate-ccw"/></svg>
                    <div class="list-item__content"><span class="list-item__title">Allowance</span></div>
                    <svg class="list-item__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-right"/></svg>
                  </div>
                </div>
              </div>

              <div class="section-card">
                <div class="section-card__header">
                  <span class="section-card__title">Most recent recipients</span>
                </div>
                <div class="section-card__body">
                  <div class="list-item">
                    <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-user"/></svg>
                    <div class="list-item__content"><span class="list-item__title">Anna Müller</span></div>
                    <svg class="list-item__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-right"/></svg>
                  </div>
                  <div class="divider"></div>
                  <div class="list-item">
                    <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-sunrise-logo"/></svg>
                    <div class="list-item__content"><span class="list-item__title">Sunrise</span></div>
                    <svg class="list-item__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-right"/></svg>
                  </div>
                  <div class="divider"></div>
                  <div class="list-item">
                    <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-user"/></svg>
                    <div class="list-item__content">
                      <span class="list-item__title">Hans Meyer</span>
                      <span class="list-item__subtitle">Rent</span>
                    </div>
                    <svg class="list-item__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-right"/></svg>
                  </div>
                </div>
              </div>
            </aside>
          </section>
        </div>
      </main>

      <nav class="tab-bar">
        <a class="tab-bar__item" href="#">
          <span class="tab-bar__icon-wrap">
            <svg class="tab-bar__icon" aria-hidden="true" focusable="false"><use href="#i-home"/></svg>
          </span>
          <span class="tab-bar__label">Overview</span>
        </a>
        <a class="tab-bar__item tab-bar__item--active" href="#" aria-current="page">
          <span class="tab-bar__icon-wrap tab-bar__icon-wrap--active">
            <svg class="tab-bar__icon" aria-hidden="true" focusable="false"><use href="#i-payments"/></svg>
          </span>
          <span class="tab-bar__label">Payments</span>
        </a>
        <a class="tab-bar__item" href="#">
          <span class="tab-bar__icon-wrap">
            <svg class="tab-bar__icon" aria-hidden="true" focusable="false"><use href="#i-user"/></svg>
          </span>
          <span class="tab-bar__label">Profile</span>
        </a>
      </nav>
    </div>
  `,
};

// ─── Payment Modal: Recipient Search step ─────────────────────────────────────

export const PaymentModalRecipientSearch = {
  name: 'Payment Modal — Recipient Search',
  parameters: { layout: 'fullscreen' },
  render: () => `
    <div class="modal-overlay modal-overlay--active" style="position:relative;min-height:600px;">
      <div class="modal-shell">
        <div class="modal modal--recipient-search-active">
          <div class="modal__nav">
            <button class="modal__back modal__back--hidden" type="button">
              <svg class="modal__back-icon" role="img" aria-label="Back" focusable="false"><use href="#i-arrow-left"/></svg>
            </button>
            <span class="modal__title">Recipient</span>
            <div class="modal__nav-search" role="search">
              <div class="recipient-search__field-wrap">
                <span class="recipient-search__icon" aria-hidden="true">
                  <svg class="recipient-search__icon-svg" focusable="false"><use href="#i-search"/></svg>
                </span>
                <input class="recipient-search__input" type="search" autocomplete="off"
                  placeholder="Enter IBAN, name or account number" aria-label="Search recipients" />
                <button type="button" class="recipient-search__clear recipient-search__clear--hidden" aria-label="Clear">
                  <svg class="recipient-search__clear-icon" aria-hidden="true" focusable="false"><use href="#i-x-circle"/></svg>
                </button>
              </div>
            </div>
            <button class="modal__close" type="button">
              <svg class="modal__close-icon" role="img" aria-label="Close" focusable="false"><use href="#i-x"/></svg>
            </button>
          </div>
          <div class="modal__body">
            <div class="modal__step modal__step--active" data-step="recipient-search">
              <div class="recipient-search">
                <p class="recipient-search__heading">Recommended recipients</p>
                <div class="recipient-search__list" role="listbox" aria-label="Recipients">
                  <button class="recipient-search__result" type="button" role="option">
                    <span class="recipient-search__result-icon">
                      <svg style="width:1.5rem;height:1.5rem;" aria-hidden="true" focusable="false"><use href="#i-user"/></svg>
                    </span>
                    <span class="recipient-search__result-body">
                      <span class="recipient-search__result-name">Anna Müller</span>
                      <span class="recipient-search__result-iban">CH35 0900 0000 1234 5678 9</span>
                    </span>
                  </button>
                  <button class="recipient-search__result" type="button" role="option">
                    <span class="recipient-search__result-icon">
                      <svg style="width:1.5rem;height:1.5rem;" aria-hidden="true" focusable="false"><use href="#i-sunrise-logo"/></svg>
                    </span>
                    <span class="recipient-search__result-body">
                      <span class="recipient-search__result-name">Sunrise</span>
                      <span class="recipient-search__result-iban">CH35 0900 0000 9876 5432 1</span>
                    </span>
                  </button>
                  <button class="recipient-search__result" type="button" role="option">
                    <span class="recipient-search__result-icon">
                      <svg style="width:1.5rem;height:1.5rem;" aria-hidden="true" focusable="false"><use href="#i-user"/></svg>
                    </span>
                    <span class="recipient-search__result-body">
                      <span class="recipient-search__result-name">Hans Meyer</span>
                      <span class="recipient-search__result-iban">CH35 0900 0000 2560 0696 0</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
};
