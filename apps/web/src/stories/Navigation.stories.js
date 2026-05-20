export default {
  title: 'Components/Navigation',
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export const SidebarOverviewActive = {
  name: 'Sidebar — Overview active',
  render: () => `
    <aside class="sidebar" style="position:relative;height:100vh;max-width:220px;">
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
  `,
};

export const SidebarPaymentsActive = {
  name: 'Sidebar — Payments active',
  render: () => `
    <aside class="sidebar" style="position:relative;height:100vh;max-width:220px;">
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
          <button type="button" class="segmented__option segmented__option--active">Light</button>
          <button type="button" class="segmented__option">Dark</button>
        </div>
        <div class="sidebar__logout">
          <button class="sidebar__logout-btn" type="button">
            <svg class="sidebar__logout-icon" aria-hidden="true" focusable="false"><use href="#i-corner-up-right"/></svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  `,
};

export const SidebarNavItems = {
  name: 'Sidebar Nav Item — states',
  render: () => `
    <nav style="display:flex;flex-direction:column;gap:0.25rem;width:220px;padding:1rem;background:var(--color-bg-sidebar);">
      <a class="sidebar__nav-item sidebar__nav-item--active" href="#" aria-current="page">
        <svg class="sidebar__nav-icon" aria-hidden="true" focusable="false"><use href="#i-home"/></svg>
        <span>Active</span>
      </a>
      <a class="sidebar__nav-item" href="#">
        <svg class="sidebar__nav-icon" aria-hidden="true" focusable="false"><use href="#i-payments"/></svg>
        <span>Default</span>
      </a>
      <a class="sidebar__nav-item" href="#">
        <svg class="sidebar__nav-icon" aria-hidden="true" focusable="false"><use href="#i-user"/></svg>
        <span>Default</span>
      </a>
    </nav>
  `,
};

// ─── Tab Bar ──────────────────────────────────────────────────────────────────

export const TabBarOverviewActive = {
  name: 'Tab Bar — Overview active',
  render: () => `
    <nav class="tab-bar" style="position:relative;">
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
  `,
};

export const TabBarPaymentsActive = {
  name: 'Tab Bar — Payments active',
  render: () => `
    <nav class="tab-bar" style="position:relative;">
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
  `,
};

// ─── View Nav (mobile top bar) ────────────────────────────────────────────────

export const ViewNavTitleOnly = {
  name: 'View Nav — title only (no back/close)',
  render: () => `
    <header class="view__nav">
      <button type="button" class="view__nav-btn view__nav-btn--leading view__nav-btn--hidden" aria-hidden="true" tabindex="-1">
        <svg class="view__nav-btn-icon" aria-hidden="true" focusable="false"><use href="#i-arrow-left"/></svg>
      </button>
      <h1 class="page-title view__nav-title">Overview</h1>
      <button type="button" class="view__nav-btn view__nav-btn--trailing view__nav-btn--hidden" aria-hidden="true" tabindex="-1">
        <svg class="view__nav-btn-icon" aria-hidden="true" focusable="false"><use href="#i-x"/></svg>
      </button>
    </header>
  `,
};

export const ViewNavWithBack = {
  name: 'View Nav — with back button',
  render: () => `
    <header class="view__nav">
      <button type="button" class="view__nav-btn view__nav-btn--leading" aria-label="Back">
        <svg class="view__nav-btn-icon" aria-hidden="true" focusable="false"><use href="#i-arrow-left"/></svg>
      </button>
      <h1 class="page-title view__nav-title">Recipient</h1>
      <button type="button" class="view__nav-btn view__nav-btn--trailing view__nav-btn--hidden" aria-hidden="true" tabindex="-1">
        <svg class="view__nav-btn-icon" aria-hidden="true" focusable="false"><use href="#i-x"/></svg>
      </button>
    </header>
  `,
};

export const ViewNavWithBackAndClose = {
  name: 'View Nav — back + close',
  render: () => `
    <header class="view__nav">
      <button type="button" class="view__nav-btn view__nav-btn--leading" aria-label="Back">
        <svg class="view__nav-btn-icon" aria-hidden="true" focusable="false"><use href="#i-arrow-left"/></svg>
      </button>
      <h1 class="page-title view__nav-title">Amount</h1>
      <button type="button" class="view__nav-btn view__nav-btn--trailing" aria-label="Close">
        <svg class="view__nav-btn-icon" aria-hidden="true" focusable="false"><use href="#i-x"/></svg>
      </button>
    </header>
  `,
};

// ─── Segmented Control ────────────────────────────────────────────────────────

export const SegmentedTwoOptions = {
  name: 'Segmented — 2 options (theme toggle)',
  render: () => `
    <div style="padding:1rem;">
      <div class="segmented segmented--theme" role="group" aria-label="Theme">
        <button type="button" class="segmented__option segmented__option--active">Light</button>
        <button type="button" class="segmented__option">Dark</button>
      </div>
    </div>
  `,
};

export const SegmentedThreeOptions = {
  name: 'Segmented — 3 options (payment type)',
  render: () => `
    <div style="padding:1rem;max-width:28rem;">
      <div class="segmented" role="group">
        <button class="segmented__option segmented__option--active" type="button">Single</button>
        <button class="segmented__option" type="button">Recurring</button>
        <button class="segmented__option" type="button">Standing order</button>
      </div>
    </div>
  `,
};
