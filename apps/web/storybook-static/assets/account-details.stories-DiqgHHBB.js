import{n as e}from"./chunk-DnJy8xQt.js";function t(e){return e.startsWith(`http`)||e.startsWith(`/`)?e:a+e}function n(e){let n=t(e),r=document.querySelector(`script[data-sb-app-script="${n}"]`);return r?r.dataset.sbLoaded===`1`?Promise.resolve():new Promise((e,t)=>{r.addEventListener(`load`,()=>e()),r.addEventListener(`error`,()=>t(Error(`Failed to load ${n}`)))}):new Promise((e,t)=>{let r=document.createElement(`script`);r.src=n,r.async=!1,r.dataset.sbAppScript=n,r.onload=()=>{r.dataset.sbLoaded=`1`,e()},r.onerror=()=>t(Error(`Failed to load ${n}`)),document.body.appendChild(r)})}async function r(e){for(let t of e)await n(t)}function i(){if(window.UZBankPayState)try{document.dispatchEvent(new CustomEvent(`uzbank:state-changed`,{detail:window.UZBankPayState.getState()}))}catch{}}var a,o=e((()=>{a=`/js/`}));function s(){return`
    <div class="app">
      <aside class="sidebar">
        <div class="sidebar__logo"><a href="#">UZ Bank</a></div>
        <nav class="sidebar__nav">
          <a class="sidebar__nav-item" href="#">
            <svg class="sidebar__nav-icon" aria-hidden="true" focusable="false"><use href="#i-home"/></svg>
            <span>Overview</span>
          </a>
          <a class="sidebar__nav-item" href="#">
            <svg class="sidebar__nav-icon" aria-hidden="true" focusable="false"><use href="#i-payments"/></svg>
            <span>Payments</span>
          </a>
          <a class="sidebar__nav-item sidebar__nav-item--active" href="#" aria-current="page">
            <svg class="sidebar__nav-icon" aria-hidden="true" focusable="false"><use href="#i-user"/></svg>
            <span>Account</span>
          </a>
        </nav>
      </aside>
      <main class="main-content">
        <div class="main-content__inner">
          <section class="view view--active view--account-details" data-view="account-details">
            <div class="view__main">
              <header class="view__nav" data-scroll-edge-nav>
                <a class="view__nav-btn view__nav-btn--leading view__back" href="#" aria-label="Back">
                  <svg class="view__nav-btn-icon" aria-hidden="true" focusable="false"><use href="#i-arrow-left"/></svg>
                </a>
                <h1 class="page-title view__nav-title">Details of an Account</h1>
              </header>
              <div class="action-buttons">
                <button class="action-button" type="button" data-action="pay">
                  <span class="action-button__circle">
                    <svg class="action-button__icon" aria-hidden="true" focusable="false"><use href="#i-plus"/></svg>
                  </span>
                  <span class="action-button__label">Pay</span>
                </button>
                <button class="action-button" type="button" data-action="iat">
                  <span class="action-button__circle">
                    <svg class="action-button__icon" aria-hidden="true" focusable="false"><use href="#i-repeat"/></svg>
                  </span>
                  <span class="action-button__label">Internal Transfer</span>
                </button>
              </div>
              <div class="section-card">
                <div class="section-card__header">
                  <span class="section-card__title">Product</span>
                  <span class="section-card__account-type" id="uz-carousel-account-type">
                    <span class="section-card__account-type-currency">CHF</span>
                    <span class="section-card__account-type-label">Private account</span>
                  </span>
                </div>
                <div class="carousel">
                  <div class="carousel__track">
                    <div class="carousel__slides">
                      <div class="carousel__slide" data-account-key="household" data-account-type="Private account" data-account-currency="CHF">
                        <article class="list-item list-item--group-account" aria-label="Household account">
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
                      </div>
                      <div class="carousel__slide" data-account-key="savings" data-account-type="Savings account" data-account-currency="CHF">
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
                      </div>
                      <div class="carousel__slide" data-account-key="deposit" data-account-type="Deposit account" data-account-currency="CHF">
                        <article class="list-item list-item--group-account" aria-label="Deposit account">
                          <div class="list-item__media">
                            <svg class="list-item__icon" aria-hidden="true" focusable="false"><use href="#i-life-buoy"/></svg>
                          </div>
                          <div class="list-item__body type-stack-tight">
                            <span class="list-item__title type-sm type-trim">Deposit</span>
                            <span class="list-item__subtitle type-xs type-trim">123,456.78</span>
                          </div>
                          <div class="list-item__end">
                            <span class="list-item__currency type-xs">CHF</span>
                            <span class="list-item__value type-sm type-bold">20'000.00</span>
                          </div>
                        </article>
                      </div>
                    </div>
                  </div>
                  <div class="carousel__pagination">
                    <button class="carousel__arrow" type="button">
                      <svg class="carousel__arrow-icon" role="img" aria-label="Previous" focusable="false"><use href="#i-chevron-left"/></svg>
                    </button>
                    <span class="carousel__dot carousel__dot--active"></span>
                    <span class="carousel__dot"></span>
                    <span class="carousel__dot"></span>
                    <button class="carousel__arrow" type="button">
                      <svg class="carousel__arrow-icon" role="img" aria-label="Next" focusable="false"><use href="#i-chevron-right"/></svg>
                    </button>
                  </div>
                </div>
              </div>
              <div class="bookings-card">
                <div class="bookings-card__account" data-account-bookings="household">
                  <div class="booking-group" data-day="today">
                    <header class="booking-group__header">
                      <span class="booking-group__label">Today</span>
                      <span class="booking-group__balance">
                        <span class="booking-group__balance-currency">CHF</span>
                        <span class="booking-group__balance-value" data-day-balance="today">9'900.00</span>
                      </span>
                    </header>
                    <div class="booking-row" data-mock-booking="static">
                      <svg class="booking-row__icon" aria-hidden="true" focusable="false"><use href="#i-corner-up-right"/></svg>
                      <span class="booking-row__name">Apple</span>
                      <span class="booking-row__amount">
                        <span class="booking-row__currency">CHF</span>
                        <span class="booking-row__value">-100.00</span>
                      </span>
                    </div>
                  </div>
                  <div class="divider"></div>
                  <div class="booking-group" data-day="yesterday">
                    <header class="booking-group__header">
                      <span class="booking-group__label">Yesterday</span>
                      <span class="booking-group__balance">
                        <span class="booking-group__balance-currency">CHF</span>
                        <span class="booking-group__balance-value" data-day-balance="yesterday">10'000.00</span>
                      </span>
                    </header>
                    <div class="booking-row" data-mock-booking="static">
                      <svg class="booking-row__icon" aria-hidden="true" focusable="false"><use href="#i-corner-up-right"/></svg>
                      <span class="booking-row__name">Café</span>
                      <span class="booking-row__amount">
                        <span class="booking-row__currency">CHF</span>
                        <span class="booking-row__value">-10.00</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="bookings-card__account" data-account-bookings="savings" hidden>
                  <div class="booking-group" data-day="today">
                    <header class="booking-group__header">
                      <span class="booking-group__label">Today</span>
                      <span class="booking-group__balance">
                        <span class="booking-group__balance-currency">CHF</span>
                        <span class="booking-group__balance-value">25'320.00</span>
                      </span>
                    </header>
                    <div class="booking-row" data-mock-booking="static">
                      <svg class="booking-row__icon" aria-hidden="true" focusable="false"><use href="#i-download"/></svg>
                      <span class="booking-row__name">Salary</span>
                      <span class="booking-row__amount">
                        <span class="booking-row__currency">CHF</span>
                        <span class="booking-row__value">+5'000.00</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="bookings-card__account" data-account-bookings="deposit" hidden>
                  <div class="booking-group" data-day="today">
                    <header class="booking-group__header">
                      <span class="booking-group__label">Today</span>
                      <span class="booking-group__balance">
                        <span class="booking-group__balance-currency">CHF</span>
                        <span class="booking-group__balance-value">20'000.00</span>
                      </span>
                    </header>
                    <div class="booking-row" data-mock-booking="static">
                      <svg class="booking-row__icon" aria-hidden="true" focusable="false"><use href="#i-trending-up"/></svg>
                      <span class="booking-row__name">Interest credit</span>
                      <span class="booking-row__amount">
                        <span class="booking-row__currency">CHF</span>
                        <span class="booking-row__value">+125.00</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
    ${c}
  `}var c,l,u=e((()=>{c=`
<div id="uz-payment-details-overlay" class="modal-overlay" aria-hidden="true">
  <div class="modal-shell modal-shell--offscreen modal-shell--no-transition">
    <div class="modal modal--payment-details pd--domestic">
      <div class="modal__nav">
        <span class="modal__title" id="uz-pd-title">Domestic Payment</span>
        <button type="button" class="modal__close uz-pd-close" aria-label="Close payment details">
          <svg class="modal__close-icon" role="img" aria-label="" focusable="false"><use href="#i-x"/></svg>
        </button>
      </div>
      <div class="modal__body">
        <div class="payment-details" id="uz-payment-details">
          <div class="payment-details__amount-hero">
            <div class="payment-details__amount-row">
              <span class="payment-details__amount-value" id="uz-pd-amount">-100.00</span>
              <span class="payment-details__amount-currency" id="uz-pd-currency">CHF</span>
            </div>
          </div>
          <div class="payment-details__to pd-domestic-only">
            <span class="payment-details__to-label">to</span>
            <div class="payment-details__to-body">
              <span class="payment-details__to-value" id="uz-pd-to-value">Apple<br>Rennweg 43<br>8001 Zürich</span>
            </div>
          </div>
          <div class="payment-details__accounts pd-internal-only">
            <span class="payment-details__account-label">from</span>
            <div class="payment-details__account-item" id="uz-pd-debit">
              <svg id="uz-pd-debit-icon" class="payment-details__account-icon" aria-hidden="true" focusable="false"><use href="#i-anchor"/></svg>
              <div class="payment-details__account-info">
                <span class="payment-details__account-name" id="uz-pd-debit-name">Savings account</span>
                <span class="payment-details__account-iban" id="uz-pd-debit-iban">CH35 0900 0000 2470 2920 2</span>
              </div>
              <span class="payment-details__account-balance" id="uz-pd-debit-balance">
                <span class="payment-details__account-balance-currency" id="uz-pd-debit-balance-currency">CHF</span>
                <span class="payment-details__account-balance-value" id="uz-pd-debit-balance-value">25'000.00</span>
              </span>
            </div>
            <span class="payment-details__account-label">to</span>
            <div class="payment-details__account-item" id="uz-pd-credit">
              <svg id="uz-pd-credit-icon" class="payment-details__account-icon" aria-hidden="true" focusable="false"><use href="#i-scissors"/></svg>
              <div class="payment-details__account-info">
                <span class="payment-details__account-name" id="uz-pd-credit-name">Private account</span>
                <span class="payment-details__account-iban" id="uz-pd-credit-iban">CH35 0900 0000 2470 2920 1</span>
              </div>
              <span class="payment-details__account-balance" id="uz-pd-credit-balance">
                <span class="payment-details__account-balance-currency" id="uz-pd-credit-balance-currency">CHF</span>
                <span class="payment-details__account-balance-value" id="uz-pd-credit-balance-value">10'000.00</span>
              </span>
            </div>
          </div>
          <div class="payment-details__rule pd-internal-only"></div>
          <div class="payment-details__info-rows">
            <div class="payment-details__info-row">
              <span class="payment-details__info-label">Status</span>
              <span class="chip chip--sm" id="uz-pd-status-chip">
                <svg id="uz-pd-status-icon" class="chip__icon" aria-hidden="true" focusable="false"><use href="#i-clock"/></svg>
                <span class="chip__label" id="uz-pd-status-text">Pending</span>
              </span>
            </div>
            <div class="payment-details__info-row">
              <span class="payment-details__info-label">Signed</span>
              <span class="payment-details__info-value">Yes</span>
            </div>
          </div>
          <button class="expander" type="button" aria-expanded="false" id="uz-pd-further-toggle">
            <span class="expander__leading">
              <svg class="expander__leading-icon" aria-hidden="true" focusable="false"><use href="#i-chevron-down"/></svg>
            </span>
            <span class="expander__content">
              <span class="expander__title">Further options</span>
            </span>
          </button>
          <div class="payment-details__further-content" id="uz-pd-further-content" hidden>
            <div class="payment-details__message-row">
              <span class="payment-details__info-label">Message</span>
              <span class="payment-details__info-value" id="uz-pd-message-value"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="modal__footer">
        <button class="uz-btn uz-btn--primary uz-btn--md uz-btn--block uz-pd-confirm" type="button">Confirm</button>
      </div>
    </div>
  </div>
</div>
`,l=[`payment-state.js`,`data-render.js`,`scroll-edge-chrome.js`,`app-mp.js`,`payment-details.js`]})),d,f,p;e((()=>{o(),u(),d={title:`Live/Pages/Account Details`,parameters:{layout:`fullscreen`,docs:{description:{component:`Account details shell with app scripts: carousel, per-account bookings, and payment-details overlay. Tap a booking row to open details.`}}},decorators:[e=>(document.body.classList.add(`body`),document.body.setAttribute(`data-screen`,`account-details`),document.body.setAttribute(`data-page`,`account-details`),e())]},f={name:`Interactive (with scripts)`,render:()=>s(),play:async()=>{await r(l),i()}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: 'Interactive (with scripts)',
  render: () => accountDetailsLiveMarkup(),
  play: async () => {
    await loadAppScripts(ACCOUNT_DETAILS_LIVE_SCRIPTS);
    refreshPayStateDom();
  }
}`,...f.parameters?.docs?.source}}},p=[`Interactive`]}))();export{f as Interactive,p as __namedExportsOrder,d as default};