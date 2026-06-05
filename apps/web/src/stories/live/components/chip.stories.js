export default {
  title: 'Live/Components/Chip',
};

export const StatusChips = {
  name: 'Status chips (static)',
  render: () => `
    <div style="padding:1.5rem;display:flex;flex-wrap:wrap;gap:1rem;align-items:center;">
      <span class="chip chip--sm">
        <svg class="chip__icon" aria-hidden="true" focusable="false"><use href="#i-clock"/></svg>
        <span class="chip__label">Pending</span>
      </span>
      <span class="chip chip--sm">
        <svg class="chip__icon" aria-hidden="true" focusable="false"><use href="#i-check"/></svg>
        <span class="chip__label">Executed</span>
      </span>
    </div>
  `,
};
