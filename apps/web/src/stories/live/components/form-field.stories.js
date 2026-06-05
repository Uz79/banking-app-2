export default {
  title: 'Live/Components/Form field',
};

function bindClear(canvas) {
  const wrap = canvas.querySelector('.form-field__text-wrap');
  if (!wrap) return;
  const input = wrap.querySelector('.form-field__input');
  const clear = wrap.querySelector('.form-field__clear');
  if (!input || !clear) return;

  function sync() {
    const empty = !input.value.trim();
    clear.classList.toggle('form-field__clear--hidden', empty);
  }

  input.addEventListener('input', sync);
  clear.addEventListener('click', () => {
    input.value = '';
    input.focus();
    sync();
  });
  sync();
}

export const TextInputWithClear = {
  name: 'Text input — clear button',
  render: () => `
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
  `,
  play: async ({ canvasElement }) => {
    bindClear(canvasElement);
  },
};
