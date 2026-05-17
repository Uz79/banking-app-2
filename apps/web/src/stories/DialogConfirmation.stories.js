/**
 * Dialog Confirmation — payment success sheet.
 *
 * Figma (Desktop MCP, node `207:82098` “Dialog Confirmation - mobile”):
 * - White card, 8px radius, hairline separator border
 * - Header: 44×44 success mark (stroke circle + check)
 * - Body: centred lines — amount line uses bold sum; date line bold date
 * - Footer action: full-width primary “Done”
 *
 * Markup and classes match `payments.html` / `payment-overlay.js` targets.
 */

export default {
  title: 'Components/Confirmation',
  parameters: {
    docs: {
      description: {
        component:
          'Post-payment confirmation sheet. Same structure as the live payment overlay (`confirmation-dialog` + `uz-btn` primary Regular block).',
      },
    },
  },
};

/** Studio shelf (neutral grey) so the white card reads like the Figma frame. */
const STUDIO_SHELF =
  'padding:2rem;min-height:26rem;background:#ebebeb;box-sizing:border-box;display:flex;justify-content:center;align-items:flex-start;';

/** Figma mobile frame width 343px → 21.4375rem at 16px root. */
const CARD_MAX = 'max-width:21.4375rem;width:100%;';

export const DialogConfirmationMobileCard = {
  name: 'Dialog Confirmation — mobile card',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        story:
          'Isolated card at **343px** max width on a grey studio background (Figma `207:82098`). Toggle **Theme** in the toolbar for light/dark token behaviour.',
      },
    },
  },
  render: () => `
    <div style="${STUDIO_SHELF}">
      <div class="confirmation-dialog" style="${CARD_MAX}">
        <div class="confirmation-dialog__icon" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="22" stroke="currentColor" stroke-width="2"/>
            <path d="M15 24L21 30L33 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="confirmation-dialog__text">Your payment of</span>
        <div class="confirmation-dialog__amount">
          <span class="confirmation-dialog__currency">CHF</span>
          <span class="confirmation-dialog__sum">500.00</span>
        </div>
        <div class="confirmation-dialog__recipient">
          <span>to</span>
          <span class="confirmation-dialog__recipient-name">Hans Meyer</span>
        </div>
        <span class="confirmation-dialog__footer">will be executed with sufficient credit on</span>
        <span class="confirmation-dialog__date">31.05.2026</span>
        <button class="uz-btn uz-btn--primary uz-btn--md uz-btn--block" type="button" data-action="done">Done</button>
      </div>
    </div>
  `,
};

/** Same UI inside the real overlay chrome (scrim + enter animation class). */
export const DialogConfirmationVisibleOverlay = {
  name: 'Dialog Confirmation — visible overlay',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        story:
          'Uses `confirmation-overlay confirmation-overlay--visible` as in the app after a successful payment.',
      },
    },
  },
  render: () => `
    <div style="position:relative;min-height:28rem;background:var(--color-bg-secondary);border-radius:var(--radius-regular);overflow:hidden;">
      <div class="confirmation-overlay confirmation-overlay--visible" style="position:absolute;">
        <div class="confirmation-dialog" style="${CARD_MAX}">
          <div class="confirmation-dialog__icon" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="22" stroke="currentColor" stroke-width="2"/>
              <path d="M15 24L21 30L33 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="confirmation-dialog__text">Your payment of</span>
          <div class="confirmation-dialog__amount">
            <span class="confirmation-dialog__currency">CHF</span>
            <span class="confirmation-dialog__sum">500.00</span>
          </div>
          <div class="confirmation-dialog__recipient">
            <span>to</span>
            <span class="confirmation-dialog__recipient-name">Hans Meyer</span>
          </div>
          <span class="confirmation-dialog__footer">will be executed with sufficient credit on</span>
          <span class="confirmation-dialog__date">31.05.2026</span>
          <button class="uz-btn uz-btn--primary uz-btn--md uz-btn--block" type="button" data-action="done">Done</button>
        </div>
      </div>
    </div>
  `,
};
