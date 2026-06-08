import{n as e}from"./chunk-DnJy8xQt.js";function t(e){let t=e.querySelector(`.expander`),n=e.querySelector(`[data-expander-panel]`);!t||!n||t.addEventListener(`click`,()=>{let e=t.getAttribute(`aria-expanded`)===`true`;t.setAttribute(`aria-expanded`,e?`false`:`true`),n.hidden=e})}var n,r,i;e((()=>{n={title:`Live/Components/Expander`},r={name:`Further options (toggle)`,render:()=>`
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
  `,play:async({canvasElement:e})=>{t(e)}},r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: 'Further options (toggle)',
  render: () => \`
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
  \`,
  play: async ({
    canvasElement
  }) => {
    bindExpander(canvasElement);
  }
}`,...r.parameters?.docs?.source}}},i=[`FurtherOptions`]}))();export{r as FurtherOptions,i as __namedExportsOrder,n as default};