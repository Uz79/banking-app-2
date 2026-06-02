import{n as e}from"./chunk-DnJy8xQt.js";var t,n,r,i,a,o,s,c,l,u,d,f,p;e((()=>{t={title:`Components/Button`},n={name:`Configurable (use Controls ↓)`,args:{label:`Continue`,variant:`primary`,size:`md`,block:!1,withIcon:!0},argTypes:{label:{control:`text`,description:`Button label`},variant:{control:`radio`,options:[`primary`,`secondary`,`tonal`],description:`Visual variant`},size:{control:`radio`,options:[`sm`,`md`,`lg`],description:`Size`},block:{control:`boolean`,description:`Full-width block`},withIcon:{control:`boolean`,description:`Show trailing arrow icon`}},render:({label:e,variant:t,size:n,block:r,withIcon:i})=>`
    <div style="padding:1.5rem;${r?`max-width:22rem;`:``}">
      <button type="button" class="uz-btn uz-btn--${t} uz-btn--${n}${r?` uz-btn--block`:``}">
        <span>${e}</span>
        ${i?`<svg class="uz-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`:``}
      </button>
    </div>
  `},r={name:`Primary — all sizes`,render:()=>`
    <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;padding:1rem;">
      <button type="button" class="uz-btn uz-btn--primary uz-btn--sm">Small</button>
      <button type="button" class="uz-btn uz-btn--primary uz-btn--md">Regular</button>
      <button type="button" class="uz-btn uz-btn--primary uz-btn--lg">Large</button>
      <button type="button" class="uz-btn uz-btn--primary uz-btn--md uz-btn--pressed"
              tabindex="-1" aria-hidden="true">Pressed</button>
    </div>
  `},i={name:`Primary — with icon`,render:()=>`
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
  `},a={name:`Primary — block (full width)`,render:()=>`
    <div style="max-width:22rem;padding:1rem;">
      <button type="button" class="uz-btn uz-btn--primary uz-btn--md uz-btn--block">Confirm payment</button>
    </div>
  `},o={name:`Secondary — all sizes`,render:()=>`
    <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;padding:1rem;">
      <button type="button" class="uz-btn uz-btn--secondary uz-btn--sm">Small</button>
      <button type="button" class="uz-btn uz-btn--secondary uz-btn--md">Regular</button>
      <button type="button" class="uz-btn uz-btn--secondary uz-btn--lg">Large</button>
      <button type="button" class="uz-btn uz-btn--secondary uz-btn--md uz-btn--pressed"
              tabindex="-1" aria-hidden="true">Pressed</button>
    </div>
  `},s={name:`Secondary — with icon`,render:()=>`
    <div style="display:flex;gap:1rem;align-items:center;padding:1rem;">
      <button type="button" class="uz-btn uz-btn--secondary uz-btn--md">
        <span>Continue</span>
        <svg class="uz-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `},c={name:`Tonal — all sizes`,render:()=>`
    <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;padding:1rem;">
      <button type="button" class="uz-btn uz-btn--tonal uz-btn--sm">Small</button>
      <button type="button" class="uz-btn uz-btn--tonal uz-btn--md">Regular</button>
      <button type="button" class="uz-btn uz-btn--tonal uz-btn--lg">Large</button>
      <button type="button" class="uz-btn uz-btn--tonal uz-btn--md uz-btn--pressed"
              tabindex="-1" aria-hidden="true">Pressed</button>
    </div>
  `},l={name:`All variants — comparison`,render:()=>`
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
  `},u={name:`Legacy — btn-primary (= Regular, mirrors uz-btn--md)`,render:()=>`
    <div style="max-width:22rem;padding:1rem;">
      <button type="button" class="btn-primary">Confirm</button>
    </div>
  `},d={name:`Action Buttons — all`,render:()=>`
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
  `},f={name:`Action Button — single`,render:()=>`
    <div style="padding:1rem;">
      <button class="action-button" type="button">
        <span class="action-button__circle">
          <svg class="action-button__icon" aria-hidden="true" focusable="false"><use href="#i-plus"/></svg>
        </span>
        <span class="action-button__label">Pay</span>
      </button>
    </div>
  `},n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: 'Configurable (use Controls ↓)',
  args: {
    label: 'Continue',
    variant: 'primary',
    size: 'md',
    block: false,
    withIcon: true
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Button label'
    },
    variant: {
      control: 'radio',
      options: ['primary', 'secondary', 'tonal'],
      description: 'Visual variant'
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Size'
    },
    block: {
      control: 'boolean',
      description: 'Full-width block'
    },
    withIcon: {
      control: 'boolean',
      description: 'Show trailing arrow icon'
    }
  },
  render: ({
    label,
    variant,
    size,
    block,
    withIcon
  }) => \`
    <div style="padding:1.5rem;\${block ? 'max-width:22rem;' : ''}">
      <button type="button" class="uz-btn uz-btn--\${variant} uz-btn--\${size}\${block ? ' uz-btn--block' : ''}">
        <span>\${label}</span>
        \${withIcon ? \`<svg class="uz-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>\` : ''}
      </button>
    </div>
  \`
}`,...n.parameters?.docs?.source}}},r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: 'Primary — all sizes',
  render: () => \`
    <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;padding:1rem;">
      <button type="button" class="uz-btn uz-btn--primary uz-btn--sm">Small</button>
      <button type="button" class="uz-btn uz-btn--primary uz-btn--md">Regular</button>
      <button type="button" class="uz-btn uz-btn--primary uz-btn--lg">Large</button>
      <button type="button" class="uz-btn uz-btn--primary uz-btn--md uz-btn--pressed"
              tabindex="-1" aria-hidden="true">Pressed</button>
    </div>
  \`
}`,...r.parameters?.docs?.source}}},i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: 'Primary — with icon',
  render: () => \`
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
  \`
}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  name: 'Primary — block (full width)',
  render: () => \`
    <div style="max-width:22rem;padding:1rem;">
      <button type="button" class="uz-btn uz-btn--primary uz-btn--md uz-btn--block">Confirm payment</button>
    </div>
  \`
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: 'Secondary — all sizes',
  render: () => \`
    <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;padding:1rem;">
      <button type="button" class="uz-btn uz-btn--secondary uz-btn--sm">Small</button>
      <button type="button" class="uz-btn uz-btn--secondary uz-btn--md">Regular</button>
      <button type="button" class="uz-btn uz-btn--secondary uz-btn--lg">Large</button>
      <button type="button" class="uz-btn uz-btn--secondary uz-btn--md uz-btn--pressed"
              tabindex="-1" aria-hidden="true">Pressed</button>
    </div>
  \`
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: 'Secondary — with icon',
  render: () => \`
    <div style="display:flex;gap:1rem;align-items:center;padding:1rem;">
      <button type="button" class="uz-btn uz-btn--secondary uz-btn--md">
        <span>Continue</span>
        <svg class="uz-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  \`
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: 'Tonal — all sizes',
  render: () => \`
    <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;padding:1rem;">
      <button type="button" class="uz-btn uz-btn--tonal uz-btn--sm">Small</button>
      <button type="button" class="uz-btn uz-btn--tonal uz-btn--md">Regular</button>
      <button type="button" class="uz-btn uz-btn--tonal uz-btn--lg">Large</button>
      <button type="button" class="uz-btn uz-btn--tonal uz-btn--md uz-btn--pressed"
              tabindex="-1" aria-hidden="true">Pressed</button>
    </div>
  \`
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: 'All variants — comparison',
  render: () => \`
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
  \`
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: 'Legacy — btn-primary (= Regular, mirrors uz-btn--md)',
  render: () => \`
    <div style="max-width:22rem;padding:1rem;">
      <button type="button" class="btn-primary">Confirm</button>
    </div>
  \`
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: 'Action Buttons — all',
  render: () => \`
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
  \`
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: 'Action Button — single',
  render: () => \`
    <div style="padding:1rem;">
      <button class="action-button" type="button">
        <span class="action-button__circle">
          <svg class="action-button__icon" aria-hidden="true" focusable="false"><use href="#i-plus"/></svg>
        </span>
        <span class="action-button__label">Pay</span>
      </button>
    </div>
  \`
}`,...f.parameters?.docs?.source}}},p=[`Configurable`,`PrimaryAllSizes`,`PrimaryWithIcon`,`PrimaryBlock`,`SecondaryAllSizes`,`SecondaryWithIcon`,`TonalAllSizes`,`AllVariants`,`LegacyBtnPrimary`,`ActionButtons`,`ActionButtonSingle`]}))();export{f as ActionButtonSingle,d as ActionButtons,l as AllVariants,n as Configurable,u as LegacyBtnPrimary,r as PrimaryAllSizes,a as PrimaryBlock,i as PrimaryWithIcon,o as SecondaryAllSizes,s as SecondaryWithIcon,c as TonalAllSizes,p as __namedExportsOrder,t as default};