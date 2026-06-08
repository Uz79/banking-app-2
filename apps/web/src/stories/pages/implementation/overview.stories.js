export default {
  title: 'Live/Pages/Overview',
  parameters: {
    layout: 'fullscreen',
  },
};

export const StaticShell = {
  name: 'Static shell (no scripts)',
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
                    <div class="product-item__info type-stack-tight">
                      <span class="product-item__name type-sm type-trim">Household</span>
                      <span class="product-item__iban type-xs type-trim">CH35 0900 0000 2470 2920 1</span>
                    </div>
                    <span class="product-item__amount">
                      <span class="product-item__currency">CHF</span>
                      <span class="product-item__value">10'570.00</span>
                    </span>
                  </a>
                  <div class="divider"></div>
                  <a class="product-item" href="#">
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
                  <div class="divider"></div>
                  <div class="product-item">
                    <svg class="product-item__icon" aria-hidden="true" focusable="false"><use href="#i-life-buoy"/></svg>
                    <div class="product-item__info type-stack-tight">
                      <span class="product-item__name type-sm type-trim">Deposit</span>
                      <span class="product-item__iban type-xs type-trim">123.456.78</span>
                    </div>
                    <span class="product-item__amount">
                      <span class="product-item__currency">CHF</span>
                      <span class="product-item__value">20'000.00</span>
                    </span>
                  </div>
                  <div class="divider"></div>
                  <div class="product-item">
                    <svg class="product-item__icon" aria-hidden="true" focusable="false"><use href="#i-anchor"/></svg>
                    <div class="product-item__info type-stack-tight">
                      <span class="product-item__name type-sm type-trim">Retirement savings 3a</span>
                      <span class="product-item__iban type-xs type-trim">7740205-08</span>
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
                    <div class="list-item__content type-stack-tight">
                      <span class="list-item__title type-sm type-trim">VISA Gold</span>
                      <span class="list-item__subtitle type-xs type-trim">available CHF 4'700.00</span>
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
                    <div class="list-item__content type-stack-tight">
                      <span class="list-item__title type-sm type-trim">Accounts</span>
                      <span class="list-item__subtitle type-xs type-trim">Private &amp; saving accounts</span>
                    </div>
                    <svg class="list-item__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-right"/></svg>
                  </div>
                  <div class="divider"></div>
                  <div class="list-item">
                    <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-credit-card"/></svg>
                    <div class="list-item__content type-stack-tight">
                      <span class="list-item__title type-sm type-trim">Cards</span>
                      <span class="list-item__subtitle type-xs type-trim">Order NEW cards, monitor</span>
                    </div>
                    <svg class="list-item__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-right"/></svg>
                  </div>
                  <div class="divider"></div>
                  <div class="list-item">
                    <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-trending-up"/></svg>
                    <div class="list-item__content type-stack-tight">
                      <span class="list-item__title type-sm type-trim">Investment</span>
                      <span class="list-item__subtitle type-xs type-trim">Fonds, trading, asset management</span>
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

