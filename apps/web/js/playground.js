/**
 * Payday run: page script.
 *
 * The page is opened as a sheet on the Design system hub (js/playground-sheet.js puts it in an
 * iframe and slides it up like the flow screens). Embedded, the close button asks the hub to
 * slide it down again; opened directly, it is a plain link back to the hub.
 */
const embedded = window.parent !== window;
const closeButton = document.querySelector('[data-playground-close]');

if (embedded && closeButton) {
  closeButton.addEventListener('click', (event) => {
    event.preventDefault();
    window.parent.postMessage({ type: 'uzbank:playground-close' }, window.location.origin);
  });
}
