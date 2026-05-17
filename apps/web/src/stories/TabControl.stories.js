export default {
  title: 'Components/Tab control',
};

/** Matches `.cc-tab-control` / `.cc-tab` / `.cc-tab-body` from `styles.css` (contrast checker). */

export const RgbSelected = {
  name: 'RGB / HSL — RGB selected',
  render: () => `
    <div style="padding:1.5rem;max-width:26rem;background:var(--color-bg);border-radius:var(--radius-regular);">
      <div class="cc-tab-control">
        <div class="cc-tabs" role="tablist" aria-label="Colour model">
          <button type="button" class="cc-tab cc-tab--active" role="tab" aria-selected="true">RGB</button>
          <button type="button" class="cc-tab" role="tab" aria-selected="false">HSL</button>
        </div>
        <div class="cc-tab-body cc-tab-body--active" role="tabpanel">
          <p style="margin:0;font-size:var(--fs-text-sm);color:var(--color-fg-secondary);">RGB inputs would appear here.</p>
        </div>
        <div class="cc-tab-body" role="tabpanel" hidden>
          <p style="margin:0;font-size:var(--fs-text-sm);color:var(--color-fg-secondary);">HSL inputs would appear here.</p>
        </div>
      </div>
    </div>
  `,
};

export const HslSelected = {
  name: 'RGB / HSL — HSL selected',
  render: () => `
    <div style="padding:1.5rem;max-width:26rem;background:var(--color-bg);border-radius:var(--radius-regular);">
      <div class="cc-tab-control">
        <div class="cc-tabs" role="tablist" aria-label="Colour model">
          <button type="button" class="cc-tab" role="tab" aria-selected="false">RGB</button>
          <button type="button" class="cc-tab cc-tab--active" role="tab" aria-selected="true">HSL</button>
        </div>
        <div class="cc-tab-body" role="tabpanel" hidden>
          <p style="margin:0;font-size:var(--fs-text-sm);color:var(--color-fg-secondary);">RGB inputs would appear here.</p>
        </div>
        <div class="cc-tab-body cc-tab-body--active" role="tabpanel">
          <p style="margin:0;font-size:var(--fs-text-sm);color:var(--color-fg-secondary);">HSL inputs would appear here.</p>
        </div>
      </div>
    </div>
  `,
};

export const WithSliders = {
  name: 'With sliders (like Theme colour)',
  render: () => `
    <div style="padding:1.5rem;max-width:26rem;background:var(--color-bg);border-radius:var(--radius-regular);">
      <div class="cc-tab-control">
        <div class="cc-tabs" role="tablist" aria-label="Colour model">
          <button type="button" class="cc-tab cc-tab--active" role="tab" aria-selected="true">RGB</button>
          <button type="button" class="cc-tab" role="tab" aria-selected="false">HSL</button>
        </div>
        <div class="cc-tab-body cc-tab-body--active" role="tabpanel">
          <div class="cc-slider-row">
            <span class="cc-slider-label">Red <span class="cc-slider-value">128</span></span>
            <div class="cc-slider-track-wrapper">
              <input type="range" class="cc-color-slider" min="0" max="255" value="128"
                style="--cc-progress:50%;"
                aria-label="Red channel (storybook)" />
            </div>
          </div>
          <div class="cc-slider-row">
            <span class="cc-slider-label">Green <span class="cc-slider-value">64</span></span>
            <div class="cc-slider-track-wrapper">
              <input type="range" class="cc-color-slider" min="0" max="255" value="64"
                style="--cc-progress:25.098039215686274%;"
                aria-label="Green channel (storybook)" />
            </div>
          </div>
          <div class="cc-slider-row">
            <span class="cc-slider-label">Blue <span class="cc-slider-value">200</span></span>
            <div class="cc-slider-track-wrapper">
              <input type="range" class="cc-color-slider" min="0" max="255" value="200"
                style="--cc-progress:78.43137254901961%;"
                aria-label="Blue channel (storybook)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
};
