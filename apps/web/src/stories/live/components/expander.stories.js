export default {
  title: 'Live/Components/Expander',
};

function bindExpander(canvas) {
  const btn = canvas.querySelector('.expander');
  const panel = canvas.querySelector('[data-expander-panel]');
  if (!btn || !panel) return;
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    panel.hidden = open;
  });
}

export const FurtherOptions = {
  name: 'Further options (toggle)',
  render: () => `
    <div style="padding:1.5rem;max-width:22rem;">
      <button class="expander" type="button" aria-expanded="false">
        <span class="expander__label">Further options</span>
        <svg class="expander__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-down"/></svg>
      </button>
      <div class="payment-details__further-content" data-expander-panel hidden style="margin-top:0.75rem;">
        <div class="payment-details__message-row">
          <span class="payment-details__info-label">Message</span>
          <span class="payment-details__info-value">Monthly rent</span>
        </div>
      </div>
    </div>
  `,
  play: async ({ canvasElement }) => {
    bindExpander(canvasElement);
  },
};
