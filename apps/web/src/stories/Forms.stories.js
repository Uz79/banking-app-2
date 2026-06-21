export default {
  title: 'Live/Components/Form field',
};

// ─── Form Field: text input ───────────────────────────────────────────────────

export const FormFieldTextInput = {
  name: 'Form Field — text input',
  render: () => `
    <div style="padding:1rem;max-width:28rem;">
      <div class="form-field">
        <label class="form-field__label" for="sb-recipient-name">Recipient name</label>
        <div class="form-field__text-wrap">
          <input class="form-field__input" id="sb-recipient-name" type="text" value="Hans Meyer" />
          <button type="button" class="form-field__clear" aria-label="Clear Recipient name">
            <svg class="form-field__clear-icon" aria-hidden="true" focusable="false"><use href="#i-x-circle"/></svg>
          </button>
        </div>
      </div>
    </div>
  `,
};

export const FormFieldTextInputEmpty = {
  name: 'Form Field — text input (empty / placeholder)',
  render: () => `
    <div style="padding:1rem;max-width:28rem;">
      <div class="form-field">
        <label class="form-field__label" for="sb-street">Street and number</label>
        <div class="form-field__text-wrap">
          <input class="form-field__input" id="sb-street" type="text" placeholder="e.g. Main Street 23" />
          <button type="button" class="form-field__clear form-field__clear--hidden" aria-label="Clear">
            <svg class="form-field__clear-icon" aria-hidden="true" focusable="false"><use href="#i-x-circle"/></svg>
          </button>
        </div>
      </div>
    </div>
  `,
};

// ─── Form Field: read-only value with edit ────────────────────────────────────

export const FormFieldReadOnly = {
  name: 'Form Field — read-only value + edit',
  render: () => `
    <div style="padding:1rem;max-width:28rem;display:flex;flex-direction:column;gap:var(--space-3);">
      <div class="form-field form-field--readonly">
        <span class="form-field__label">IBAN</span>
        <div class="form-field__row">
          <span class="form-field__value">CH35 0900 0000 2560 0696 0</span>
          <button class="form-field__edit" type="button" aria-label="Change IBAN">
            <svg class="form-field__edit-icon" aria-hidden="true" focusable="false"><use href="#i-edit-2"/></svg>
          </button>
        </div>
      </div>
    </div>
  `,
};

export const FormFieldReadOnlyNoEdit = {
  name: 'Form Field — read-only value (no edit)',
  render: () => `
    <div style="padding:1rem;max-width:28rem;display:flex;flex-direction:column;gap:var(--space-3);">
      <div class="form-field form-field--readonly">
        <span class="form-field__label">Bank Name</span>
        <div class="form-field__row">
          <span class="form-field__value">UBS</span>
        </div>
      </div>
    </div>
  `,
};

// ─── Form Field: date row with calendar icon ──────────────────────────────────

export const FormFieldDate = {
  name: 'Form Field — date with calendar icon',
  render: () => `
    <div style="padding:1rem;max-width:28rem;">
      <div class="form-field">
        <span class="form-field__label">Execute on</span>
        <div class="form-field__date-wrap">
          <span class="form-field__value">31.05.2026</span>
          <svg class="form-field__calendar-icon" aria-hidden="true" focusable="false"><use href="#i-calendar"/></svg>
        </div>
      </div>
    </div>
  `,
};

// ─── Form Field: select ───────────────────────────────────────────────────────

export const FormFieldSelect = {
  name: 'Form Field — select (country)',
  render: () => `
    <div style="padding:1rem;max-width:28rem;">
      <div class="form-field">
        <label class="form-field__label" for="sb-country">Country</label>
        <div class="form-field__select-wrap">
          <select class="form-field__select" id="sb-country" name="country">
            <option value="CH" selected>Switzerland</option>
            <option value="LI">Liechtenstein</option>
            <option value="DE">Germany</option>
            <option value="AT">Austria</option>
            <option value="FR">France</option>
            <option value="IT">Italy</option>
          </select>
          <span class="form-field__select-icon" aria-hidden="true">
            <svg class="form-field__select-chevron" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#i-chevron-down"/></svg>
          </span>
        </div>
      </div>
    </div>
  `,
};

// ─── Amount Input ─────────────────────────────────────────────────────────────

export const AmountInput = {
  name: 'Amount Input',
  render: () => `
    <div style="padding:1rem;max-width:28rem;">
      <div class="form-field">
        <span class="form-field__label">Amount</span>
        <div class="amount-input">
          <span class="amount-input__currency">
            <span>CHF</span>
            <svg class="amount-input__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-down"/></svg>
          </span>
          <input class="amount-input__value" type="text" value="500.00" />
          <button type="button" class="amount-input__clear" aria-label="Clear amount">
            <svg class="amount-input__clear-icon" aria-hidden="true" focusable="false"><use href="#i-x-circle"/></svg>
          </button>
        </div>
      </div>
    </div>
  `,
};

export const AmountInputEmpty = {
  name: 'Amount Input — empty',
  render: () => `
    <div style="padding:1rem;max-width:28rem;">
      <div class="form-field">
        <span class="form-field__label">Amount</span>
        <div class="amount-input">
          <span class="amount-input__currency">
            <span>CHF</span>
            <svg class="amount-input__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-down"/></svg>
          </span>
          <input class="amount-input__value" type="text" placeholder="0.00" />
          <button type="button" class="amount-input__clear amount-input__clear--hidden" aria-label="Clear amount">
            <svg class="amount-input__clear-icon" aria-hidden="true" focusable="false"><use href="#i-x-circle"/></svg>
          </button>
        </div>
      </div>
    </div>
  `,
};

// ─── Debit Account ────────────────────────────────────────────────────────────

export const DebitAccount = {
  name: 'Debit Account selector',
  render: () => `
    <div style="padding:1rem;max-width:28rem;">
      <div class="form-field">
        <span class="form-field__label">Debit account</span>
        <div class="debit-account">
          <svg class="debit-account__icon" aria-hidden="true" focusable="false"><use href="#i-home"/></svg>
          <div class="debit-account__info">
            <span class="debit-account__name">Household</span>
            <span class="debit-account__iban">CH35 0900 0000 2470 2920 1</span>
          </div>
          <div class="debit-account__end">
            <span class="debit-account__amount">
              <span class="debit-account__amount-currency">CHF</span>
              <span class="debit-account__amount-value">10'570.00</span>
            </span>
            <svg class="debit-account__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-down"/></svg>
          </div>
        </div>
      </div>
    </div>
  `,
};

// ─── Toggle Row ───────────────────────────────────────────────────────────────

export const ToggleRowOn = {
  name: 'Toggle Row — on',
  render: () => `
    <div style="padding:1rem;max-width:28rem;">
      <div class="toggle-row">
        <span class="toggle-row__label">As soon as possible</span>
        <button class="toggle toggle--active" type="button" aria-pressed="true">
          <span class="toggle__thumb toggle__thumb--active"></span>
        </button>
      </div>
    </div>
  `,
};

export const ToggleRowOff = {
  name: 'Toggle Row — off',
  render: () => `
    <div style="padding:1rem;max-width:28rem;">
      <div class="toggle-row">
        <span class="toggle-row__label">As soon as possible</span>
        <button class="toggle" type="button" aria-pressed="false">
          <span class="toggle__thumb"></span>
        </button>
      </div>
    </div>
  `,
};

// ─── Recipient Search ─────────────────────────────────────────────────────────

export const RecipientSearchField = {
  name: 'Recipient Search — field',
  render: () => `
    <div style="padding:1rem;max-width:28rem;">
      <div class="recipient-search__field-wrap">
        <span class="recipient-search__icon" aria-hidden="true">
          <svg class="recipient-search__icon-svg" focusable="false"><use href="#i-search"/></svg>
        </span>
        <input class="recipient-search__input" type="search" autocomplete="off"
          placeholder="Enter IBAN, name or account number" aria-label="Search recipients" />
        <button type="button" class="recipient-search__clear recipient-search__clear--hidden" aria-label="Clear search">
          <svg class="recipient-search__clear-icon" aria-hidden="true" focusable="false"><use href="#i-x-circle"/></svg>
        </button>
      </div>
    </div>
  `,
};

export const RecipientSearchFieldActive = {
  name: 'Recipient Search — field (with value + clear)',
  render: () => `
    <div style="padding:1rem;max-width:28rem;">
      <div class="recipient-search__field-wrap">
        <span class="recipient-search__icon" aria-hidden="true">
          <svg class="recipient-search__icon-svg" focusable="false"><use href="#i-search"/></svg>
        </span>
        <input class="recipient-search__input" type="search" autocomplete="off"
          value="Hans" aria-label="Search recipients" />
        <button type="button" class="recipient-search__clear" aria-label="Clear search">
          <svg class="recipient-search__clear-icon" aria-hidden="true" focusable="false"><use href="#i-x-circle"/></svg>
        </button>
      </div>
    </div>
  `,
};

export const RecipientSearchResults = {
  name: 'Recipient Search — with results',
  render: () => `
    <div style="padding:1rem;max-width:28rem;">
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
  `,
};

// ─── Recipient Form (step 1) ──────────────────────────────────────────────────

export const RecipientForm = {
  name: 'Payment Form — Recipient step',
  render: () => `
    <div style="padding:1rem;max-width:28rem;">
      <div class="form">
        <div class="form-field">
          <span class="form-field__label">IBAN</span>
          <div class="form-field__row">
            <span class="form-field__value">CH35 0900 0000 2560 0696 0</span>
            <button class="form-field__edit" type="button" aria-label="Change IBAN">
              <svg class="form-field__edit-icon" aria-hidden="true" focusable="false"><use href="#i-edit-2"/></svg>
            </button>
          </div>
        </div>
        <div class="form-field">
          <span class="form-field__label">Bank Name</span>
          <div class="form-field__row">
            <span class="form-field__value">UBS</span>
          </div>
        </div>
        <div class="form-field">
          <label class="form-field__label" for="sb-name">Recipient name</label>
          <div class="form-field__text-wrap">
            <input class="form-field__input" id="sb-name" type="text" value="Hans Meyer" />
            <button type="button" class="form-field__clear form-field__clear--hidden" aria-label="Clear">
              <svg class="form-field__clear-icon" aria-hidden="true" focusable="false"><use href="#i-x-circle"/></svg>
            </button>
          </div>
        </div>
        <div class="form-field">
          <label class="form-field__label" for="sb-street2">Street and number</label>
          <div class="form-field__text-wrap">
            <input class="form-field__input" id="sb-street2" type="text" value="Main Street 23" />
            <button type="button" class="form-field__clear form-field__clear--hidden" aria-label="Clear">
              <svg class="form-field__clear-icon" aria-hidden="true" focusable="false"><use href="#i-x-circle"/></svg>
            </button>
          </div>
        </div>
        <div class="form-field">
          <label class="form-field__label" for="sb-city">City and postal code</label>
          <div class="form-field__text-wrap">
            <input class="form-field__input" id="sb-city" type="text" value="8001 Zürich" />
            <button type="button" class="form-field__clear form-field__clear--hidden" aria-label="Clear">
              <svg class="form-field__clear-icon" aria-hidden="true" focusable="false"><use href="#i-x-circle"/></svg>
            </button>
          </div>
        </div>
        <div class="form-field">
          <label class="form-field__label" for="sb-country2">Country</label>
          <div class="form-field__select-wrap">
            <select class="form-field__select" id="sb-country2" name="country">
              <option value="CH" selected>Switzerland</option>
              <option value="DE">Germany</option>
              <option value="AT">Austria</option>
              <option value="FR">France</option>
            </select>
            <span class="form-field__select-icon" aria-hidden="true">
              <svg class="form-field__select-chevron" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#i-chevron-down"/></svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
};

// ─── Internal Account Transfer — Amount & recipient (step 1) ────────────────

export const IATAmountRecipientForm = {
  name: 'IAT Form — Amount & recipient step',
  render: () => `
    <div style="padding:1rem;max-width:28rem;">
      <div class="form">
        <p class="iat-intro">I want to transfer internally</p>
        <div class="form-field">
          <span class="form-field__label">Amount</span>
          <div class="amount-input">
            <span class="amount-input__currency">
              <span>CHF</span>
              <svg class="amount-input__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-down"/></svg>
            </span>
            <input class="amount-input__value" type="text" value="500.00" />
            <button type="button" class="amount-input__clear amount-input__clear--hidden" aria-label="Clear amount">
              <svg class="amount-input__clear-icon" aria-hidden="true" focusable="false"><use href="#i-x-circle"/></svg>
            </button>
          </div>
        </div>
        <div class="form-field">
          <span class="form-field__label">from</span>
          <div class="debit-account">
            <svg class="debit-account__icon" aria-hidden="true" focusable="false"><use href="#i-home"/></svg>
            <div class="debit-account__info">
              <span class="debit-account__name">Household</span>
              <span class="debit-account__iban">CH35 0900 0000 2470 2920 1</span>
            </div>
            <div class="debit-account__end">
              <span class="debit-account__amount">
                <span class="debit-account__amount-currency">CHF</span>
                <span class="debit-account__amount-value">10'000.00</span>
              </span>
              <svg class="debit-account__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-down"/></svg>
            </div>
          </div>
        </div>
        <div class="form-field">
          <span class="form-field__label">to</span>
          <div class="debit-account">
            <svg class="debit-account__icon" aria-hidden="true" focusable="false"><use href="#i-anchor"/></svg>
            <div class="debit-account__info">
              <span class="debit-account__name">Savings Account</span>
              <span class="debit-account__iban">CH35 0900 0000 2470 2920 2</span>
            </div>
            <div class="debit-account__end">
              <span class="debit-account__amount">
                <span class="debit-account__amount-currency">CHF</span>
                <span class="debit-account__amount-value">25'000.00</span>
              </span>
              <svg class="debit-account__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-down"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
};

// ─── Amount Form (step 2) ─────────────────────────────────────────────────────

export const AmountForm = {
  name: 'Payment Form — Amount step',
  render: () => `
    <div style="padding:1rem;max-width:28rem;">
      <div class="form">
        <div class="form-field">
          <span class="form-field__label">Recipient</span>
          <div class="form-field__row">
            <span class="form-field__value">Hans Meyer</span>
            <button class="form-field__edit" type="button" data-payment-nav="recipient" aria-label="Edit recipient">
              <svg class="form-field__edit-icon" aria-hidden="true" focusable="false"><use href="#i-edit-2"/></svg>
            </button>
          </div>
        </div>
        <div class="form-field">
          <span class="form-field__label">Amount</span>
          <div class="amount-input">
            <span class="amount-input__currency">
              <span>CHF</span>
              <svg class="amount-input__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-down"/></svg>
            </span>
            <input class="amount-input__value" type="text" value="500.00" />
            <button type="button" class="amount-input__clear" aria-label="Clear amount">
              <svg class="amount-input__clear-icon" aria-hidden="true" focusable="false"><use href="#i-x-circle"/></svg>
            </button>
          </div>
        </div>
        <div class="form-field">
          <span class="form-field__label">Debit account</span>
          <div class="debit-account">
            <svg class="debit-account__icon" aria-hidden="true" focusable="false"><use href="#i-home"/></svg>
            <div class="debit-account__info">
              <span class="debit-account__name">Household</span>
              <span class="debit-account__iban">CH35 0900 0000 2470 2920 1</span>
            </div>
            <div class="debit-account__end">
              <span class="debit-account__amount">
                <span class="debit-account__amount-currency">CHF</span>
                <span class="debit-account__amount-value">10'570.00</span>
              </span>
              <svg class="debit-account__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-down"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
};

// ─── Schedule Form (step 3) ───────────────────────────────────────────────────

export const ScheduleForm = {
  name: 'Payment Form — Schedule step',
  render: () => `
    <div style="padding:1rem;max-width:28rem;">
      <div class="form">
        <div class="form-field">
          <span class="form-field__label">Recipient</span>
          <div class="form-field__row">
            <span class="form-field__value">Hans Meyer</span>
            <button class="form-field__edit" type="button" data-payment-nav="recipient" aria-label="Edit recipient">
              <svg class="form-field__edit-icon" aria-hidden="true" focusable="false"><use href="#i-edit-2"/></svg>
            </button>
          </div>
        </div>
        <div class="segmented">
          <button class="segmented__option segmented__option--active" type="button">Single</button>
          <button class="segmented__option" type="button">Recurring</button>
          <button class="segmented__option" type="button">Standing order</button>
        </div>
        <div class="toggle-row">
          <span class="toggle-row__label">As soon as possible</span>
          <button class="toggle toggle--active" type="button" aria-pressed="true">
            <span class="toggle__thumb toggle__thumb--active"></span>
          </button>
        </div>
        <div class="form-field">
          <span class="form-field__label">Execute on</span>
          <div class="form-field__date-wrap">
            <span class="form-field__value">31.05.2026</span>
            <svg class="form-field__calendar-icon" aria-hidden="true" focusable="false"><use href="#i-calendar"/></svg>
          </div>
        </div>
      </div>
    </div>
  `,
};

// ─── Summary Form (step 4) ────────────────────────────────────────────────────

export const SummaryForm = {
  name: 'Payment Form — Summary step',
  render: () => `
    <div style="padding:1rem;max-width:28rem;">
      <div class="form">
        <div class="form-field">
          <span class="form-field__label">Amount</span>
          <div class="form-field__row">
            <span class="form-field__value">CHF&nbsp;&nbsp;500.00</span>
            <button class="form-field__edit" type="button" aria-label="Edit">
              <svg class="form-field__edit-icon" aria-hidden="true" focusable="false"><use href="#i-edit-2"/></svg>
            </button>
          </div>
        </div>
        <div class="form-field">
          <span class="form-field__label">Execute on</span>
          <div class="form-field__row">
            <span class="form-field__value">31.05.2026</span>
            <button class="form-field__edit" type="button" aria-label="Edit">
              <svg class="form-field__edit-icon" aria-hidden="true" focusable="false"><use href="#i-edit-2"/></svg>
            </button>
          </div>
        </div>
        <div class="form-field">
          <span class="form-field__label">Recipient</span>
          <div class="form-field__row">
            <span class="form-field__value">Hans Meyer</span>
            <button class="form-field__edit" type="button" aria-label="Edit">
              <svg class="form-field__edit-icon" aria-hidden="true" focusable="false"><use href="#i-edit-2"/></svg>
            </button>
          </div>
        </div>
        <div class="form-field">
          <span class="form-field__label">Debit account</span>
          <div class="debit-account">
            <svg class="debit-account__icon" aria-hidden="true" focusable="false"><use href="#i-home"/></svg>
            <div class="debit-account__info">
              <span class="debit-account__name">Household</span>
              <span class="debit-account__iban">CH35 0900 0000 2470 2920 1</span>
            </div>
            <div class="debit-account__end">
              <span class="debit-account__amount">
                <span class="debit-account__amount-currency">CHF</span>
                <span class="debit-account__amount-value">10'570.00</span>
              </span>
              <svg class="debit-account__chevron" aria-hidden="true" focusable="false"><use href="#i-chevron-down"/></svg>
            </div>
          </div>
        </div>
      </div>
      <div class="modal__footer" style="margin-top:1.5rem;">
        <button class="uz-btn uz-btn--primary uz-btn--md uz-btn--block" type="button" data-payment-confirm>Confirm</button>
      </div>
    </div>
  `,
};

// ─── Confirmation Dialog ──────────────────────────────────────────────────────

export const ConfirmationDialog = {
  name: 'Confirmation Dialog',
  render: () => `
    <div style="padding:2rem;display:flex;justify-content:center;">
      <div class="confirmation-dialog">
        <div class="confirmation-dialog__icon">
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
