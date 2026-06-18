(function () {
  'use strict';

  /**
   * Content-indication chrome: drop shadows on sticky nav/footer when scroll
   * content extends past the viewport (designs/…/mobile-content-indication).
   *
   * @param {Element} root
   * @param {{
   *   nav?: string,
   *   footer?: string,
   *   stickyAfter?: string,
   *   getScrollEl?: (root: Element) => Element|null,
   *   isStickyAfterAtEdge?: () => boolean,
   *   onStickyAfterChange?: (stuck: boolean) => void
   * }} [options]
   * @returns {{ update: () => void }}
   */
  function bindScrollEdgeChrome(root, options) {
    options = options || {};
    var navSelector = options.nav || '.modal__nav, .view__nav, [data-scroll-edge-nav]';
    var footerSelector =
      options.footer || '.modal__footer, .account-information__footer, [data-scroll-edge-footer]';
    var stickyAfterSelector = options.stickyAfter;
    var isStickyAfterAtEdgeFn = options.isStickyAfterAtEdge;
    var onStickyAfterChange = options.onStickyAfterChange;
    var getScrollEl =
      options.getScrollEl ||
      function (el) {
        return el.querySelector('[data-scroll-edge], [data-ai-scroll]');
      };

    var nav = root.querySelector(navSelector);
    var footer = root.querySelector(footerSelector);
    var stickyAfter = stickyAfterSelector ? root.querySelector(stickyAfterSelector) : null;
    var boundScrollEl = null;
    var boundScrollContentEl = null;
    var stickyAfterWasStuck = false;
    var scrollContentObserver = null;

    function isFooterVisible() {
      if (!footer) return false;
      var cs = window.getComputedStyle(footer);
      if (cs.display === 'none' || cs.visibility === 'hidden') return false;
      var position = cs.position;
      if (position === 'fixed' || position === 'sticky') return true;
      return footer.offsetParent !== null;
    }

    function scrollContentTarget(scrollEl) {
      if (!scrollEl) return null;
      return (
        scrollEl.querySelector('[data-scroll-edge-content]') ||
        scrollEl.querySelector('.main-content__inner') ||
        scrollEl.firstElementChild
      );
    }

    function attachScrollContentObserver(scrollEl) {
      if (typeof ResizeObserver === 'undefined') return;

      if (!scrollContentObserver) {
        scrollContentObserver = new ResizeObserver(function () {
          update();
        });
      }

      var contentEl = scrollContentTarget(scrollEl);
      if (contentEl === boundScrollContentEl) return;

      if (boundScrollContentEl) {
        scrollContentObserver.unobserve(boundScrollContentEl);
      }
      boundScrollContentEl = contentEl;
      if (boundScrollContentEl) {
        scrollContentObserver.observe(boundScrollContentEl);
      }
    }

    function attachScrollEl(scrollEl) {
      if (scrollEl === boundScrollEl) {
        attachScrollContentObserver(scrollEl);
        return;
      }
      if (boundScrollEl) boundScrollEl.removeEventListener('scroll', update);
      boundScrollEl = scrollEl;
      if (boundScrollEl) {
        boundScrollEl.addEventListener('scroll', update, { passive: true });
        attachScrollContentObserver(boundScrollEl);
      } else if (scrollContentObserver && boundScrollContentEl) {
        scrollContentObserver.unobserve(boundScrollContentEl);
        boundScrollContentEl = null;
      }
    }

    function scrollContentOverflows() {
      if (!boundScrollEl) return false;
      return boundScrollEl.scrollHeight - boundScrollEl.clientHeight > 1;
    }

    function stickyTopOffset(el) {
      if (!el) return 0;
      var position = window.getComputedStyle(el).position;
      if (position !== 'sticky' && position !== '-webkit-sticky') return 0;
      return parseFloat(window.getComputedStyle(el).top) || 0;
    }

    function isNavAtScrollEdge() {
      if (!nav || !boundScrollEl || !scrollContentOverflows()) return false;

      var position = window.getComputedStyle(nav).position;
      if (position === 'sticky' || position === '-webkit-sticky') {
        /* Nav inside the scrollport (main views): pinned when its top meets the scroll edge. */
        if (boundScrollEl.contains(nav)) {
          /* At scrollTop 0 the nav sits at the scroll edge but nothing is hidden behind it yet. */
          if (boundScrollEl.scrollTop <= 1) return false;
          var scrollRect = boundScrollEl.getBoundingClientRect();
          var navRect = nav.getBoundingClientRect();
          var stickyTop = stickyTopOffset(nav);
          return navRect.top <= scrollRect.top + stickyTop + 1;
        }
        /* Nav above the scroll region (modal / account-information): use scroll offset. */
        return boundScrollEl.scrollTop > 1;
      }

      return boundScrollEl.scrollTop > 1;
    }

    function isStickyAfterAtEdge() {
      if (!stickyAfter || !boundScrollEl || !scrollContentOverflows()) return false;

      if (isStickyAfterAtEdgeFn) {
        return isStickyAfterAtEdgeFn();
      }

      var position = window.getComputedStyle(stickyAfter).position;
      if (position !== 'sticky' && position !== '-webkit-sticky') return false;

      var stickyTop = stickyTopOffset(stickyAfter);
      var scrollRect = boundScrollEl.getBoundingClientRect();
      var barRect = stickyAfter.getBoundingClientRect();
      var naturalTop =
        boundScrollEl.scrollTop + (barRect.top - scrollRect.top);
      var stickStart = naturalTop - stickyTop;

      return boundScrollEl.scrollTop >= stickStart - 1;
    }

    function update() {
      attachScrollEl(getScrollEl(root));

      if (!boundScrollEl) {
        if (nav) nav.classList.remove('is-scroll-edge--after');
        if (stickyAfter) {
          stickyAfter.classList.remove('is-scroll-edge--after');
          stickyAfter.classList.remove('is-scroll-edge--stuck');
        }
        if (footer) footer.classList.remove('is-scroll-edge--before');
        if (onStickyAfterChange && stickyAfterWasStuck) {
          stickyAfterWasStuck = false;
          onStickyAfterChange(false);
        }
        return;
      }

      var scrollTop = boundScrollEl.scrollTop;
      var maxScroll = boundScrollEl.scrollHeight - boundScrollEl.clientHeight;
      var overflows = maxScroll > 1;
      var atBottom = maxScroll <= 1 || scrollTop >= maxScroll - 1;
      var stickyAfterStuck = isStickyAfterAtEdge();
      var navAtEdge = nav ? isNavAtScrollEdge() : false;
      var sharedAfterTarget = stickyAfter && nav && stickyAfter === nav;

      if (nav && !sharedAfterTarget) {
        nav.classList.toggle(
          'is-scroll-edge--after',
          navAtEdge && !stickyAfterStuck
        );
      }
      if (stickyAfter) {
        stickyAfter.classList.toggle('is-scroll-edge--stuck', stickyAfterStuck);
        stickyAfter.classList.toggle(
          'is-scroll-edge--after',
          overflows &&
            !atBottom &&
            (sharedAfterTarget ? stickyAfterStuck || navAtEdge : stickyAfterStuck)
        );
      }
      if (onStickyAfterChange && stickyAfterStuck !== stickyAfterWasStuck) {
        stickyAfterWasStuck = stickyAfterStuck;
        onStickyAfterChange(stickyAfterStuck);
      }
      if (footer && isFooterVisible()) {
        footer.classList.toggle(
          'is-scroll-edge--before',
          overflows && !atBottom
        );
      } else if (footer) footer.classList.remove('is-scroll-edge--before');
    }

    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(update);
      ro.observe(root);
    }

    window.addEventListener('resize', update);
    window.addEventListener('uz:shell-view-entered', update);
    window.addEventListener('uz:scroll-content-changed', update);

    update();
    window.requestAnimationFrame(function () {
      update();
      window.requestAnimationFrame(update);
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(update);
    }

    return { update: update };
  }

  window.UZBankScrollEdgeChrome = { bind: bindScrollEdgeChrome };
})();
