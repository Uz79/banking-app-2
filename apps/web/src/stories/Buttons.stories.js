export default {
  title: 'Components/Button',
};

// ─── Configurable Button (uses Controls panel) ────────────────────────────────

export const Configurable = {
  name: 'Configurable (use Controls ↓)',
  args: {
    label:   'Continue',
    variant: 'primary',
    size:    'md',
    block:   false,
    withIcon: true,
  },
  argTypes: {
    label:   { control: 'text',   description: 'Button label' },
    variant: { control: 'radio',  options: ['primary', 'secondary', 'tonal'], description: 'Visual variant' },
    size:    { control: 'radio',  options: ['sm', 'md', 'lg'],               description: 'Size' },
    block:   { control: 'boolean',                                           description: 'Full-width block' },
    withIcon:{ control: 'boolean',                                           description: 'Show trailing arrow icon' },
  },
  render: ({ label, variant, size, block, withIcon }) => `
    <div style="padding:1.5rem;${block ? 'max-width:22rem;' : ''}">
      <button type="button" class="uz-btn uz-btn--${variant} uz-btn--${size}${block ? ' uz-btn--block' : ''}">
        <span>${label}</span>
        ${withIcon ? `<svg class="uz-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>` : ''}
      </button>
    </div>
  `,
};

// ─── uz-btn: Primary ─────────────────────────────────────────────────────────

export const PrimaryAllSizes = {
  name: 'Primary — all sizes',
  render: () => `
    <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;padding:1rem;">
      <button type="button" class="uz-btn uz-btn--primary uz-btn--sm">Small</button>
      <button type="button" class="uz-btn uz-btn--primary uz-btn--md">Regular</button>
      <button type="button" class="uz-btn uz-btn--primary uz-btn--lg">Large</button>
      <button type="button" class="uz-btn uz-btn--primary uz-btn--md uz-btn--pressed"
              tabindex="-1" aria-hidden="true">Pressed</button>
    </div>
  `,
};

export const PrimaryWithIcon = {
  name: 'Primary — with icon',
  render: () => `
    <div style="display:flex;gap:1rem;align-items:center;padding:1rem;">
      <button type="button" class="uz-btn uz-btn--primary uz-btn--md">
        <span>Continue</span>
        <svg class="uz-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button type="button" class="uz-btn uz-btn--primary uz-btn--sm">
        <span>Confirm</span>
        <svg class="uz-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `,
};

export const PrimaryBlock = {
  name: 'Primary — block (full width)',
  render: () => `
    <div style="max-width:22rem;padding:1rem;">
      <button type="button" class="uz-btn uz-btn--primary uz-btn--md uz-btn--block">Confirm payment</button>
    </div>
  `,
};

// ─── uz-btn: Secondary ───────────────────────────────────────────────────────

export const SecondaryAllSizes = {
  name: 'Secondary — all sizes',
  render: () => `
    <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;padding:1rem;">
      <button type="button" class="uz-btn uz-btn--secondary uz-btn--sm">Small</button>
      <button type="button" class="uz-btn uz-btn--secondary uz-btn--md">Regular</button>
      <button type="button" class="uz-btn uz-btn--secondary uz-btn--lg">Large</button>
      <button type="button" class="uz-btn uz-btn--secondary uz-btn--md uz-btn--pressed"
              tabindex="-1" aria-hidden="true">Pressed</button>
    </div>
  `,
};

export const SecondaryWithIcon = {
  name: 'Secondary — with icon',
  render: () => `
    <div style="display:flex;gap:1rem;align-items:center;padding:1rem;">
      <button type="button" class="uz-btn uz-btn--secondary uz-btn--md">
        <span>Continue</span>
        <svg class="uz-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `,
};

// ─── uz-btn: Tonal ───────────────────────────────────────────────────────────

export const TonalAllSizes = {
  name: 'Tonal — all sizes',
  render: () => `
    <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;padding:1rem;">
      <button type="button" class="uz-btn uz-btn--tonal uz-btn--sm">Small</button>
      <button type="button" class="uz-btn uz-btn--tonal uz-btn--md">Regular</button>
      <button type="button" class="uz-btn uz-btn--tonal uz-btn--lg">Large</button>
      <button type="button" class="uz-btn uz-btn--tonal uz-btn--md uz-btn--pressed"
              tabindex="-1" aria-hidden="true">Pressed</button>
    </div>
  `,
};

// ─── All variants side-by-side ────────────────────────────────────────────────

export const AllVariants = {
  name: 'All variants — comparison',
  render: () => `
    <div style="display:flex;flex-direction:column;gap:1.5rem;padding:1rem;">
      <div>
        <p style="font-size:var(--fs-text-xs);color:var(--color-fg-secondary);margin:0 0 0.5rem;">Primary</p>
        <div style="display:flex;gap:0.75rem;align-items:center;">
          <button type="button" class="uz-btn uz-btn--primary uz-btn--sm">Small</button>
          <button type="button" class="uz-btn uz-btn--primary uz-btn--md">Regular</button>
          <button type="button" class="uz-btn uz-btn--primary uz-btn--lg">Large</button>
        </div>
      </div>
      <div>
        <p style="font-size:var(--fs-text-xs);color:var(--color-fg-secondary);margin:0 0 0.5rem;">Secondary</p>
        <div style="display:flex;gap:0.75rem;align-items:center;">
          <button type="button" class="uz-btn uz-btn--secondary uz-btn--sm">Small</button>
          <button type="button" class="uz-btn uz-btn--secondary uz-btn--md">Regular</button>
          <button type="button" class="uz-btn uz-btn--secondary uz-btn--lg">Large</button>
        </div>
      </div>
      <div>
        <p style="font-size:var(--fs-text-xs);color:var(--color-fg-secondary);margin:0 0 0.5rem;">Tonal</p>
        <div style="display:flex;gap:0.75rem;align-items:center;">
          <button type="button" class="uz-btn uz-btn--tonal uz-btn--sm">Small</button>
          <button type="button" class="uz-btn uz-btn--tonal uz-btn--md">Regular</button>
          <button type="button" class="uz-btn uz-btn--tonal uz-btn--lg">Large</button>
        </div>
      </div>
    </div>
  `,
};

// ─── Legacy modal button ──────────────────────────────────────────────────────

export const LegacyBtnPrimary = {
  name: 'Legacy — btn-primary (= Regular, mirrors uz-btn--md)',
  render: () => `
    <div style="max-width:22rem;padding:1rem;">
      <button type="button" class="btn-primary">Confirm</button>
    </div>
  `,
};

// ─── Action Buttons ───────────────────────────────────────────────────────────

export const ActionButtons = {
  name: 'Action Buttons — all',
  render: () => `
    <div class="action-buttons" style="padding:1rem;">
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
  `,
};

export const ActionButtonSingle = {
  name: 'Action Button — single',
  render: () => `
    <div style="padding:1rem;">
      <button class="action-button" type="button">
        <span class="action-button__circle">
          <svg class="action-button__icon" aria-hidden="true" focusable="false"><use href="#i-plus"/></svg>
        </span>
        <span class="action-button__label">Pay</span>
      </button>
    </div>
  `,
};
