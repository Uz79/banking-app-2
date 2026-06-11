/**
 * UZ Bank Web — localStorage key migration (legacy WebApp_* names → uzBankWeb*).
 * Load in <head> before inline theme boot on shell pages.
 */
(function () {
  'use strict';

  var KEYS = {
    theme: 'uzBankWebTheme',
    colorOverride: 'uzBankWebColorOverride',
    appearance: 'uzBankWebAppearance',
    paymentState: 'uzBankWebPaymentState',
    savedColorThemes: 'uzBankWebSavedColorThemes'
  };

  var LEGACY = [
    ['uzBankWebApp03Theme', KEYS.theme],
    ['uzBankWebApp10Theme', KEYS.theme],
    ['uzBankWebApp11Theme', KEYS.theme],
    ['uzBankWebApp10ColorOverride', KEYS.colorOverride],
    ['uzBankWebApp11ColorOverride', KEYS.colorOverride],
    ['uzBankWebApp10Appearance', KEYS.appearance],
    ['uzBankWebApp11Appearance', KEYS.appearance],
    ['uzBankWebApp10PaymentState', KEYS.paymentState],
    ['uzBankWebApp11PaymentState', KEYS.paymentState],
    ['uzBankWebApp11SavedColorThemes', KEYS.savedColorThemes]
  ];

  try {
    LEGACY.forEach(function (pair) {
      var oldKey = pair[0];
      var newKey = pair[1];
      var value = localStorage.getItem(oldKey);
      if (value != null && localStorage.getItem(newKey) == null) {
        localStorage.setItem(newKey, value);
      }
    });
  } catch (err) {
    /* ignore */
  }

  window.UZBankStorageKeys = KEYS;
})();
