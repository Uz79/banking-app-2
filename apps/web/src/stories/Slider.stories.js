export default {
  title: 'Components/Slider',
};

/** Range control using `.cc-color-slider` + `.cc-slider-row` from `styles.css`. */

export const Default = {
  name: 'Single slider',
  render: () => `
    <div style="padding:1.5rem;max-width:28rem;background:var(--color-bg);border-radius:var(--radius-regular);">
      <div class="cc-slider-row">
        <span class="cc-slider-label">Value <span class="cc-slider-value">128</span></span>
        <div class="cc-slider-track-wrapper">
          <input type="range" class="cc-color-slider" min="0" max="255" value="128"
            style="--cc-progress:50%;"
            aria-label="Example slider" />
        </div>
      </div>
    </div>
  `,
};

export const Disabled = {
  name: 'Disabled',
  render: () => `
    <div style="padding:1.5rem;max-width:28rem;background:var(--color-bg);border-radius:var(--radius-regular);">
      <div class="cc-slider-row">
        <span class="cc-slider-label">Value <span class="cc-slider-value">80</span></span>
        <div class="cc-slider-track-wrapper">
          <input type="range" class="cc-color-slider" min="0" max="100" value="80" disabled
            style="--cc-progress:80%;"
            aria-label="Disabled slider" />
        </div>
      </div>
    </div>
  `,
};

export const ThreeChannels = {
  name: 'Three sliders (RGB)',
  render: () => `
    <div style="padding:1.5rem;max-width:28rem;background:var(--color-bg);border-radius:var(--radius-regular);display:flex;flex-direction:column;gap:var(--space-3);">
      <div class="cc-slider-row">
        <span class="cc-slider-label">Red <span class="cc-slider-value">255</span></span>
        <div class="cc-slider-track-wrapper">
          <input type="range" class="cc-color-slider" min="0" max="255" value="255"
            style="--cc-progress:100%;" aria-label="Red" />
        </div>
      </div>
      <div class="cc-slider-row">
        <span class="cc-slider-label">Green <span class="cc-slider-value">128</span></span>
        <div class="cc-slider-track-wrapper">
          <input type="range" class="cc-color-slider" min="0" max="255" value="128"
            style="--cc-progress:50%;" aria-label="Green" />
        </div>
      </div>
      <div class="cc-slider-row">
        <span class="cc-slider-label">Blue <span class="cc-slider-value">0</span></span>
        <div class="cc-slider-track-wrapper">
          <input type="range" class="cc-color-slider" min="0" max="255" value="0"
            style="--cc-progress:0%;" aria-label="Blue" />
        </div>
      </div>
    </div>
  `,
};

export const Configurable = {
  name: 'Configurable (use Controls ↓)',
  args: {
    label: 'Amount',
    min: 0,
    max: 100,
    value: 42,
  },
  argTypes: {
    label: { control: 'text', description: 'Label next to the value' },
    min:   { control: { type: 'number', min: 0, max: 1000, step: 1 } },
    max:   { control: { type: 'number', min: 1, max: 1000, step: 1 } },
    value: { control: { type: 'number', min: 0, max: 1000, step: 1 } },
  },
  render: ({ label, min, max, value }) => {
    var v = Number(value);
    var lo = Number(min);
    var hi = Number(max);
    if (hi <= lo) hi = lo + 1;
    if (v < lo) v = lo;
    if (v > hi) v = hi;
    var pct = ((v - lo) / (hi - lo)) * 100;
    return `
      <div style="padding:1.5rem;max-width:28rem;background:var(--color-bg);border-radius:var(--radius-regular);">
        <div class="cc-slider-row">
          <span class="cc-slider-label">${label} <span class="cc-slider-value">${v}</span></span>
          <div class="cc-slider-track-wrapper">
            <input type="range" class="cc-color-slider" min="${lo}" max="${hi}" value="${v}"
              style="--cc-progress:${pct}%;"
              aria-label="${label}" />
          </div>
        </div>
      </div>
    `;
  },
};
