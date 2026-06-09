/**
 * Signal Studio · Deck presenter engine
 * Keyboard nav · fullscreen · slide HUD · hash routing · viewport scaling
 */
(function () {
  'use strict';

  var SLIDE_W = 1200;
  var wrapper = document.querySelector('.slide-wrapper');
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var progress = document.getElementById('deck-progress');
  if (!wrapper || !slides.length) return;

  var heights = null;
  var resizeTimer = null;
  var currentIndex = 0;
  var isNavigating = false;
  var navTimer = null;
  var hudTimer = null;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  slides.forEach(function (slide, i) {
    if (!slide.id) slide.id = 'slide-' + (i + 1);
    slide.setAttribute('data-slide-index', String(i));
    slide.setAttribute('tabindex', '-1');
  });

  var hud = document.createElement('div');
  hud.className = 'deck-presenter';
  hud.setAttribute('role', 'status');
  hud.setAttribute('aria-live', 'polite');
  hud.innerHTML =
    '<span class="deck-presenter-counter"></span>' +
    '<span class="deck-presenter-sep" aria-hidden="true">·</span>' +
    '<span class="deck-presenter-hint"></span>';
  document.body.appendChild(hud);

  var help = document.createElement('div');
  help.className = 'deck-help';
  help.hidden = true;
  help.setAttribute('aria-hidden', 'true');
  help.setAttribute('role', 'dialog');
  help.setAttribute('aria-label', 'Presenter shortcuts');
  help.innerHTML =
    '<div class="deck-help-panel">' +
    '<div class="deck-help-title">Presenter controls</div>' +
    '<ul class="deck-help-list">' +
    '<li><kbd>→</kbd> <kbd>↓</kbd> <kbd>Space</kbd> Next slide</li>' +
    '<li><kbd>←</kbd> <kbd>↑</kbd> Previous slide</li>' +
    '<li><kbd>Home</kbd> First slide · <kbd>End</kbd> Last slide</li>' +
    '<li><kbd>F</kbd> Toggle fullscreen</li>' +
    '<li><kbd>?</kbd> Toggle this help</li>' +
    '<li><kbd>Esc</kbd> Exit fullscreen / close help</li>' +
    '</ul>' +
    '<button type="button" class="deck-help-close">Close</button>' +
    '</div>';
  document.body.appendChild(help);

  help.querySelector('.deck-help-close').addEventListener('click', function () {
    setHelp(false);
  });

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function slideLabel(slide, index) {
    var num = slide.querySelector('.slide-num, .reel-num');
    if (num && num.textContent.trim()) return num.textContent.trim();
    return pad(index + 1);
  }

  function updateHUD() {
    var counter = hud.querySelector('.deck-presenter-counter');
    var hint = hud.querySelector('.deck-presenter-hint');
    counter.textContent = slideLabel(slides[currentIndex], currentIndex) + ' / ' + slides.length;
    hint.textContent = slides[currentIndex].id.replace(/-/g, ' ');
    if (progress) {
      progress.style.width = (((currentIndex + 1) / slides.length) * 100).toFixed(2) + '%';
    }
    document.title = 'Signal Studio — Slide ' + (currentIndex + 1) + ' of ' + slides.length;
  }

  function flashHUD() {
    hud.classList.remove('is-dimmed');
    clearTimeout(hudTimer);
    hudTimer = setTimeout(function () {
      if (!help.hidden) return;
      hud.classList.add('is-dimmed');
    }, 2800);
  }

  function setHelp(open) {
    help.hidden = !open;
    help.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.documentElement.classList.toggle('deck-help-open', open);
    if (open) {
      hud.classList.remove('is-dimmed');
      help.querySelector('.deck-help-close').focus();
    } else {
      flashHUD();
    }
  }

  function measure() {
    slides.forEach(function (s) {
      s.style.transform = '';
      s.style.transformOrigin = '';
      s.style.marginBottom = '';
    });
    heights = slides.map(function (s) {
      return s.offsetHeight;
    });
  }

  function applyScale() {
    var ww = window.innerWidth;
    var pad = ww < 600 ? 8 : 24;
    var scale = Math.min(1, (ww - pad * 2) / SLIDE_W);
    wrapper.style.padding = pad + 'px';
    slides.forEach(function (s, i) {
      if (scale < 1) {
        s.style.transform = 'scale(' + scale + ')';
        s.style.transformOrigin = 'top center';
        s.style.marginBottom = '-' + Math.round(heights[i] * (1 - scale)) + 'px';
      } else {
        s.style.transform = '';
        s.style.transformOrigin = '';
        s.style.marginBottom = '';
      }
    });
  }

  function getScrollBehavior() {
    return prefersReducedMotion ? 'auto' : 'smooth';
  }

  function goTo(index, options) {
    var opts = options || {};
    var i = Math.max(0, Math.min(slides.length - 1, index));
    if (i === currentIndex && !opts.force) return;

    isNavigating = true;
    clearTimeout(navTimer);
    currentIndex = i;

    var slide = slides[i];
    var hash = slide.id || 'slide-' + (i + 1);
    if (location.hash !== '#' + hash) {
      history.replaceState(null, '', '#' + hash);
    }

    slide.scrollIntoView({
      behavior: getScrollBehavior(),
      block: document.documentElement.classList.contains('deck-fullscreen') ? 'center' : 'start'
    });
    updateHUD();
    flashHUD();

    navTimer = setTimeout(function () {
      isNavigating = false;
    }, prefersReducedMotion ? 50 : 520);
  }

  function goNext() {
    goTo(currentIndex + 1);
  }

  function goPrev() {
    goTo(currentIndex - 1);
  }

  function resolveIndexFromHash() {
    var hash = location.hash.replace('#', '');
    if (!hash) return 0;
    for (var i = 0; i < slides.length; i++) {
      if (slides[i].id === hash) return i;
    }
    var match = hash.match(/^slide-(\d+)$/);
    if (match) return Math.max(0, Math.min(slides.length - 1, parseInt(match[1], 10) - 1));
    return 0;
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(function () {});
    } else {
      document.exitFullscreen().catch(function () {});
    }
  }

  function isEditableTarget(el) {
    if (!el || !el.closest) return false;
    var tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      if (isNavigating) return;
      var best = null;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        if (!best || entry.intersectionRatio > best.intersectionRatio) {
          best = entry;
        }
      });
      if (!best || best.intersectionRatio < 0.42) return;
      var idx = slides.indexOf(best.target);
      if (idx !== -1 && idx !== currentIndex) {
        currentIndex = idx;
        updateHUD();
        var hash = slides[idx].id;
        if (hash && location.hash !== '#' + hash) {
          history.replaceState(null, '', '#' + hash);
        }
      }
    },
    { threshold: [0.42, 0.55, 0.72] }
  );

  slides.forEach(function (slide) {
    observer.observe(slide);
  });

  document.addEventListener('keydown', function (e) {
    if (isEditableTarget(e.target)) return;

    var key = e.key;
    if (key === '?' || (e.shiftKey && key === '/')) {
      e.preventDefault();
      setHelp(help.hidden);
      return;
    }
    if (!help.hidden && key === 'Escape') {
      e.preventDefault();
      setHelp(false);
      return;
    }
    if (!help.hidden) return;

    if (key === 'ArrowRight' || key === 'ArrowDown' || key === 'PageDown' || key === ' ') {
      e.preventDefault();
      goNext();
      return;
    }
    if (key === 'ArrowLeft' || key === 'ArrowUp' || key === 'PageUp') {
      e.preventDefault();
      goPrev();
      return;
    }
    if (key === 'Home') {
      e.preventDefault();
      goTo(0);
      return;
    }
    if (key === 'End') {
      e.preventDefault();
      goTo(slides.length - 1);
      return;
    }
    if (key === 'f' || key === 'F') {
      e.preventDefault();
      toggleFullscreen();
    }
  });

  wrapper.addEventListener('click', function (e) {
    if (help.hidden === false) return;
    if (isEditableTarget(e.target)) return;
    if (e.target.closest('a, button, input, textarea, select, [role="button"]')) return;

    var rect = wrapper.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var zone = x / rect.width;
    if (zone < 0.28) goPrev();
    else if (zone > 0.72) goNext();
  });

  document.addEventListener('fullscreenchange', function () {
    document.documentElement.classList.toggle('deck-fullscreen', !!document.fullscreenElement);
    setTimeout(function () {
      measure();
      applyScale();
      goTo(currentIndex, { force: true });
    }, 120);
  });

  window.addEventListener('hashchange', function () {
    if (isNavigating) return;
    goTo(resolveIndexFromHash(), { force: true });
  });

  window.addEventListener('resize', function () {
    var vv = window.visualViewport;
    if (vv && vv.scale > 1.05) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      measure();
      applyScale();
      updateHUD();
    }, 160);
  });

  window.addEventListener('orientationchange', function () {
    setTimeout(function () {
      measure();
      applyScale();
      goTo(currentIndex, { force: true });
    }, 350);
  });

  measure();
  applyScale();
  currentIndex = resolveIndexFromHash();
  updateHUD();
  flashHUD();

  if (location.hash) {
    requestAnimationFrame(function () {
      goTo(currentIndex, { force: true });
    });
  }

  window.DeckPresenter = {
    goTo: goTo,
    goNext: goNext,
    goPrev: goPrev,
    getCurrentIndex: function () {
      return currentIndex;
    },
    getSlideCount: function () {
      return slides.length;
    },
    remeasure: function () {
      measure();
      applyScale();
    }
  };
})();
