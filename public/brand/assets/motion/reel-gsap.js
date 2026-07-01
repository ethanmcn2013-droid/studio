/**
 * Signal Studio · Motion Reel · GSAP master timeline
 * 24s loop · plays when slide is in view · respects prefers-reduced-motion
 */
(function () {
  'use strict';

  if (typeof gsap === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var reel = document.querySelector('.slide-reel');
  if (!reel) return;

  var LOOP = 24;
  var EASE_OUT = 'power3.out';
  var EASE_IN = 'power2.in';
  var EASE_IO = 'power2.inOut';
  var XFADE = 0.42;

  var scenes = reel.querySelectorAll('.reel-scene');
  var steps = reel.querySelectorAll('.reel-rail .reel-step');
  var railProgress = reel.querySelector('.reel-rail-progress');
  var railLine = reel.querySelector('.reel-rail-line');
  var device = reel.querySelector('.reel-device');
  var urls = reel.querySelectorAll('.reel-url span');
  var captions = reel.querySelectorAll('.reel-caption span');
  var dots = reel.querySelectorAll('.reel-dots-progress i');
  var chaosCards = reel.querySelectorAll('.reel-chaos-card');
  var shine = reel.querySelector('.ui-signal-shine');

  var shotNotes = reel.querySelector('.reel-shot-notes img');
  var shotTasks = reel.querySelector('.reel-shot-tasks img');
  var shotRoadmap = reel.querySelector('.reel-shot-roadmap img');
  var shotAnalytics = reel.querySelector('.reel-shot-analytics img');

  var tagNotes = reel.querySelector('.reel-tag.t-notes');
  var tagTasks = reel.querySelector('.reel-tag.t-tasks');
  var tagRoadmap = reel.querySelector('.reel-tag.t-roadmap');
  var tagAnalytics = reel.querySelector('.reel-tag.t-analytics');

  var hiNotes = reel.querySelector('.reel-highlight.h-notes');
  var hiTasks = reel.querySelector('.reel-highlight.h-tasks');
  var hiRoadmap = reel.querySelector('.reel-highlight.h-roadmap');
  var hiAnalytics = reel.querySelector('.reel-highlight.h-analytics');

  var url0 = reel.querySelector('.reel-url .u0');
  var url1 = reel.querySelector('.reel-url .u1');
  var url2 = reel.querySelector('.reel-url .u2');
  var url3 = reel.querySelector('.reel-url .u3');
  var url4 = reel.querySelector('.reel-url .u4');
  var cap0 = reel.querySelector('.reel-caption .c0');
  var cap1 = reel.querySelector('.reel-caption .c1');
  var cap2 = reel.querySelector('.reel-caption .c2');
  var cap3 = reel.querySelector('.reel-caption .c3');
  var cap4 = reel.querySelector('.reel-caption .c4');
  var chaosRot = [-2, 1.5, -1, 2, -1.5];

  reel.classList.add('reel-gsap-active');

  function setActiveStep(index) {
    steps.forEach(function (step, i) {
      step.classList.toggle('is-active', i === index);
    });
  }

  function tweenUrl(el, at) {
    tl.to(urls, { autoAlpha: 0, duration: 0.18, ease: EASE_IN }, at);
    if (el) tl.to(el, { autoAlpha: 1, duration: 0.3, ease: EASE_OUT }, at + 0.06);
  }

  function tweenCaption(el, at) {
    tl.to(captions, { autoAlpha: 0, y: 3, duration: 0.2, ease: EASE_IN }, at);
    if (el) {
      tl.fromTo(
        el,
        { autoAlpha: 0, y: -4 },
        { autoAlpha: 1, y: 0, duration: 0.32, ease: EASE_OUT },
        at + 0.08
      );
    }
  }

  function setDots(activeIndex) {
    var isChaos = activeIndex === 0;
    gsap.to(dots, {
      scale: 1,
      backgroundColor: 'rgba(255,255,255,0.15)',
      duration: 0.25,
      ease: EASE_OUT,
      overwrite: 'auto'
    });
    if (dots[activeIndex]) {
      gsap.to(dots[activeIndex], {
        scale: 1.35,
        backgroundColor: isChaos ? '#ef4444' : '#4f46e5',
        duration: 0.35,
        ease: EASE_OUT,
        overwrite: 'auto'
      });
    }
  }

  function crossfade(from, to, at) {
    if (from) {
      tl.to(from, { autoAlpha: 0, scale: 0.98, duration: XFADE, ease: EASE_IN }, at);
    }
    if (to) {
      tl.fromTo(
        to,
        { autoAlpha: 0, scale: 0.97 },
        { autoAlpha: 1, scale: 1, duration: XFADE, ease: EASE_OUT },
        at
      );
    }
  }

  function chaosEntrance(at) {
    chaosCards.forEach(function (card, i) {
      tl.fromTo(
        card,
        { autoAlpha: 0, y: 16, rotation: chaosRot[i] },
        { autoAlpha: 1, y: 0, rotation: chaosRot[i], duration: 0.42, ease: EASE_OUT },
        at + 0.08 + i * 0.055
      );
      tl.to(
        card,
        { y: -5, duration: 1.9 + i * 0.15, repeat: 2, yoyo: true, ease: 'sine.inOut' },
        at + 0.35
      );
    });
  }

  function pulseTag(tag, highlight, at, hold) {
    if (tag) {
      tl.fromTo(
        tag,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.38, ease: EASE_OUT },
        at + 0.12
      );
      tl.to(tag, { autoAlpha: 0, y: 6, duration: 0.28, ease: EASE_IN }, at + hold - 0.35);
    }
    if (highlight) {
      tl.fromTo(
        highlight,
        { autoAlpha: 0, scale: 0.98 },
        { autoAlpha: 1, scale: 1, duration: 0.32, ease: EASE_OUT },
        at + 0.18
      );
      tl.to(highlight, { autoAlpha: 0, scale: 1.01, duration: 0.28, ease: EASE_IN }, at + hold - 0.32);
    }
  }

  function kenBurns(img, at, hold, y, scale) {
    if (!img) return;
    tl.set(img, { opacity: 1, xPercent: -50 }, at);
    tl.fromTo(
      img,
      { xPercent: -50, y: 0, scale: 1 },
      { xPercent: -50, y: y, scale: scale, duration: hold, ease: 'none' },
      at
    );
  }

  /* ── Initial states ── */
  gsap.set(scenes, { autoAlpha: 0, scale: 0.98 });
  gsap.set(scenes[0], { autoAlpha: 1, scale: 1 });
  gsap.set(steps, { opacity: 0.35 });
  gsap.set(steps[0], { opacity: 1 });
  steps[0].classList.add('is-active');

  if (railProgress && railLine) {
    gsap.set(railProgress, {
      height: railLine.offsetHeight,
      scaleY: 0,
      transformOrigin: 'top center'
    });
  }

  gsap.set(urls, { autoAlpha: 0 });
  gsap.set(url0, { autoAlpha: 1 });
  gsap.set(captions, { autoAlpha: 0, y: 0 });
  gsap.set(cap0, { autoAlpha: 1 });
  setDots(0);

  chaosCards.forEach(function (card, i) {
    gsap.set(card, { autoAlpha: 1, y: 0, rotation: chaosRot[i] });
  });
  gsap.set([tagNotes, tagTasks, tagRoadmap, tagAnalytics], { autoAlpha: 0, y: 8 });
  gsap.set([hiNotes, hiTasks, hiRoadmap, hiAnalytics], { autoAlpha: 0 });
  if (shine) gsap.set(shine, { xPercent: -120, autoAlpha: 0 });
  gsap.set(device, { scale: 0.985 });
  [shotNotes, shotTasks, shotRoadmap, shotAnalytics].forEach(function (img) {
    if (img) gsap.set(img, { xPercent: -50, opacity: 1, force3D: true });
  });

  /* ── Master timeline ── */
  var tl = gsap.timeline({
    repeat: -1,
    paused: true,
    defaults: { ease: EASE_OUT }
  });

  /* Beat 0 · Chaos (0s – 1.7s) */
  tl.addLabel('chaos', 0);
  tl.call(function () { setActiveStep(0); setDots(0); }, null, 0);
  tweenUrl(url0, 0);
  tweenCaption(cap0, 0);
  chaosEntrance(0);
  tl.to(device, { scale: 0.985, duration: 0.6 }, 0);
  tl.to(railProgress, { scaleY: 0, duration: 0.5 }, 0);

  /* Beat 1 · Notes (1.7s – 5.8s) */
  tl.addLabel('notes', 1.7);
  tl.to(chaosCards, { autoAlpha: 0, y: -6, duration: 0.22, stagger: 0.03, ease: EASE_IN }, 1.68);
  crossfade(scenes[0], scenes[1], 1.7);
  tl.call(function () { setActiveStep(1); setDots(1); }, null, 1.75);
  tweenUrl(url1, 1.75);
  tweenCaption(cap1, 1.75);
  tl.to(railProgress, { scaleY: 0.22, duration: 0.65 }, 1.75);
  tl.to(device, { scale: 1, duration: 0.55 }, 1.75);
  pulseTag(tagNotes, hiNotes, 1.75, 4.0);
  kenBurns(shotNotes, 1.85, 3.9, -4, 1.02);

  /* Beat 2 · Tasks (6.0s – 10.9s) */
  tl.addLabel('tasks', 6.0);
  crossfade(scenes[1], scenes[2], 6.0);
  tl.call(function () { setActiveStep(2); setDots(2); }, null, 6.05);
  tweenUrl(url2, 6.05);
  tweenCaption(cap2, 6.05);
  tl.to(railProgress, { scaleY: 0.44, duration: 0.65 }, 6.05);
  pulseTag(tagTasks, hiTasks, 6.05, 4.7);
  kenBurns(shotTasks, 6.15, 4.6, -6, 1.03);

  /* Beat 3 · Timeline (11.1s – 16.1s) */
  tl.addLabel('roadmap', 11.1);
  crossfade(scenes[2], scenes[3], 11.1);
  tl.call(function () { setActiveStep(3); setDots(3); }, null, 11.15);
  tweenUrl(url3, 11.15);
  tweenCaption(cap3, 11.15);
  tl.to(railProgress, { scaleY: 0.66, duration: 0.65 }, 11.15);
  pulseTag(tagRoadmap, hiRoadmap, 11.15, 4.8);
  kenBurns(shotRoadmap, 11.25, 4.7, -5, 1.02);

  /* Beat 4 · Signal (16.3s – 22.1s) */
  tl.addLabel('analytics', 16.3);
  crossfade(scenes[3], scenes[4], 16.3);
  tl.call(function () { setActiveStep(4); setDots(4); }, null, 16.35);
  tweenUrl(url4, 16.35);
  tweenCaption(cap4, 16.35);
  tl.to(railProgress, { scaleY: 0.88, duration: 0.75 }, 16.35);
  pulseTag(tagAnalytics, hiAnalytics, 16.35, 5.5);
  kenBurns(shotAnalytics, 16.45, 5.4, -4, 1.02);
  if (shine) {
    tl.fromTo(
      shine,
      { xPercent: -110, autoAlpha: 0 },
      { xPercent: 110, autoAlpha: 0.75, duration: 1.15, ease: EASE_IO },
      17.2
    );
    tl.to(shine, { autoAlpha: 0, duration: 0.35 }, 18.5);
  }

  /* Loop close · return to chaos (22.3s – 24s) */
  tl.addLabel('loop', 22.3);
  crossfade(scenes[4], scenes[0], 22.3);
  tl.call(function () { setActiveStep(0); setDots(0); }, null, 22.35);
  tweenUrl(url0, 22.35);
  tweenCaption(cap0, 22.35);
  chaosEntrance(22.35);
  tl.to(railProgress, { scaleY: 0, duration: 0.55 }, 22.35);
  tl.to(device, { scale: 0.985, duration: 0.5 }, 22.35);
  tl.set(
    [tagNotes, tagTasks, tagRoadmap, tagAnalytics, hiNotes, hiTasks, hiRoadmap, hiAnalytics],
    { autoAlpha: 0 },
    22.3
  );
  [shotNotes, shotTasks, shotRoadmap, shotAnalytics].forEach(function (img) {
    if (img) tl.set(img, { xPercent: -50, y: 0, scale: 1, opacity: 1 }, 22.3);
  });

  /* Pad to exact loop length */
  var pad = LOOP - tl.duration();
  if (pad > 0.01) tl.to({}, { duration: pad }, '>');

  /* ── Viewport-aware playback ── */
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) tl.play();
        else tl.pause();
      });
    },
    { threshold: 0.38 }
  );
  observer.observe(reel);

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) tl.pause();
    else if (reel.getBoundingClientRect().top < window.innerHeight && reel.getBoundingClientRect().bottom > 0) {
      tl.play();
    }
  });

  window.addEventListener(
    'resize',
    function () {
      if (railProgress && railLine) {
        gsap.set(railProgress, { height: railLine.offsetHeight });
      }
    },
    { passive: true }
  );
})();
