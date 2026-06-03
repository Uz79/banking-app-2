import{n as e}from"./chunk-DnJy8xQt.js";var t,n,r,i,a,o;e((()=>{t={title:`Components/Slider`},n={name:`Single slider`,render:()=>`
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
  `},r={name:`Disabled`,render:()=>`
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
  `},i={name:`Three sliders (RGB)`,render:()=>`
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
  `},a={name:`Configurable (use Controls ↓)`,args:{label:`Amount`,min:0,max:100,value:42},argTypes:{label:{control:`text`,description:`Label next to the value`},min:{control:{type:`number`,min:0,max:1e3,step:1}},max:{control:{type:`number`,min:1,max:1e3,step:1}},value:{control:{type:`number`,min:0,max:1e3,step:1}}},render:({label:e,min:t,max:n,value:r})=>{var i=Number(r),a=Number(t),o=Number(n);o<=a&&(o=a+1),i<a&&(i=a),i>o&&(i=o);var s=(i-a)/(o-a)*100;return`
      <div style="padding:1.5rem;max-width:28rem;background:var(--color-bg);border-radius:var(--radius-regular);">
        <div class="cc-slider-row">
          <span class="cc-slider-label">${e} <span class="cc-slider-value">${i}</span></span>
          <div class="cc-slider-track-wrapper">
            <input type="range" class="cc-color-slider" min="${a}" max="${o}" value="${i}"
              style="--cc-progress:${s}%;"
              aria-label="${e}" />
          </div>
        </div>
      </div>
    `}},n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: 'Single slider',
  render: () => \`
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
  \`
}`,...n.parameters?.docs?.source},description:{story:"Range control using `.cc-color-slider` + `.cc-slider-row` from `styles.css`.",...n.parameters?.docs?.description}}},r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: 'Disabled',
  render: () => \`
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
  \`
}`,...r.parameters?.docs?.source}}},i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: 'Three sliders (RGB)',
  render: () => \`
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
  \`
}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  name: 'Configurable (use Controls ↓)',
  args: {
    label: 'Amount',
    min: 0,
    max: 100,
    value: 42
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label next to the value'
    },
    min: {
      control: {
        type: 'number',
        min: 0,
        max: 1000,
        step: 1
      }
    },
    max: {
      control: {
        type: 'number',
        min: 1,
        max: 1000,
        step: 1
      }
    },
    value: {
      control: {
        type: 'number',
        min: 0,
        max: 1000,
        step: 1
      }
    }
  },
  render: ({
    label,
    min,
    max,
    value
  }) => {
    var v = Number(value);
    var lo = Number(min);
    var hi = Number(max);
    if (hi <= lo) hi = lo + 1;
    if (v < lo) v = lo;
    if (v > hi) v = hi;
    var pct = (v - lo) / (hi - lo) * 100;
    return \`
      <div style="padding:1.5rem;max-width:28rem;background:var(--color-bg);border-radius:var(--radius-regular);">
        <div class="cc-slider-row">
          <span class="cc-slider-label">\${label} <span class="cc-slider-value">\${v}</span></span>
          <div class="cc-slider-track-wrapper">
            <input type="range" class="cc-color-slider" min="\${lo}" max="\${hi}" value="\${v}"
              style="--cc-progress:\${pct}%;"
              aria-label="\${label}" />
          </div>
        </div>
      </div>
    \`;
  }
}`,...a.parameters?.docs?.source}}},o=[`Default`,`Disabled`,`ThreeChannels`,`Configurable`]}))();export{a as Configurable,n as Default,r as Disabled,i as ThreeChannels,o as __namedExportsOrder,t as default};