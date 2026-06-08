document.addEventListener('DOMContentLoaded', function () {

  var THEME_KEY = 'uzBankWebApp03Theme';

  function getTheme() {
    var t = document.documentElement.getAttribute('data-theme');
    return t === 'light' || t === 'dark' ? t : 'dark';
  }

  function syncThemeSegmented() {
    var theme = getTheme();
    document.querySelectorAll('.segmented--theme .segmented__option').forEach(function (btn) {
      var v = btn.getAttribute('data-set-theme');
      if (v === theme) btn.classList.add('segmented__option--active');
      else btn.classList.remove('segmented__option--active');
    });
    var meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? 'light dark' : 'dark light');
  }

  syncThemeSegmented();

  var views = document.querySelectorAll('.view');
  var sidebarItems = document.querySelectorAll('.sidebar__nav-item');
  var tabBarItems = document.querySelectorAll('.tab-bar__item');
  var productItems = document.querySelectorAll('[data-account]');
  var modalOverlay = document.querySelector('.modal-overlay');
  var modalShell = document.querySelector('.modal-shell');
  var modalTitle = document.querySelector('.modal__title');
  var modalBack = document.querySelector('.modal__back');
  var modalClose = document.querySelector('.modal__close');
  var modalSteps = document.querySelectorAll('.modal__step');
  var modalFooter = document.querySelector('.modal__footer');
  var modalConfirmBtn = modalFooter ? modalFooter.querySelector('[data-payment-confirm]') : null;
  var confirmationOverlay = document.querySelector('.confirmation-overlay');
  var carouselSlides = document.querySelector('.carousel__slides');
  var carouselArrows = document.querySelectorAll('.carousel__arrow');
  var carouselDots = document.querySelectorAll('.carousel__dot');

  var STEPS = ['recipient', 'amount', 'schedule', 'summary'];
  var STEP_TITLES = {
    recipient: 'Recipient',
    amount: 'Amount',
    schedule: 'Time schedule',
    summary: 'Summary'
  };
  var currentStep = 0;
  var prevStepIndexForTransition = null;
  var paymentFlowClosing = false;
  var currentSlide = 0;
  var touchStartX = 0;
  var touchDeltaX = 0;

  /* ── View Navigation ──────────────────────────────── */

  function navigateTo(viewName) {
    views.forEach(function (v) {
      if (v.dataset.view === viewName) {
        v.classList.add('view--active');
      } else {
        v.classList.remove('view--active');
      }
    });

    sidebarItems.forEach(function (item) {
      if (item.dataset.view === viewName) {
        item.classList.add('sidebar__nav-item--active');
      } else {
        item.classList.remove('sidebar__nav-item--active');
      }
    });

    tabBarItems.forEach(function (item) {
      var iconWrap = item.querySelector('.tab-bar__icon-wrap');
      if (item.dataset.view === viewName) {
        item.classList.add('tab-bar__item--active');
        if (iconWrap) iconWrap.classList.add('tab-bar__icon-wrap--active');
      } else {
        item.classList.remove('tab-bar__item--active');
        if (iconWrap) iconWrap.classList.remove('tab-bar__icon-wrap--active');
      }
    });
  }

  sidebarItems.forEach(function (item) {
    item.addEventListener('click', function () {
      navigateTo(item.dataset.view);
    });
  });

  tabBarItems.forEach(function (item) {
    item.addEventListener('click', function () {
      navigateTo(item.dataset.view);
    });
  });

  document.addEventListener('click', function (e) {
    var productEl = e.target.closest('.product-item[data-account]');
    if (productEl && (productEl.dataset.account === 'household' || productEl.dataset.account === 'savings')) {
      navigateTo('account-details');
    }
  });

  document.addEventListener('click', function (e) {
    if (e.target.closest('.view__back')) {
      navigateTo('overview');
    }
  });

  /* ── Carousel ─────────────────────────────────────── */

  function getSlideCount() {
    if (!carouselSlides) return 0;
    return carouselSlides.children.length;
  }

  function updateCarousel() {
    if (!carouselSlides) return;
    carouselSlides.style.transform =
      'translateX(calc(-' + (currentSlide * 100) + '% - ' + currentSlide + 'rem))';

    carouselDots.forEach(function (dot, i) {
      if (i === currentSlide) {
        dot.classList.add('carousel__dot--active');
      } else {
        dot.classList.remove('carousel__dot--active');
      }
    });
  }

  if (carouselArrows.length >= 2) {
    carouselArrows[0].addEventListener('click', function () {
      if (currentSlide > 0) {
        currentSlide--;
        updateCarousel();
      }
    });

    carouselArrows[1].addEventListener('click', function () {
      if (currentSlide < getSlideCount() - 1) {
        currentSlide++;
        updateCarousel();
      }
    });
  }

  carouselDots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      currentSlide = i;
      updateCarousel();
    });
  });

  if (carouselSlides) {
    carouselSlides.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
      touchDeltaX = 0;
    }, { passive: true });

    carouselSlides.addEventListener('touchmove', function (e) {
      touchDeltaX = e.touches[0].clientX - touchStartX;
    }, { passive: true });

    carouselSlides.addEventListener('touchend', function () {
      if (Math.abs(touchDeltaX) >= 50) {
        if (touchDeltaX < 0 && currentSlide < getSlideCount() - 1) {
          currentSlide++;
        } else if (touchDeltaX > 0 && currentSlide > 0) {
          currentSlide--;
        }
        updateCarousel();
      }
      touchStartX = 0;
      touchDeltaX = 0;
    });
  }

  /* ── Payment Flow Modal ───────────────────────────── */

  function openModal() {
    if (!modalOverlay) return;
    currentStep = 0;
    prevStepIndexForTransition = null;
    showStep();
    if (confirmationOverlay) confirmationOverlay.classList.remove('confirmation-overlay--visible');
    if (modalShell) {
      modalShell.classList.remove('modal-shell--closing');
      modalShell.classList.add('modal-shell--offscreen', 'modal-shell--no-transition');
    }
    modalOverlay.classList.add('modal-overlay--active');
    document.body.classList.add('body--payment-open');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (!modalShell) return;
        modalShell.classList.remove('modal-shell--no-transition');
        modalShell.offsetHeight;
        modalShell.classList.remove('modal-shell--offscreen');
      });
    });
  }

  function hideConfirmationVisual() {
    if (confirmationOverlay) confirmationOverlay.classList.remove('confirmation-overlay--visible');
  }

  function closeModal() {
    if (!modalOverlay || paymentFlowClosing) return;

    function finishClose() {
      paymentFlowClosing = false;
      currentStep = 0;
      prevStepIndexForTransition = null;
      showStep();
      modalOverlay.classList.remove('modal-overlay--active');
      document.body.classList.remove('body--payment-open');
      if (confirmationOverlay) confirmationOverlay.classList.remove('confirmation-overlay--visible');
      if (modalFooter) modalFooter.style.display = '';
      if (modalShell) {
        modalShell.classList.remove('modal-shell--closing');
        modalShell.classList.add('modal-shell--offscreen', 'modal-shell--no-transition');
      }
    }

    if (!modalOverlay.classList.contains('modal-overlay--active')) {
      finishClose();
      return;
    }

    paymentFlowClosing = true;

    if (modalShell) {
      modalShell.classList.remove('modal-shell--offscreen', 'modal-shell--no-transition');
      modalShell.offsetHeight;
      modalShell.classList.add('modal-shell--closing');

      var resolved = false;
      function onShellCloseEnd(e) {
        if (e.target !== modalShell || e.propertyName !== 'transform') return;
        if (resolved) return;
        resolved = true;
        modalShell.removeEventListener('transitionend', onShellCloseEnd);
        finishClose();
      }
      modalShell.addEventListener('transitionend', onShellCloseEnd);
      window.setTimeout(function () {
        if (resolved) return;
        resolved = true;
        modalShell.removeEventListener('transitionend', onShellCloseEnd);
        finishClose();
      }, 300);
    } else {
      paymentFlowClosing = false;
      finishClose();
    }
  }

  function showStep() {
    var stepName = STEPS[currentStep];
    var prev = prevStepIndexForTransition;
    var shouldAnimSteps = prev !== null && prev !== currentStep;

    modalSteps.forEach(function (step) {
      step.classList.remove('modal__step--active', 'modal__step--play-in-f', 'modal__step--play-in-b');
      if (step.dataset.step === stepName) {
        step.classList.add('modal__step--active');
        if (shouldAnimSteps) {
          var forward = currentStep > prev;
          step.offsetHeight;
          step.classList.add(forward ? 'modal__step--play-in-f' : 'modal__step--play-in-b');
          step.addEventListener('animationend', function onStepAnim(e) {
            if (e.target !== step) return;
            if (e.animationName !== 'modalStepInForward' && e.animationName !== 'modalStepInBack') return;
            step.removeEventListener('animationend', onStepAnim);
            step.classList.remove('modal__step--play-in-f', 'modal__step--play-in-b');
          });
        }
      }
    });

    prevStepIndexForTransition = currentStep;

    if (modalTitle) {
      modalTitle.textContent = STEP_TITLES[stepName] || '';
    }

    if (modalBack) {
      if (currentStep === 0) {
        modalBack.classList.add('modal__back--hidden');
      } else {
        modalBack.classList.remove('modal__back--hidden');
      }
    }

    if (modalConfirmBtn) {
      modalConfirmBtn.textContent = stepName === 'summary' ? 'Execute' : 'Confirm';
    }

    if (modalFooter) modalFooter.style.display = '';
  }

  function advanceStep() {
    if (currentStep < STEPS.length - 1) {
      currentStep++;
      showStep();
    } else {
      showConfirmation();
    }
  }

  function showConfirmation() {
    if (confirmationOverlay) {
      confirmationOverlay.classList.add('confirmation-overlay--visible');
    }
  }

  document.addEventListener('click', function (e) {
    var payBtn = e.target.closest('[data-action="pay"]');
    if (payBtn) {
      openModal();
    }
  });

  if (modalConfirmBtn) {
    modalConfirmBtn.addEventListener('click', advanceStep);
  }

  if (modalBack) {
    modalBack.addEventListener('click', function () {
      if (currentStep > 0) {
        currentStep--;
        showStep();
      }
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', function (e) {
      e.preventDefault();
      function runExitFromFlow() {
        hideConfirmationVisual();
        closeModal();
      }
      if (typeof window.UZBankPaymentExitPrompt === 'function') {
        window.UZBankPaymentExitPrompt(runExitFromFlow);
      } else {
        runExitFromFlow();
      }
    });
  }

  document.addEventListener('click', function (e) {
    var doneBtn = e.target.closest('[data-action="done"]');
    if (doneBtn) {
      closeModal();
    }
  });

  /* Payment modal: scrim clicks do not dismiss (use × / Back / Done). */

  /* ── Toggle ───────────────────────────────────────── */

  document.addEventListener('click', function (e) {
    var toggle = e.target.closest('.toggle');
    if (toggle) {
      toggle.classList.toggle('toggle--active');
      var thumb = toggle.querySelector('.toggle__thumb');
      if (thumb) thumb.classList.toggle('toggle__thumb--active');
    }
  });

  /* ── Segmented control (payment + sidebar theme) ─── */

  document.addEventListener('click', function (e) {
    var option = e.target.closest('.segmented__option');
    if (!option) return;

    var parent = option.parentElement;
    if (!parent) return;

    parent.querySelectorAll('.segmented__option').forEach(function (sib) {
      sib.classList.remove('segmented__option--active');
    });
    option.classList.add('segmented__option--active');

    if (parent.classList.contains('segmented--theme')) {
      var theme = option.getAttribute('data-set-theme');
      if (theme === 'light' || theme === 'dark') {
        try {
          localStorage.setItem(THEME_KEY, theme);
        } catch (err) {}
        document.documentElement.setAttribute('data-theme', theme);
        syncThemeSegmented();
      }
    }
  });

  document.addEventListener('uz:more-functions-action', function (e) {
    var d = e.detail || {};
    var action = d.action;
    if (!action) return;
    if (action === 'show-all-bookings') {
      var accountKey = window.__UZ_ACTIVE_ACCOUNT__ || 'savings';
      var bookingsPrefix = '';
      try {
        if ((window.location.pathname || '').replace(/\\/g, '/').indexOf('/payment/') !== -1) {
          bookingsPrefix = '../';
        }
      } catch (_e) {}
      window.location.href =
        bookingsPrefix +
        'all-bookings-and-payments.html?account=' +
        encodeURIComponent(accountKey);
      return;
    }
    if (action === 'change-category') {
      navigateTo('overview');
      return;
    }
    if (action === 'show-account-information') {
      var aiPrefix = '';
      try {
        if ((window.location.pathname || '').replace(/\\/g, '/').indexOf('/payment/') !== -1) {
          aiPrefix = '../';
        }
      } catch (_e) {}
      window.location.href = aiPrefix + 'account-details.html#account-information';
      return;
    }
  });

});
