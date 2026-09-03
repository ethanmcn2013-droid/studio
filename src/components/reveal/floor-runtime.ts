// @ts-nocheck
/* Direction A runtime: the scene engine and the four scenes (hero relay,
   Notes, Tasks, Timeline) plus the words strike-through. Ported verbatim
   from the verified static build; DOM-driven on purpose so the product
   frames stay static markup React never reconciles. */
export function startFloor() {
  if (typeof window === "undefined") return;
  if (document.documentElement.dataset.floorScenes === "1") return;
  document.documentElement.dataset.floorScenes = "1";

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function(s, r){ return (r||document).querySelector(s); };
  var $$ = function(s, r){ return [].slice.call((r||document).querySelectorAll(s)); };
  var EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';

  /* ── a tiny scene runner: steps are [ms, fn]; reset and finish are provided per scene ── */
  function makeScene(opts){
    var timers = [], anims = [], playing = false;
    function clear(){ timers.forEach(clearTimeout); timers = []; anims.forEach(function(a){ try{ a.cancel(); }catch(e){} }); anims = []; }
    function at(ms, fn){ timers.push(setTimeout(fn, ms * (window.__slow || 1))); }
    var api = {
      play: function(){
        clear(); opts.root.classList.remove('done'); opts.reset();
        if (reduce){ opts.finish(); opts.root.classList.add('done'); return; }
        playing = true;
        var end = opts.steps(at, function(a){ anims.push(a); return a; });
        at((end || opts.length) + 200, function(){ playing = false; opts.root.classList.add('done'); });
      },
      finish: function(){ clear(); opts.reset(); opts.finish(); opts.root.classList.add('done'); }
    };
    return api;
  }

  /* typewriter, cancellable through the scene timers */
  function typeInto(at, el, text, startMs, cps, onChar){
    var per = 1000 / cps, i = 0, n = text.length;
    for (i = 1; i <= n; i++){
      (function(k){ at(startMs + k * per, function(){ el.textContent = text.slice(0, k); if (onChar) onChar(k); }); })(i);
    }
    return startMs + n * per;
  }
  function wordsInto(at, el, text, startMs, wps, onWord){
    var words = text.split(' '), per = 1000 / wps;
    words.forEach(function(w, i){ at(startMs + (i + 1) * per, function(){ var s = words.slice(0, i + 1).join(' '); el.textContent = s; if (onWord) onWord(s.length); }); });
    return startMs + words.length * per;
  }
  function moveCursor(cur, x, y, ms, keep){
    cur.style.opacity = 1;
    var from = cur.__pos || {x: x, y: y};
    var a = cur.animate([{ transform: 'translate(-50%,-50%) translate(' + from.x + 'px,' + from.y + 'px)' }, { transform: 'translate(-50%,-50%) translate(' + x + 'px,' + y + 'px)' }], { duration: ms, easing: EASE, fill: 'forwards' });
    cur.__pos = {x: x, y: y};
    return keep ? a : a;
  }
  function relTo(el, container){ var a = el.getBoundingClientRect(), b = container.getBoundingClientRect(); return { x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height, cx: a.left - b.left + a.width/2, cy: a.top - b.top + a.height/2 }; }

  /* ═══ notes ═══ */
  var notesRoot = $('#notes-app');
  var gothrough = $('#gothrough'), comp = $('#comp'), compTxt = $('.txt .w', comp), cnt = $('.cnt', comp), nrows = $('#nrows'), tdn = $('.tdn', notesRoot), ghost = $('#ghost'), ncur = $('#ncur'), nscr = $('.scr', notesRoot);
  var NOTE1 = 'Ask the venue whether the ballroom can be accessed from 8am on the Saturday. If not we lose the whole morning setup and the florist has to come back twice.';
  var NOTE2 = 'Hire company called back. Sides are €140 more than last year. Book the marquee sides for the Saturday and confirm the 8am access with them.';
  var baseRows = nrows.innerHTML;
  function rowHTML(text, pill, when, dictated){
    return '<div class="nrow new"><span class="g' + (dictated ? '' : ' v') + '"></span><span>' + text + '</span><span class="ui-pill">' + pill + '</span><span class="t">' + when + '</span></div>';
  }
  var notesScene = makeScene({
    root: notesRoot, length: 11800,
    reset: function(){
      comp.className = 'comp'; compTxt.textContent = ''; cnt.textContent = '0 / 10,000';
      nrows.innerHTML = baseRows; tdn.textContent = '1'; gothrough.textContent = 'Go through 8 notes'; ghost.style.opacity = 0; ghost.getAnimations().forEach(function(a){ a.cancel(); });
      ncur.style.opacity = 0; ncur.__pos = null; notesRoot.classList.remove('stage-full', 'morphing');
    },
    finish: function(){
      notesRoot.classList.add('stage-full');
      nrows.innerHTML = rowHTML(NOTE2, 'To decide', 'Just now', true) + rowHTML(NOTE1, 'In Tasks', '1 minute ago', false).replace('nrow new', 'nrow sent') + baseRows;
      $$('.nrow.new', nrows).forEach(function(r){ r.classList.remove('new'); });
      tdn.textContent = '2'; gothrough.textContent = 'Go through 9 notes';
    },
    steps: function(at, keep){
      /* 1 · type the first note */
      at(300, function(){ comp.classList.add('typing'); });
      var t1 = typeInto(at, compTxt, NOTE1, 500, 64, function(k){ cnt.textContent = k + ' / 10,000'; });
      at(t1 + 200, function(){ comp.classList.remove('typing'); comp.classList.add('filled'); });
      /* 2 · save it: the text lifts out and lands as the first row */
      at(t1 + 700, function(){ comp.classList.add('saving'); });
      at(t1 + 850, function(){
        comp.classList.remove('saving','filled'); compTxt.textContent = ''; cnt.textContent = '0 / 10,000';
        nrows.insertAdjacentHTML('afterbegin', rowHTML(NOTE1, 'To decide', 'Just now', false)); tdn.textContent = '2'; gothrough.textContent = 'Go through 9 notes';
        shape(notesRoot, 'stage-full');
      });
      /* 3 · dictate the second note */
      var t2 = t1 + 1900;
      at(t2, function(){ comp.classList.add('dictating','typing'); });
      var t3 = typeInto(at, compTxt, NOTE2, t2 + 300, 64, function(k){ cnt.textContent = k + ' / 10,000'; });
      at(t3 + 300, function(){ comp.classList.remove('typing','dictating'); comp.classList.add('filled'); });
      at(t3 + 800, function(){ comp.classList.add('saving'); });
      at(t3 + 950, function(){
        comp.classList.remove('saving','filled'); compTxt.textContent = ''; cnt.textContent = '0 / 10,000';
        nrows.insertAdjacentHTML('afterbegin', rowHTML(NOTE2, 'To decide', 'Just now', true)); tdn.textContent = '3'; gothrough.textContent = 'Go through 10 notes';
        $$('.nrow', nrows)[1].querySelector('.t').textContent = '1 minute ago';
      });
      /* 4 · the first note is swiped right, and goes on to Tasks */
      var t4 = t3 + 1800;
      at(t4, function(){
        var row = $$('.nrow', nrows)[1]; var p = relTo(row, nscr);
        ncur.__pos = { x: p.x + 40, y: p.cy + 70 };
        keep(moveCursor(ncur, p.x + 40, p.cy, 500));
      });
      at(t4 + 600, function(){
        var row = $$('.nrow', nrows)[1]; row.classList.add('swiping'); ncur.classList.add('click');
        var p = relTo(row, nscr);
        keep(row.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(112px)' }], { duration: 650, easing: EASE, fill: 'forwards' }));
        keep(ncur.animate([{ transform: 'translate(-50%,-50%) translate(' + (p.x + 40) + 'px,' + p.cy + 'px)' }, { transform: 'translate(-50%,-50%) translate(' + (p.x + 152) + 'px,' + p.cy + 'px)' }], { duration: 650, easing: EASE, fill: 'forwards' }));
        ncur.__pos = { x: p.x + 152, y: p.cy };
      });
      at(t4 + 1500, function(){
        var row = $$('.nrow', nrows)[1];
        row.getAnimations().forEach(function(a){ a.cancel(); });
        keep(row.animate([{ transform: 'translateX(112px)' }, { transform: 'translateX(0)' }], { duration: 320, easing: EASE, fill: 'forwards' }));
        setTimeout(function(){ row.classList.remove('swiping'); ncur.classList.remove('click'); }, 320);
        row.classList.add('sent','flash');
        var pill = $('.ui-pill', row); pill.textContent = 'In Tasks'; pill.classList.add('soft');
        tdn.textContent = '2'; gothrough.textContent = 'Go through 9 notes';
        /* a card lifts out of the row and leaves for Tasks */
        var p = relTo(row, nscr);
        $('h5', ghost).textContent = 'Ask whether the ballroom opens at 8am on the Saturday';
        ghost.style.left = (p.x + 20) + 'px'; ghost.style.top = (p.y + 4) + 'px';
        keep(ghost.animate([
          { opacity: 0, transform: 'translate(0,0) scale(.96)' },
          { opacity: 1, transform: 'translate(0,-8px) scale(1)', offset: .2 },
          { opacity: 1, transform: 'translate(160px,-120px) scale(1)', offset: .75 },
          { opacity: 0, transform: 'translate(260px,-220px) scale(.98)' }
        ], { duration: 1300, easing: EASE, fill: 'forwards' }));
        keep(ncur.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, delay: 200, fill: 'forwards' }));
      });
      return t4 + 3200;
    }
  });

  /* ═══ tasks ═══ */
  var tasksRoot = $('#tasks-app'), ttoday = $('#ttoday'), tprog = $('#tprog'), tpct = $('#tpct'), tstack = $('.stack', $('#tasks-app')), board = $('#board'), listview = $('#listview'), tseg = $('#tseg'), tcur = $('#tcur'), tscr = $('.scr', tasksRoot);
  function fitTasks(){ var active = listview.classList.contains('in') ? listview : board; tstack.style.height = active.scrollHeight + 'px'; }
  var colTodo = $('.col.c1 .cards', board), colProg = $('.col.c2 .cards', board), cntTodo = $('.col.c1 .cnt', board), cntProg = $('.col.c2 .cnt', board);
  var NEWCARD = '<div class="card arrive" id="newcard"><span class="ui-check"></span><div><h4>Ask whether the ballroom opens at 8am on the Saturday</h4><p>From this morning’s note. If not, the florist comes back twice.</p></div><div class="meta"><u>Orla</u><span>High</span></div><span class="ui-pill tint when">Today</span></div>';
  function segTo(seg, idx){
    var items = $$('span:not(.ind)', seg), ind = $('.ind', seg); var target = items[idx];
    items.forEach(function(s, i){ s.classList.toggle('on', i === idx); });
    ind.style.width = target.offsetWidth + 'px'; ind.style.transform = 'translateX(' + (target.offsetLeft - 3) + 'px)';
  }
  var tasksScene = makeScene({
    root: tasksRoot, length: 13200,
    reset: function(){
      var old = $('#newcard'); if (old) old.remove(); $$('.slot', board).forEach(function(s){ s.remove(); });
      cntTodo.textContent = '3'; cntProg.textContent = '3'; ttoday.textContent = '1 today'; tcur.classList.remove('click'); tprog.style.width = '0%'; tpct.textContent = '0%'; tasksRoot.classList.remove('stage-wide', 'stage-list', 'morphing');
      board.classList.remove('zoom','out'); board.style.transform = ''; board.style.transformOrigin = '';
      listview.classList.remove('in'); segTo(tseg, 0); tcur.style.opacity = 0; tcur.__pos = null; fitTasks();
    },
    finish: function(){ colProg.insertAdjacentHTML('afterbegin', NEWCARD.replace(' arrive','')); cntProg.textContent = '4'; ttoday.textContent = '2 today'; tprog.style.width = '38%'; tpct.textContent = '38%'; tasksRoot.classList.add('stage-wide'); setTimeout(fitTasks, 50); },
    steps: function(at, keep){
      /* the frame springs wide for the board, the progress bar fills */
      at(0, function(){ shape(tasksRoot, 'stage-wide'); });
      at(300, function(){ tprog.style.width = '38%'; });
      countTo(at, keep, tpct, 38, 300, 1100, '%');
      /* 1 · the sentence from Notes arrives as a card in To do */
      at(600, function(){ colTodo.insertAdjacentHTML('afterbegin', NEWCARD); cntTodo.textContent = '4'; fitTasks(); });
      /* 2 · pick it up */
      at(1700, function(){
        var card = $('#newcard'); var p = relTo(card, tscr);
        tcur.__pos = { x: p.cx + 40, y: p.cy + 120 };
        keep(moveCursor(tcur, p.cx, p.cy, 600));
      });
      at(2400, function(){
        tcur.classList.add('click');
        var card = $('#newcard'); card.classList.add('lift');
        var p = relTo(card, board);
        board.style.transformOrigin = p.cx + 'px ' + p.cy + 'px';
        board.classList.add('zoom'); board.style.transform = 'scale(1.22)';
      });
      /* 3 · a slot opens in In progress, the card travels, the gap behind it closes */
      at(3300, function(){
        var card = $('#newcard');
        var scale = board.getBoundingClientRect().width / board.offsetWidth;
        var from = relTo(card, board);
        var src = document.createElement('div'); src.className = 'slot'; src.style.height = (from.h / scale) + 'px'; src.style.border = '0';
        card.style.position = 'absolute'; card.style.left = (from.x / scale) + 'px'; card.style.top = (from.y / scale) + 'px'; card.style.width = (from.w / scale) + 'px'; card.style.zIndex = 9;
        board.appendChild(card); colTodo.insertBefore(src, colTodo.firstChild);
        var dst = document.createElement('div'); dst.className = 'slot'; colProg.insertBefore(dst, colProg.firstChild);
        requestAnimationFrame(function(){ dst.style.height = (from.h / scale) + 'px'; });
        at(150, function(){});
        setTimeout(function(){
          var to = relTo(dst, board);
          var dx = (to.x - from.x) / scale, dy = (to.y - from.y) / scale;
          keep(tcur.animate([{ transform: 'translate(-50%,-50%) translate(' + tcur.__pos.x + 'px,' + tcur.__pos.y + 'px)' }, { transform: 'translate(-50%,-50%) translate(' + (tcur.__pos.x + dx*scale) + 'px,' + (tcur.__pos.y + dy*scale) + 'px)' }], { duration: 900, easing: EASE, fill: 'forwards' }));
          tcur.__pos = { x: tcur.__pos.x + dx*scale, y: tcur.__pos.y + dy*scale };
          var a = card.animate([{ transform: 'translate(0,0) scale(1.03) rotate(-1.2deg)' }, { transform: 'translate(' + dx*.5 + 'px,' + (dy*.5 - 14) + 'px) scale(1.04) rotate(1deg)', offset: .5 }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(1.03) rotate(-.6deg)' }], { duration: 900, easing: EASE, fill: 'forwards' });
          keep(a);
          src.style.height = '0px'; cntTodo.textContent = '3';
          a.onfinish = function(){
            a.cancel(); card.classList.remove('lift'); card.style.cssText = ''; dst.replaceWith(card); src.remove(); cntProg.textContent = '4'; ttoday.textContent = '2 today'; tcur.classList.remove('click');
            keep(card.animate([{ transform: 'scale(1.03)' }, { transform: 'scale(1)' }], { duration: 300, easing: EASE }));
          };
        }, 320);
      });
      /* 4 · zoom back out, cursor leaves */
      at(5100, function(){ board.style.transform = 'scale(1)'; keep(tcur.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' })); });
      at(5900, function(){ board.classList.remove('zoom'); });
      /* 5 · same work, as a list */
      at(7200, function(){ shape(tasksRoot, 'stage-list'); segTo(tseg, 1); board.classList.add('out'); listview.classList.add('in'); fitTasks(); });
      /* 6 · and back to the board */
      at(11600, function(){ shape(tasksRoot, 'stage-wide'); segTo(tseg, 0); board.classList.remove('out'); listview.classList.remove('in'); fitTasks(); });
      return 12000;
    }
  });

  /* ═══ timeline ═══ */
  var timeRoot = $('#time-app'), tltop = $('.tl-top', timeRoot), tlpage = $('#tlpage'), tlnum = $('#tlnum'), tltrack = $('#tltrack'), tlacross = $('#tlacross'), tldown = $('#tldown'), tlseg = $('#tlseg'), getlink = $('#getlink'), tltoast = $('#tltoast');
  var ms = $$('.ms', tltrack), downItems = $$('li', tldown), tlstack = $('.tl-stack', timeRoot);
  function fitStack(){ var active = tldown.classList.contains('in') ? tldown : tlacross; tlstack.style.height = active.scrollHeight + 'px'; }
  function shape(el, cls){
    el.classList.remove('stage-wide', 'stage-tall', 'stage-list', 'stage-full'); if (cls) el.classList.add(cls);
    el.classList.add('morphing'); clearTimeout(el.__mt); el.__mt = setTimeout(function(){ el.classList.remove('morphing'); refit(el); }, 1000);
  }
  function refit(el){ if (el === timeRoot) fitStack(); if (el === tasksRoot) fitTasks(); }
  [timeRoot, tasksRoot, notesRoot].forEach(function(el){ el.addEventListener('transitionend', function(e){ if (e.target === el && e.propertyName === 'width') refit(el); }); });
  function countTo(at, keep, el, target, startMs, dur, suffix){
    var t0 = null;
    function step(ts){ if (t0 === null) t0 = ts; var p = Math.min(1, (ts - t0) / dur); var e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(e * target) + (suffix || ''); if (p < 1) el.__raf = requestAnimationFrame(step); }
    at(startMs, function(){ el.__raf = requestAnimationFrame(step); });
  }
  var timelineScene = makeScene({
    root: timeRoot, length: 12400,
    reset: function(){
      if (tlnum.__raf) cancelAnimationFrame(tlnum.__raf); tlnum.textContent = '0';
      tlpage.classList.remove('built'); tltrack.classList.remove('draw'); ms.forEach(function(m){ m.classList.remove('in'); });
      tlacross.classList.remove('out'); tldown.classList.remove('in'); timeRoot.classList.remove('stage-wide', 'stage-tall', 'morphing'); tltop.classList.remove('night'); downItems.forEach(function(l){ l.classList.remove('in'); }); segTo(tlseg, 0); getlink.classList.remove('pulse'); fitStack(); tltoast.classList.remove('in');
    },
    finish: function(){ tlnum.textContent = '79'; tlpage.classList.add('built'); tltrack.classList.add('draw'); ms.forEach(function(m){ m.classList.add('in'); }); timeRoot.classList.add('stage-wide'); setTimeout(fitStack, 50); },
    steps: function(at, keep){
      /* the frame springs wide for the across view */
      at(0, function(){ shape(timeRoot, 'stage-wide'); });
      countTo(at, keep, tlnum, 79, 500, 1500);
      at(1100, function(){ tlpage.classList.add('built'); });
      at(1700, function(){ tltrack.classList.add('draw'); });
      ms.forEach(function(m, i){ at(1800 + i * 170, function(){ m.classList.add('in'); }); });
      /* the same seven dates, down the page */
      at(5200, function(){ shape(timeRoot, 'stage-tall'); segTo(tlseg, 1); tlacross.classList.add('out'); tldown.classList.add('in'); tltop.classList.add('night'); fitStack(); });
      downItems.forEach(function(l, i){ at(5400 + i * 110, function(){ l.classList.add('in'); }); });
      /* and back across, then the link is ready to share */
      at(10400, function(){ shape(timeRoot, 'stage-wide'); segTo(tlseg, 0); tldown.classList.remove('in'); tlacross.classList.remove('out'); tltop.classList.remove('night'); fitStack(); });
      at(11500, function(){ getlink.classList.add('pulse'); });
      at(11900, function(){ tltoast.classList.add('in'); });
      at(12300, function(){ getlink.classList.remove('pulse'); });
      at(14600, function(){ tltoast.classList.remove('in'); });
      return 12500;
    }
  });

  /* ═══ hero relay ═══ */
  var stage = $('#hero-stage'), pNote = $('#p-note'), pTask = $('#p-task'), pTime = $('#p-time'), c1 = $('#c1'), c2 = $('#c2'), hnum = $('#hnum'), hState = $('#h-state'), hSt = $('#h-st');
  function carry(el, dx, dy, keep){
    keep(el.animate([
      { opacity: 0, transform: 'translate(0,0) scale(.96)' },
      { opacity: 1, transform: 'translate(' + dx*.08 + 'px,' + dy*.02 + 'px) scale(1)', offset: .14 },
      { opacity: 1, transform: 'translate(' + dx*.6 + 'px,' + dy*.55 + 'px) scale(1.02)', offset: .6 },
      { opacity: 1, transform: 'translate(' + dx + 'px,' + dy + 'px) scale(1)', offset: .88 },
      { opacity: 0, transform: 'translate(' + dx + 'px,' + (dy + 6) + 'px) scale(.98)' }
    ], { duration: 900, easing: EASE, fill: 'forwards' }));
  }
  var heroScene = makeScene({
    root: stage, length: 6200,
    reset: function(){
      stage.className = 'stage ui'; [pNote, pTask, pTime].forEach(function(p){ p.classList.remove('in','lit'); });
      [c1, c2].forEach(function(c){ c.getAnimations().forEach(function(a){ a.cancel(); }); c.style.opacity = 0; });
      if (hnum.__raf) cancelAnimationFrame(hnum.__raf); hnum.textContent = '0'; hState.textContent = 'To do'; hSt.textContent = 'To do';
    },
    finish: function(){ stage.classList.add('swept','sent','moving','drawn','live'); [pNote, pTask, pTime].forEach(function(p){ p.classList.add('in'); }); hnum.textContent = '79'; hState.textContent = 'In progress'; hSt.textContent = 'In progress'; },
    steps: function(at, keep){
      at(150, function(){ pNote.classList.add('in','lit'); });
      at(800, function(){ stage.classList.add('swept'); });
      at(1500, function(){ pNote.classList.remove('lit'); carry(c1, 64, 186, keep); });
      at(2150, function(){ pTask.classList.add('in','lit'); stage.classList.add('sent'); });
      at(2900, function(){ stage.classList.add('moving'); hState.textContent = 'In progress'; hSt.textContent = 'In progress'; });
      at(3300, function(){ pTask.classList.remove('lit'); carry(c2, -30, 200, keep); });
      at(3950, function(){ pTime.classList.add('in','lit'); });
      countTo(at, keep, hnum, 79, 4100, 1300);
      at(4300, function(){ stage.classList.add('drawn'); });
      at(5200, function(){ stage.classList.add('live'); });
      at(5700, function(){ pTime.classList.remove('lit'); });
      return 5900;
    }
  });

  /* hero parallax: the three panes sit at three depths under the pointer */
  (function(){
    if (reduce || !window.matchMedia('(hover: hover)').matches) return;
    var host = stage.parentElement, depths = [6, 10, 8], raf = null, tx = 0, ty = 0;
    host.addEventListener('mousemove', function(e){
      var r = host.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - .5; ty = (e.clientY - r.top) / r.height - .5;
      if (!raf) raf = requestAnimationFrame(apply);
    });
    host.addEventListener('mouseleave', function(){ tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(apply); });
    function apply(){ raf = null; if (!stage.classList.contains('done')) return; [pNote, pTask, pTime].forEach(function(p, i){ p.style.transform = 'translate(' + (-tx * depths[i]) + 'px,' + (-ty * depths[i]) + 'px)'; }); }
  })();

  /* ═══ words ═══ */
  var nowords = $('#nowords'), yeswords = $('#yeswords'), wordSpans = $$('span', nowords);
  function strikeWords(){
    if (reduce){ wordSpans.forEach(function(s){ s.classList.add('x'); }); yeswords.classList.add('in'); return; }
    wordSpans.forEach(function(s, i){ s.style.transitionDelay = (200 + i * 140) + 'ms'; s.classList.add('x'); });
    yeswords.style.transitionDelay = (200 + wordSpans.length * 140 + 300) + 'ms'; yeswords.classList.add('in');
  }

  /* ═══ wiring ═══ */
  var scenes = { hero: heroScene, notes: notesScene, tasks: tasksScene, timeline: timelineScene };
  (window as any).__scenes = scenes;
  $$('.replay').forEach(function(b){ b.addEventListener('click', function(){ scenes[b.getAttribute('data-scene')].play(); }); });
  if (document.fonts && document.fonts.ready){ document.fonts.ready.then(function(){ heroScene.play(); }); } else { heroScene.play(); }
  segTo(tseg, 0); segTo(tlseg, 0);
  window.addEventListener('resize', function(){ if (!$('.list-view.in')) segTo(tseg, 0); if (!tldown.classList.contains('in')) segTo(tlseg, 0); fitStack(); fitTasks(); });
  fitStack(); fitTasks(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ fitStack(); fitTasks(); });

  if (!('IntersectionObserver' in window) || reduce){
    $$('.rise').forEach(function(el){ el.classList.add('is-in'); });
    Object.keys(scenes).forEach(function(k){ scenes[k].finish(); });
    strikeWords();
    return;
  }
  var riseIO = new IntersectionObserver(function(entries){ entries.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('is-in'); riseIO.unobserve(e.target); } }); }, { threshold: .12 });
  $$('.rise').forEach(function(el){ riseIO.observe(el); });
  var played = {};
  var sceneIO = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (!e.isIntersecting) return;
      var id = e.target.id.replace('-app',''); if (played[id]) return; played[id] = true;
      scenes[id === 'time' ? 'timeline' : id].play(); sceneIO.unobserve(e.target);
    });
  }, { threshold: .4 });
  [notesRoot, tasksRoot, timeRoot].forEach(function(el){ sceneIO.observe(el); });
  var wordsIO = new IntersectionObserver(function(entries){ entries.forEach(function(e){ if (e.isIntersecting){ strikeWords(); wordsIO.disconnect(); } }); }, { threshold: .5 });
  wordsIO.observe(nowords);

}
