import{n as e}from"./chunk-DnJy8xQt.js";var t,n,r;e((()=>{t={title:`Pages/Payment Flow/Type Ahead Search Active`,parameters:{layout:`fullscreen`}},n={name:`Implementation`,parameters:{layout:`fullscreen`},render:()=>`
    <div class="modal-overlay modal-overlay--active" style="position:relative;min-height:600px;">
      <div class="modal-shell">
        <div class="modal modal--recipient-search-active">
          <div class="modal__nav">
            <button class="modal__back modal__back--hidden" type="button">
              <svg class="modal__back-icon" role="img" aria-label="Back" focusable="false"><use href="#i-arrow-left"/></svg>
            </button>
            <span class="modal__title">Recipient</span>
            <div class="modal__nav-search" role="search">
              <div class="recipient-search__field-wrap">
                <span class="recipient-search__icon" aria-hidden="true">
                  <svg class="recipient-search__icon-svg" focusable="false"><use href="#i-search"/></svg>
                </span>
                <input class="recipient-search__input" type="search" autocomplete="off"
                  placeholder="Enter IBAN, name or account number" aria-label="Search recipients" />
                <button type="button" class="recipient-search__clear recipient-search__clear--hidden" aria-label="Clear">
                  <svg class="recipient-search__clear-icon" aria-hidden="true" focusable="false"><use href="#i-x-circle"/></svg>
                </button>
              </div>
            </div>
            <button class="modal__close" type="button">
              <svg class="modal__close-icon" role="img" aria-label="Close" focusable="false"><use href="#i-x"/></svg>
            </button>
          </div>
          <div class="modal__body">
            <div class="modal__step modal__step--active" data-step="recipient-search">
              <div class="recipient-search">
                <p class="recipient-search__heading">Recommended recipients</p>
                <div class="recipient-search__list" role="listbox" aria-label="Recipients">
                  <button class="recipient-search__result" type="button" role="option">
                    <span class="recipient-search__result-icon">
                      <svg style="width:1.5rem;height:1.5rem;" aria-hidden="true" focusable="false"><use href="#i-user"/></svg>
                    </span>
                    <span class="recipient-search__result-body">
                      <span class="recipient-search__result-name">Anna Müller</span>
                      <span class="recipient-search__result-iban">CH35 0900 0000 1234 5678 9</span>
                    </span>
                  </button>
                  <button class="recipient-search__result" type="button" role="option">
                    <span class="recipient-search__result-icon">
                      <svg style="width:1.5rem;height:1.5rem;" aria-hidden="true" focusable="false"><use href="#i-sunrise-logo"/></svg>
                    </span>
                    <span class="recipient-search__result-body">
                      <span class="recipient-search__result-name">Sunrise</span>
                      <span class="recipient-search__result-iban">CH35 0900 0000 9876 5432 1</span>
                    </span>
                  </button>
                  <button class="recipient-search__result" type="button" role="option">
                    <span class="recipient-search__result-icon">
                      <svg style="width:1.5rem;height:1.5rem;" aria-hidden="true" focusable="false"><use href="#i-user"/></svg>
                    </span>
                    <span class="recipient-search__result-body">
                      <span class="recipient-search__result-name">Hans Meyer</span>
                      <span class="recipient-search__result-iban">CH35 0900 0000 2560 0696 0</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `},n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: 'Implementation',
  parameters: {
    layout: 'fullscreen'
  },
  render: () => \`
    <div class="modal-overlay modal-overlay--active" style="position:relative;min-height:600px;">
      <div class="modal-shell">
        <div class="modal modal--recipient-search-active">
          <div class="modal__nav">
            <button class="modal__back modal__back--hidden" type="button">
              <svg class="modal__back-icon" role="img" aria-label="Back" focusable="false"><use href="#i-arrow-left"/></svg>
            </button>
            <span class="modal__title">Recipient</span>
            <div class="modal__nav-search" role="search">
              <div class="recipient-search__field-wrap">
                <span class="recipient-search__icon" aria-hidden="true">
                  <svg class="recipient-search__icon-svg" focusable="false"><use href="#i-search"/></svg>
                </span>
                <input class="recipient-search__input" type="search" autocomplete="off"
                  placeholder="Enter IBAN, name or account number" aria-label="Search recipients" />
                <button type="button" class="recipient-search__clear recipient-search__clear--hidden" aria-label="Clear">
                  <svg class="recipient-search__clear-icon" aria-hidden="true" focusable="false"><use href="#i-x-circle"/></svg>
                </button>
              </div>
            </div>
            <button class="modal__close" type="button">
              <svg class="modal__close-icon" role="img" aria-label="Close" focusable="false"><use href="#i-x"/></svg>
            </button>
          </div>
          <div class="modal__body">
            <div class="modal__step modal__step--active" data-step="recipient-search">
              <div class="recipient-search">
                <p class="recipient-search__heading">Recommended recipients</p>
                <div class="recipient-search__list" role="listbox" aria-label="Recipients">
                  <button class="recipient-search__result" type="button" role="option">
                    <span class="recipient-search__result-icon">
                      <svg style="width:1.5rem;height:1.5rem;" aria-hidden="true" focusable="false"><use href="#i-user"/></svg>
                    </span>
                    <span class="recipient-search__result-body">
                      <span class="recipient-search__result-name">Anna Müller</span>
                      <span class="recipient-search__result-iban">CH35 0900 0000 1234 5678 9</span>
                    </span>
                  </button>
                  <button class="recipient-search__result" type="button" role="option">
                    <span class="recipient-search__result-icon">
                      <svg style="width:1.5rem;height:1.5rem;" aria-hidden="true" focusable="false"><use href="#i-sunrise-logo"/></svg>
                    </span>
                    <span class="recipient-search__result-body">
                      <span class="recipient-search__result-name">Sunrise</span>
                      <span class="recipient-search__result-iban">CH35 0900 0000 9876 5432 1</span>
                    </span>
                  </button>
                  <button class="recipient-search__result" type="button" role="option">
                    <span class="recipient-search__result-icon">
                      <svg style="width:1.5rem;height:1.5rem;" aria-hidden="true" focusable="false"><use href="#i-user"/></svg>
                    </span>
                    <span class="recipient-search__result-body">
                      <span class="recipient-search__result-name">Hans Meyer</span>
                      <span class="recipient-search__result-iban">CH35 0900 0000 2560 0696 0</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  \`
}`,...n.parameters?.docs?.source}}},r=[`Implementation`]}))();export{n as Implementation,r as __namedExportsOrder,t as default};