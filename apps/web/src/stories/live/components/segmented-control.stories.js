export default {
  title: 'Live/Components/Segmented control',
};

function bindThemeSegmented(canvas) {
  const group = canvas.querySelector('.segmented--theme');
  if (!group) return;
  group.addEventListener('click', (e) => {
    const option = e.target.closest('.segmented__option');
    if (!option || !group.contains(option)) return;
    const theme = option.getAttribute('data-set-theme');
    if (theme !== 'light' && theme !== 'dark') return;
    if (typeof window.UZBankApplyTheme === 'function') {
      window.UZBankApplyTheme(theme);
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    group.querySelectorAll('.segmented__option').forEach((btn) => {
      btn.classList.toggle('segmented__option--active', btn === option);
    });
  });
}

export const ThemeToggle = {
  name: 'Theme toggle (Light / Dark)',
  render: () => `
    <div style="padding:1.5rem;">
      <div class="segmented segmented--theme" role="group" aria-label="Theme">
        <button type="button" class="segmented__option" data-set-theme="light">Light</button>
        <button type="button" class="segmented__option segmented__option--active" data-set-theme="dark">Dark</button>
      </div>
    </div>
  `,
  play: async ({ canvasElement }) => {
    bindThemeSegmented(canvasElement);
  },
};
