import{n as e}from"./chunk-DnJy8xQt.js";var t,n,r,i,a,o;e((()=>{t={title:`Components/Dialog`,parameters:{docs:{description:{component:"Post-payment confirmation sheet. Same structure as the live payment overlay (`confirmation-dialog` + `uz-btn` primary Regular block)."}}}},n=`padding:2rem;min-height:26rem;background:#ebebeb;box-sizing:border-box;display:flex;justify-content:center;align-items:flex-start;`,r=`max-width:21.4375rem;width:100%;`,i={name:`Dialog Confirmation — mobile card`,parameters:{viewport:{defaultViewport:`mobile1`},docs:{description:{story:"Isolated card at **343px** max width on a grey studio background (Figma `207:82098`). Toggle **Theme** in the toolbar for light/dark token behaviour."}}},render:()=>`
    <div style="${n}">
      <div class="confirmation-dialog" style="${r}">
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
  `},a={name:`Dialog Confirmation — visible overlay`,parameters:{viewport:{defaultViewport:`mobile1`},docs:{description:{story:"Uses `confirmation-overlay confirmation-overlay--visible` as in the app after a successful payment."}}},render:()=>`
    <div style="position:relative;min-height:28rem;background:var(--color-bg-secondary);border-radius:var(--radius-regular);overflow:hidden;">
      <div class="confirmation-overlay confirmation-overlay--visible" style="position:absolute;">
        <div class="confirmation-dialog" style="${r}">
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
  `},i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: 'Dialog Confirmation — mobile card',
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Isolated card at **343px** max width on a grey studio background (Figma \`207:82098\`). Toggle **Theme** in the toolbar for light/dark token behaviour.'
      }
    }
  },
  render: () => \`
    <div style="\${STUDIO_SHELF}">
      <div class="confirmation-dialog" style="\${CARD_MAX}">
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
  \`
}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  name: 'Dialog Confirmation — visible overlay',
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Uses \`confirmation-overlay confirmation-overlay--visible\` as in the app after a successful payment.'
      }
    }
  },
  render: () => \`
    <div style="position:relative;min-height:28rem;background:var(--color-bg-secondary);border-radius:var(--radius-regular);overflow:hidden;">
      <div class="confirmation-overlay confirmation-overlay--visible" style="position:absolute;">
        <div class="confirmation-dialog" style="\${CARD_MAX}">
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
  \`
}`,...a.parameters?.docs?.source},description:{story:`Same UI inside the real overlay chrome (scrim + enter animation class).`,...a.parameters?.docs?.description}}},o=[`DialogConfirmationMobileCard`,`DialogConfirmationVisibleOverlay`]}))();export{i as DialogConfirmationMobileCard,a as DialogConfirmationVisibleOverlay,o as __namedExportsOrder,t as default};