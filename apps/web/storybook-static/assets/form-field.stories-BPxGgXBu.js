import{n as e}from"./chunk-DnJy8xQt.js";function t(e){let t=e.querySelector(`.form-field__text-wrap`);if(!t)return;let n=t.querySelector(`.form-field__input`),r=t.querySelector(`.form-field__clear`);if(!n||!r)return;function i(){let e=!n.value.trim();r.classList.toggle(`form-field__clear--hidden`,e)}n.addEventListener(`input`,i),r.addEventListener(`click`,()=>{n.value=``,n.focus(),i()}),i()}var n,r,i;e((()=>{n={title:`Live/Components/Form field`},r={name:`Text input — clear button`,render:()=>`
    <div style="padding:1rem;max-width:28rem;">
      <div class="form-field">
        <label class="form-field__label" for="live-recipient">Recipient name</label>
        <div class="form-field__text-wrap">
          <input class="form-field__input" id="live-recipient" type="text" value="Hans Meyer" />
          <button type="button" class="form-field__clear" aria-label="Clear Recipient name">
            <svg class="form-field__clear-icon" aria-hidden="true" focusable="false"><use href="#i-x-circle"/></svg>
          </button>
        </div>
      </div>
    </div>
  `,play:async({canvasElement:e})=>{t(e)}},r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: 'Text input — clear button',
  render: () => \`
    <div style="padding:1rem;max-width:28rem;">
      <div class="form-field">
        <label class="form-field__label" for="live-recipient">Recipient name</label>
        <div class="form-field__text-wrap">
          <input class="form-field__input" id="live-recipient" type="text" value="Hans Meyer" />
          <button type="button" class="form-field__clear" aria-label="Clear Recipient name">
            <svg class="form-field__clear-icon" aria-hidden="true" focusable="false"><use href="#i-x-circle"/></svg>
          </button>
        </div>
      </div>
    </div>
  \`,
  play: async ({
    canvasElement
  }) => {
    bindClear(canvasElement);
  }
}`,...r.parameters?.docs?.source}}},i=[`TextInputWithClear`]}))();export{r as TextInputWithClear,i as __namedExportsOrder,n as default};