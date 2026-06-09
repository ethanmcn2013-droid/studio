/* Live product wordmark loops for deck thumbs — mirrors production hero choreography */
(function () {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function staggerLetters(letters, gap = 55) {
    letters.forEach((el, i) => {
      setTimeout(() => el.classList.add('pm-in'), i * gap);
    });
  }

  function resetLetters(letters) {
    letters.forEach((el) => el.classList.remove('pm-in'));
  }

  /* ── Notes ── */
  async function loopNotes(root) {
    const letters = [...root.querySelectorAll('.nhv-letter')];
    const mark = root.querySelector('.nhv-mark');
    const ripples = root.querySelectorAll('.nhv-ripple, .nhv-ripple-slow');
    const trails = root.querySelectorAll('.nhv-trail');

    for (;;) {
      resetLetters(letters);
      mark.className = 'nhv-mark';
      ripples.forEach((r) => { r.style.animation = 'none'; void r.offsetWidth; });
      trails.forEach((t) => { t.style.opacity = '0'; });

      await sleep(120);
      staggerLetters(letters, 50);

      mark.classList.add('pm-roll');
      await sleep(2800);

      mark.classList.remove('pm-roll');
      mark.classList.add('pm-caret');
      await sleep(3600);
    }
  }

  /* ── Tasks ── */
  const TASK_PHRASES = ['confirm menu', 'book florist'];
  const TASK_TAG = 'Hartwell Wedding';

  function renderFlipChars(container, text) {
    container.innerHTML = '<div class="txr-strike"></div>';
    const strike = container.querySelector('.txr-strike');
    text.split('').forEach((ch) => {
      const span = document.createElement('span');
      span.className = ch === ' ' ? 'txr-sp' : 'txr-ch';
      if (ch !== ' ') span.textContent = ch;
      container.insertBefore(span, strike);
    });
    return strike;
  }

  async function flipPhrase(container, text) {
    const strike = renderFlipChars(container, text);
    const chars = [...container.querySelectorAll('.txr-ch')];
    for (const ch of chars) {
      ch.style.transform = 'translateY(110%)';
      ch.style.transition = 'transform .22s cubic-bezier(.5,0,0,1)';
      await sleep(18);
      ch.style.transform = 'translateY(0)';
    }
    await sleep(680);
    strike.classList.add('txr-on');
    await sleep(520);
    for (const ch of chars) {
      ch.style.transform = 'translateY(-110%)';
      await sleep(14);
    }
    await sleep(180);
  }

  async function showTasksWordmark(root) {
    const panel = root.querySelector('.txr-panel');
    const wm = root.querySelector('.txr-wm');
    const flip = root.querySelector('.txr-flip-text');
    const inner = root.querySelector('.txr-wm-inner');
    const dot = root.querySelector('.txr-wmdot');
    const chars = 'tasks'.split('');

    inner.textContent = '';
    chars.forEach((c) => {
      const span = document.createElement('span');
      span.className = 'txr-wm-ch';
      span.textContent = c;
      inner.appendChild(span);
    });
    inner.appendChild(dot);

    panel.classList.add('pm-hide');
    wm.classList.add('txr-vis');

    const wmChars = [...inner.querySelectorAll('.txr-wm-ch')];
    wmChars.forEach((c, i) => setTimeout(() => c.classList.add('pm-in'), i * 45));
    await sleep(wmChars.length * 45 + 120);
    dot.classList.add('txr-on');
    await sleep(2400);

    dot.classList.remove('txr-on');
    wm.classList.remove('txr-vis');
    panel.classList.remove('pm-hide');
    wmChars.forEach((c) => c.classList.remove('pm-in'));
    flip.innerHTML = '<div class="txr-strike"></div>';
  }

  async function loopTasks(root) {
    const panel = root.querySelector('.txr-panel');
    const topRule = root.querySelector('.txr-rule-top');
    const botRule = root.querySelector('.txr-rule-bot');
    const meta = root.querySelector('.txr-meta');
    const tag = root.querySelector('.txr-meta-tag');
    const dotsWrap = root.querySelector('.txr-meta-dots');
    const flip = root.querySelector('.txr-flip-text');

    tag.textContent = TASK_TAG;
    dotsWrap.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const d = document.createElement('span');
      d.className = 'txr-meta-dot' + (i === 0 ? ' txr-act' : '');
      dotsWrap.appendChild(d);
    }

    for (;;) {
      topRule.classList.remove('txr-on');
      botRule.classList.remove('txr-on');
      meta.classList.remove('txr-on');
      flip.innerHTML = '<div class="txr-strike"></div>';
      await sleep(200);

      topRule.classList.add('txr-on');
      await sleep(180);
      meta.classList.add('txr-on');
      await sleep(220);

      for (const phrase of TASK_PHRASES) {
        await flipPhrase(flip, phrase);
      }

      botRule.classList.add('txr-on');
      await sleep(280);
      await showTasksWordmark(root);
      await sleep(400);
    }
  }

  /* ── Analytics ── */
  async function loopAnalytics(root) {
    const letters = [...root.querySelectorAll('.anl-letter')];
    const dot = root.querySelector('.anl-dot');
    const bars = [...root.querySelectorAll('.anl-bar')];

    for (;;) {
      resetLetters(letters);
      dot.className = 'anl-dot';
      bars.forEach((b) => b.classList.remove('anl-risen'));

      await sleep(150);
      staggerLetters(letters, 42);
      dot.classList.add('pm-roll');
      await sleep(2400);

      for (const [i, bar] of bars.entries()) {
        await sleep(120);
        bar.classList.add('anl-risen');
        if (i === bars.length - 1) bar.style.opacity = '0.72';
      }
      await sleep(3200);

      bars.forEach((b) => {
        b.classList.remove('anl-risen');
        b.style.opacity = '';
      });
    }
  }

  /* ── Roadmap ── */
  async function loopRoadmap(root) {
    const letters = [...root.querySelectorAll('.rml-letter')];
    const dot = root.querySelector('.rml-dot');

    for (;;) {
      resetLetters(letters);
      dot.className = 'rml-dot';
      await sleep(150);
      staggerLetters(letters, 40);
      dot.classList.add('pm-roll');
      await sleep(4200);
    }
  }

  function initThumb(el) {
    const kind = el.dataset.pm;
    if (kind === 'notes') loopNotes(el);
    else if (kind === 'tasks') loopTasks(el);
    else if (kind === 'analytics') loopAnalytics(el);
    else if (kind === 'roadmap') loopRoadmap(el);
  }

  document.querySelectorAll('[data-pm]').forEach(initThumb);
})();
