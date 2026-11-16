import{n as e}from"./chunk-DnJy8xQt.js";function t(e){let t=e.querySelector(`.segmented--theme`);t&&t.addEventListener(`click`,e=>{let n=e.target.closest(`.segmented__option`);if(!n||!t.contains(n))return;let r=n.getAttribute(`data-set-theme`);r!==`light`&&r!==`dark`||(typeof window.UZBankApplyTheme==`function`?window.UZBankApplyTheme(r):document.documentElement.setAttribute(`data-theme`,r),t.querySelectorAll(`.segmented__option`).forEach(e=>{e.classList.toggle(`segmented__option--active`,e===n)}))})}var n,r,i;e((()=>{n={title:`Live/Components/Segmented control`},r={name:`Theme toggle (Light / Dark)`,render:()=>`
    <div style="padding:1.5rem;">
      <div class="segmented segmented--theme" role="group" aria-label="Theme">
        <button type="button" class="segmented__option" data-set-theme="light">Light</button>
        <button type="button" class="segmented__option segmented__option--active" data-set-theme="dark">Dark</button>
      </div>
    </div>
  `,play:async({canvasElement:e})=>{t(e)}},r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: 'Theme toggle (Light / Dark)',
  render: () => \`
    <div style="padding:1.5rem;">
      <div class="segmented segmented--theme" role="group" aria-label="Theme">
        <button type="button" class="segmented__option" data-set-theme="light">Light</button>
        <button type="button" class="segmented__option segmented__option--active" data-set-theme="dark">Dark</button>
      </div>
    </div>
  \`,
  play: async ({
    canvasElement
  }) => {
    bindThemeSegmented(canvasElement);
  }
}`,...r.parameters?.docs?.source}}},i=[`ThemeToggle`]}))();export{r as ThemeToggle,i as __namedExportsOrder,n as default};