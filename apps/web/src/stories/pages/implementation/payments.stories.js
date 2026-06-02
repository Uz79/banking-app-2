export default {
  title: 'Pages/Payments',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Implementation = {
  name: 'Implementation',
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

