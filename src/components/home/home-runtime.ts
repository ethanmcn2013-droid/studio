// @ts-nocheck
/* The home page runtime: the working Home sample, the pinned Tasks story, the
   plates and their tabs, the whiteboard and its four sample people, the theme
   switch, the header marker and the dot run above the footer. DOM-driven on
   purpose: the markup is static and React never reconciles what this touches.

   Nothing here decides how tall the page is. Every frame has its size in the
   markup and the style sheet, so a deep link, a reload and a restored scroll
   position all land where they should before this file has run.

   startHome(root) returns a stop function. Every listener, timer, observer
   and animation it starts is tracked, so stopping leaves nothing behind and
   starting again on the same markup is safe. */
import { themed } from "./shot-sources";
import { HOME_THEME_COLOR, THEME_KEY } from "./theme-color";
import { GROUP_NAME, NOTES, STRAY, arrowPaths, handSpots, layoutWall } from "./whiteboard-layout";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const EASE_IN_OUT = "cubic-bezier(0.77, 0, 0.175, 1)";

/* The theme the page should open in: ?theme=light|dark, else the visitor's
   last choice on this device, else the device setting, else dark. */
export function openingTheme() {
  var t = null;
  try { t = new URLSearchParams(location.search).get("theme"); } catch (e) {}
  if (t !== "light" && t !== "dark") { try { t = localStorage.getItem(THEME_KEY); } catch (e) {} }
  if (t !== "light" && t !== "dark") t = window.matchMedia && matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  return t;
}

function point(im, theme) {
  var set = im.getAttribute("srcset"), src = im.getAttribute("src");
  if (set) im.setAttribute("srcset", themed(set, theme));
  if (src) im.setAttribute("src", themed(src, theme));
}

/* What the inline boot script in home-page.tsx does while the page is parsed,
   for the times it does not run (arriving by a client-side link). */
export function bootHome(root) {
  if (!root || root.classList.contains("js")) return;
  var t = openingTheme();
  root.setAttribute("data-theme", t);
  root.classList.add("js");
  if (t === "light") Array.prototype.slice.call(root.querySelectorAll("img[data-shot]")).forEach(function (im) { point(im, "light"); });
}

export function startHome(root) {
  if (typeof window === "undefined" || !root) return function () {};
  var dead = false, offs = [], timers = new Set(), observers = [], stops = [];
  function on(el, type, fn, opts) { el.addEventListener(type, fn, opts); offs.push(function () { el.removeEventListener(type, fn, opts); }); }
  function later(fn, ms) { var id = setTimeout(function () { timers.delete(id); if (!dead) fn(); }, ms); timers.add(id); return id; }
  function watch(fn, opts) { var o = new IntersectionObserver(fn, opts); observers.push(o); return o; }
  var $ = function (s, c) { return (c || root).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || root).querySelectorAll(s)); };
  var byId = function (id) { return root.querySelector("#" + id); };
  var reduceQuery = matchMedia("(prefers-reduced-motion: reduce)");
  var reduce = reduceQuery.matches;
  var live = $("#live");
  function announce(t) { live.textContent = ""; requestAnimationFrame(function () { if (!dead) live.textContent = t; }); }

  /* Smooth scrolling starts after the page has landed, so a deep link or a restored
     position arrives at once and only the visitor's own jumps are eased. */
  function settle() { later(function () { root.classList.add("smooth"); }, 60); }
  if (document.readyState === "complete") settle(); else on(window, "load", settle);
  stops.push(function () { root.classList.remove("smooth"); });

  /* ── The dot run. The dot hops along the line, sends out a signal each time it
     lands, and settles into the ring to make the mark. It plays once, the first
     time it is seen; the button plays it again. Still under reduced motion. ── */
  (function () {
    var run = byId("dotrun"), dot = byId("dotrun-dot"), ring = byId("dotrun-ring");
    if (!run || !dot || !ring || !dot.animate) return;
    var playing = [];
    function clear() {
      playing.forEach(function (a) { a.cancel(); });
      playing = [];
      $$(".dotrun-ping", run).forEach(function (p) { p.remove(); });
    }
    function endX() { return ring.offsetLeft + ring.offsetWidth / 2; }
    function rest() {
      clear();
      run.classList.add("still");
      dot.style.transform = "translate(" + endX() + "px, 0)";
    }
    function play() {
      clear();
      run.classList.remove("still");
      var start = 24, end = endX(), span = end - start;
      var hops = span < 420 ? 3 : span < 800 ? 4 : 5;
      var hop = 620, pause = 150, lead = 450, total = lead + hops * (hop + pause);
      var frames = [{ transform: "translate(" + start + "px, 0) scale(1, 1)", offset: 0 }];
      var at = lead;
      for (var i = 0; i < hops; i++) {
        var x0 = start + (span * i) / hops, x1 = start + (span * (i + 1)) / hops, xm = (x0 + x1) / 2;
        var last = i === hops - 1, height = last ? 52 : 34 + (i % 2) * 10;
        // crouch, rise, fall, land: squash and stretch give it weight
        frames.push({ transform: "translate(" + x0 + "px, 0) scale(1.18, 0.8)", offset: at / total, easing: EASE_OUT });
        frames.push({ transform: "translate(" + xm + "px, -" + height + "px) scale(0.94, 1.08)", offset: (at + hop * 0.5) / total, easing: EASE_IN_OUT });
        frames.push({ transform: "translate(" + x1 + "px, 0) scale(1.22, 0.76)", offset: (at + hop) / total, easing: EASE_OUT });
        frames.push({ transform: "translate(" + x1 + "px, 0) scale(1, 1)", offset: (at + hop + pause * 0.9) / total });
        // the signal: a ring goes out from where it landed
        if (!last) {
          var ping = document.createElement("span");
          ping.className = "dotrun-ping";
          ping.style.left = x1 + "px";
          run.appendChild(ping);
          playing.push(ping.animate([{ transform: "scale(1)", opacity: 0.7 }, { transform: "scale(4.2)", opacity: 0 }], { duration: 900, delay: at + hop, easing: EASE_OUT }));
        }
        at += hop + pause;
      }
      frames.push({ transform: "translate(" + end + "px, 0) scale(1, 1)", offset: 1 });
      var a = dot.animate(frames, { duration: total, fill: "forwards" });
      playing.push(a);
      // the ring wakes up as the dot arrives, then the mark breathes once
      playing.push(ring.animate([{ opacity: 0.35, transform: "scale(1)" }, { opacity: 1, transform: "scale(1.14)" }, { opacity: 1, transform: "scale(1)" }], { duration: 450, delay: total - 120, fill: "forwards", easing: EASE_OUT }));
      a.onfinish = function () { run.classList.add("still"); };
    }
    rest();
    if (reduce) { run.disabled = true; run.setAttribute("aria-hidden", "true"); stops.push(function () { run.disabled = false; run.removeAttribute("aria-hidden"); clear(); }); return; }
    var seen = false;
    if ("IntersectionObserver" in window) {
      var io = watch(function (entries) { if (entries[0].isIntersecting && !seen) { seen = true; io.disconnect(); play(); } }, { threshold: 0.6 });
      io.observe(run);
    }
    on(run, "click", play);
    var t;
    on(window, "resize", function () { clearTimeout(t); t = later(rest, 150); });
    stops.push(clear);
  })();

  /* ── Theme. One switch, remembered on this device, and every surface changes in the
     same frame. Captures on screen change once their other file has decoded, so a frame
     is never empty; the rest are fetched quietly afterwards. ── */
  var themeBtns = $$("[data-theme-toggle]");
  var shotImgs = $$("img[data-shot]");
  function theme() { return root.getAttribute("data-theme") === "light" ? "light" : "dark"; }
  function laidOut(im) { return !!im.offsetParent; }
  function onScreen(im) { var r = im.parentNode.getBoundingClientRect(); return r.bottom > -200 && r.top < window.innerHeight + 200; }
  var retheme = 0;
  function swap(im, t) {
    var set = im.getAttribute("srcset");
    if (!set || themed(set, t) === set) return Promise.resolve();
    if (!(im.complete && im.naturalWidth)) { point(im, t); return Promise.resolve(); }
    var pre = new Image();
    pre.sizes = im.sizes; pre.srcset = themed(set, t); pre.src = themed(im.getAttribute("src"), t);
    var done = function () { if (!dead && theme() === t) point(im, t); };
    return (pre.decode ? pre.decode() : Promise.reject()).then(done, done);
  }
  function syncShots() {
    var t = theme(), turn = ++retheme;
    var now = [], rest = [];
    shotImgs.forEach(function (im) { (laidOut(im) && onScreen(im) ? now : rest).push(im); });
    now.forEach(function (im) { swap(im, t); });
    /* The others one at a time, laid-out frames first, so a jump down the page finds them ready. */
    rest.sort(function (a, b) { return (laidOut(b) ? 1 : 0) - (laidOut(a) ? 1 : 0); });
    (function next(i) {
      if (dead || turn !== retheme || i >= rest.length) return;
      var im = rest[i];
      if (!laidOut(im)) { point(im, t); next(i + 1); return; }
      swap(im, t).then(function () { later(function () { next(i + 1); }, 30); });
    })(0);
  }
  /* The browser bar follows the page. The server sends the right colour for the opening
     theme; from here one tag of the runtime's own, first in the head so it is the one
     the browser reads, carries the page's theme. It leaves with the page, which hands
     the bar back to whatever the next route declares. */
  var barMeta = document.createElement("meta");
  barMeta.setAttribute("name", "theme-color");
  barMeta.setAttribute("data-home-theme-color", "");
  stops.push(function () { if (barMeta.parentNode) barMeta.parentNode.removeChild(barMeta); });
  function paint() {
    var t = theme();
    barMeta.setAttribute("content", HOME_THEME_COLOR[t]);
    if (!barMeta.parentNode) document.head.insertBefore(barMeta, document.head.firstChild);
    var label = "Switch to " + (t === "dark" ? "light" : "dark") + " theme";
    themeBtns.forEach(function (b) { if (b.id === "theme") b.setAttribute("aria-label", label); else b.textContent = label; });
  }
  function setTheme(t) {
    var apply = function () {
      root.classList.add("theming");
      root.setAttribute("data-theme", t);
      paint();
      void root.offsetWidth;
      requestAnimationFrame(function () { root.classList.remove("theming"); });
    };
    try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
    if (!reduce && document.startViewTransition) { try { document.startViewTransition(apply); } catch (e) { apply(); } } else apply();
    syncShots();
  }
  themeBtns.forEach(function (b) { on(b, "click", function () { setTheme(theme() === "dark" ? "light" : "dark"); }); });
  paint();
  /* Arriving by a link inside the site, the markup may still point at the other theme's files. */
  shotImgs.forEach(function (im) { var set = im.getAttribute("srcset"); if (set && themed(set, theme()) !== set) point(im, theme()); });
  /* A capture that cannot be fetched says what it was instead of leaving an empty frame. */
  shotImgs.forEach(function (im) {
    var fail = function () { im.classList.add("failed"); im.removeAttribute("width"); im.removeAttribute("height"); };
    on(im, "error", fail);
    on(im, "load", function () { im.classList.remove("failed"); });
    if (im.complete && im.currentSrc && !im.naturalWidth) fail();
  });

  /* ── Header: the hairline, the phone menu, the button that waits for the hero's own
     to leave, and the marker, which is read off the scroll position. ── */
  var nav = $("#nav"), menu = $(".menu"), menuSum = $("summary", menu), menuY = 0, closing = 0;
  function closeMenu(refocus) {
    if (!menu.open || menu.classList.contains("closing")) return;
    if (refocus) menuSum.focus();
    if (reduce) { menu.open = false; return; }
    menu.classList.add("closing");
    closing = later(function () { menu.open = false; menu.classList.remove("closing"); }, 150);
  }
  $$(".menu-panel a").forEach(function (a) { on(a, "click", function () { closeMenu(false); }); });
  on(menu, "toggle", function () { if (menu.open) { menuY = window.scrollY; menu.classList.remove("closing"); clearTimeout(closing); } });
  on(document, "pointerdown", function (e) { if (menu.open && !menu.contains(e.target)) closeMenu(false); });
  on(document, "keydown", function (e) { if (e.key === "Escape" && menu.open) { e.preventDefault(); closeMenu(true); } });
  /* Tabbing out of the menu closes it, so it never sits open over the page. */
  on(menu, "focusout", function (e) { if (menu.open && e.relatedTarget && !menu.contains(e.relatedTarget)) closeMenu(false); });

  var heroCta = $(".hero .cta-row .btn-primary");
  if (heroCta && "IntersectionObserver" in window) watch(function (es) { nav.classList.toggle("past", !es[0].isIntersecting && es[0].boundingClientRect.top < 0); }, { rootMargin: "-48px 0px 0px 0px" }).observe(heroCta);
  else nav.classList.add("past");

  var NAV_IDS = ["projects", "tasks", "timeline", "files", "analytics", "whiteboard"];
  var navLinks = $$("#navlinks > a"), menuLinks = $$(".menu-panel > a"), marker = byId("nav-marker");
  var sectionEls = NAV_IDS.map(byId), spans = [], navEnd = 0, currentNav = -2;
  var story = byId("story"), steps = $$("#steps .step"), stepTabs = $$("#tabs button"), bar = byId("bar");
  var pinQuery = matchMedia("(min-width: 64em) and (min-height: 42.5em)"), storyTop = 0, storyRange = 1, currentStep = -1;
  function navH() { return nav.offsetHeight; }
  function measure() {
    var y = window.scrollY;
    spans = sectionEls.map(function (el) { return el.getBoundingClientRect().top + y; });
    navEnd = sectionEls[sectionEls.length - 1].getBoundingClientRect().bottom + y;
    storyTop = story.getBoundingClientRect().top + y - navH();
    storyRange = Math.max(1, story.offsetHeight - (window.innerHeight - navH()));
  }
  function setMarker(i) {
    if (i === currentNav) return;
    currentNav = i;
    [navLinks, menuLinks].forEach(function (list) { list.forEach(function (a, k) { if (k === i) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); }); });
    if (!marker) return;
    var a = navLinks[i];
    if (!a || !a.offsetParent) { marker.classList.remove("on"); return; }
    marker.style.setProperty("--lp-mx", a.offsetLeft + 12 + "px");
    marker.style.setProperty("--lp-mw", String(Math.max(1, a.offsetWidth - 24)));
    marker.classList.add("on");
  }
  function setStep(i, tell) {
    if (i === currentStep) return;
    currentStep = i;
    steps.forEach(function (s, k) { s.classList.toggle("on", k === i); });
    stepTabs.forEach(function (t, k) { if (k === i) t.setAttribute("aria-current", "true"); else t.removeAttribute("aria-current"); });
    bar.style.setProperty("--lp-f", ((i + 1) / steps.length).toFixed(3));
    if (tell) announce("Showing " + steps[i].getAttribute("data-name") + ".");
  }
  /* The story's step is a function of where the page is, nothing else: the same on load,
     after a jump, on a restored position and on every scroll and resize. */
  function stepAt(y) { return Math.min(steps.length - 1, Math.max(0, Math.floor(((y - storyTop) / storyRange) * steps.length))); }
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY;
    nav.classList.toggle("scrolled", y > 8);
    if (menu.open && Math.abs(y - menuY) > 24) closeMenu(false);
    if (pinQuery.matches) setStep(stepAt(y)); else setStep(0);
    var probe = y + navH() + (window.innerHeight - navH()) * 0.4, found = -1;
    if (probe < navEnd) for (var i = 0; i < spans.length; i++) if (spans[i] <= probe) found = i;
    setMarker(found);
  }
  function refresh() { measure(); currentNav = -2; onScroll(); }
  on(window, "scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  refresh();
  on(window, "load", refresh);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (!dead) refresh(); });
  var rt;
  on(window, "resize", function () { clearTimeout(rt); rt = later(refresh, 100); });
  stepTabs.forEach(function (t, i) {
    on(t, "click", function () {
      if (!pinQuery.matches) { steps[i].scrollIntoView({ block: "start" }); return; }
      measure();
      window.scrollTo({ top: Math.round(storyTop + (storyRange * (i + 0.5)) / steps.length) });
      announce("Showing " + steps[i].getAttribute("data-name") + ".");
    });
  });

  /* ── Reveal on entry. ── */
  var revs = $$(".lp-reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var ro = watch(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); } }); }, { rootMargin: "0px 0px -4% 0px" });
    revs.forEach(function (r) { ro.observe(r); });
  } else revs.forEach(function (r) { r.classList.add("in"); });

  /* ── The working Home. One small state object, snapshots for Undo and Redo. ── */
  (function () {
    var home = byId("home"), respond = byId("respond"), toast = byId("toast"), toastT = byId("toast-t"), undoBtn = byId("undo"), nudge = byId("nudge"), moreBtn = byId("win-more");
    var S = { done: { t1: 0, t2: 0, t3: 0, inv: 1 }, ok: { f1: 0, f2: 0 }, nudged: 0, acts: 0 };
    var past = [], ahead = [], toastTimer, replyLine = "", inView = true;
    var NUM = ["no", "one", "two", "three"];
    function setN(key, val) {
      var el = $('[data-n="' + key + '"]', home), v = String(val);
      if (el.textContent === v) return;
      el.textContent = v;
      if (el.tagName === "B" && !reduce) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
    }
    function render() {
      var lateOpen = ["t1", "t2", "t3"].filter(function (k) { return !S.done[k]; }).length;
      var files = ["f1", "f2"].filter(function (k) { return !S.ok[k]; }).length;
      var today = S.done.inv ? 0 : 1, need = lateOpen + files + today;
      $('[data-n="need"]', home).hidden = need === 0;
      setN("need", need); setN("needWord", need === 0 ? "Nothing needs" : need === 1 ? "thing needs" : "things need");
      setN("late", 11 - (3 - lateOpen)); setN("week", 35 + (3 - lateOpen) - today);
      setN("lateN", lateOpen); setN("todayN", today); setN("waitN", files);
      var jobs = 3 - lateOpen, appr = 2 - files;
      setN("lateD", jobs ? "· " + jobs + " done" : ""); setN("todayD", today ? "" : "· 1 done"); setN("waitD", appr ? "· " + appr + " approved" : "");
      $$(".row[data-id]", home).forEach(function (row) {
        var id = row.dataset.id, isDone = !!S.done[id], b = $(".tick", row), m = $(".row-m", row);
        row.classList.toggle("done", isDone);
        /* The name stays put and the pressed state says the rest. */
        b.setAttribute("aria-pressed", isDone ? "true" : "false");
        m.textContent = isDone ? "Done" : row.dataset.late;
        m.classList.toggle("late", !isDone && id !== "inv");
      });
      $$(".row[data-file]", home).forEach(function (row) {
        var ok = !!S.ok[row.dataset.file], b = $("button", row);
        $("[data-word]", b).textContent = ok ? "Approved" : "Approve";
        b.classList.toggle("ok", ok);
      });
      nudge.textContent = S.nudged ? "Nudged today" : "Nudge Fern and Furrow";
      if (S.nudged) nudge.setAttribute("aria-disabled", "true"); else nudge.removeAttribute("aria-disabled");
      /* The first tick asks to be pressed whenever nothing has been done. */
      var first = $(".row[data-id] .tick", home); first.classList.toggle("hint", !S.acts);
      /* The reply is built from what has actually been done. */
      var parts = [];
      if (jobs) parts.push(NUM[jobs] + (jobs === 1 ? " task done" : " tasks done"));
      if (appr) parts.push(NUM[appr] + (appr === 1 ? " file approved" : " files approved"));
      if (S.nudged) parts.push("one reminder sent");
      var tally = parts.join(", "); tally = tally.charAt(0).toUpperCase() + tally.slice(1) + ", no meeting held.";
      var line = !S.acts ? "This one is live. Tick a task."
        : !parts.length ? "The counts moved with you. Keep going."
        : need === 0 ? tally + " That is the whole point of the thing."
        : parts.length === 1 && jobs === 1 ? "That is it. You just did project management."
        : parts.length === 1 && S.nudged ? "Fern and Furrow gets one polite reminder. You get your morning back."
        : tally + " Keep going.";
      replyLine = S.acts && parts.length ? line : "";
      var span = $("span", respond);
      if (span.textContent !== line) { var fresh = document.createElement("span"); fresh.textContent = line; respond.replaceChild(fresh, span); }
      respond.classList.toggle("said", !!S.acts);
    }
    /* The toast stays while the pointer is on it or keyboard focus is in the sample or on the toast. */
    var hovering = false;
    function holding() { var a = document.activeElement; return hovering || (!!a && (toast.contains(a) || (home.contains(a) && a.matches(":focus-visible")))); }
    function hide() { clearTimeout(toastTimer); toast.classList.remove("on"); }
    function hideSoon(ms) { clearTimeout(toastTimer); toastTimer = later(function () { if (holding()) hideSoon(2000); else hide(); }, ms); }
    function say(text, nearEl, reply) {
      toastT.textContent = "";
      var b = document.createElement("b"); b.textContent = text; toastT.appendChild(b);
      if (reply) toastT.appendChild(document.createTextNode(" " + reply));
      undoBtn.hidden = !past.length;
      /* Keep it off the row that was just acted on. */
      toast.classList.remove("up");
      if (nearEl) {
        var r = nearEl.getBoundingClientRect(), vw = root.clientWidth, vh = window.innerHeight, w = toast.offsetWidth, h = toast.offsetHeight;
        var edge = vw <= 640 ? 12 : 22, top = vh - edge - h, left = vw <= 640 ? 12 : (vw - w) / 2;
        if (r.bottom > top - 8 && r.top < vh && r.right > left && r.left < left + w) toast.classList.add("up");
      }
      toast.classList.add("on");
      announce(text + (reply ? " " + reply : "") + (past.length ? " Undo with Control Z." : ""));
      /* Long enough to read and to reach: ten seconds, more for a longer line. */
      hideSoon(Math.max(10000, (text + " " + (reply || "")).split(" ").length * 600));
    }
    function near(b) { return b.closest(".row, .stuck"); }
    function act(text, change, b, withReply) { past.push({ s: JSON.stringify(S), el: b }); ahead = []; change(); S.acts++; render(); say(text, near(b), withReply ? replyLine : ""); }
    function undo() {
      var last = past.pop(); if (!last) return false;
      var fromButton = document.activeElement === undoBtn;
      ahead.push({ s: JSON.stringify(S), el: last.el });
      S = JSON.parse(last.s); render();
      /* True to what happened: one step back, and only "everything" when nothing is left to undo. */
      say(past.length ? "Undone." : "Undone. Everything is back as it was.", near(last.el));
      if (fromButton && undoBtn.hidden) last.el.focus({ preventScroll: true });
      return true;
    }
    function redo() {
      var next = ahead.pop(); if (!next) return false;
      past.push({ s: JSON.stringify(S), el: next.el });
      S = JSON.parse(next.s); render(); say("Redone.", near(next.el));
      return true;
    }
    on(home, "click", function (e) {
      var b = e.target.closest("button"); if (!b || b === moreBtn) return;
      var row = b.closest(".row");
      if (b === nudge) {
        if (S.nudged) return say("Already nudged today. One reminder is enough.", near(b));
        return act("Nudged. This is a sample, so nothing was really sent.", function () { S.nudged = 1; }, b, false);
      }
      if (row && row.dataset.id) {
        var id = row.dataset.id;
        if (S.done[id]) return act("Reopened.", function () { S.done[id] = 0; }, b, false);
        return act("Marked done.", function () { S.done[id] = 1; }, b, true);
      }
      if (row && row.dataset.file) {
        var f = row.dataset.file;
        if (S.ok[f]) return act("Back to waiting on you.", function () { S.ok[f] = 0; }, b, false);
        return act("Approved.", function () { S.ok[f] = 1; }, b, true);
      }
    });
    /* A held key must not tick and untick on every repeat. */
    on(home, "keydown", function (e) { if (e.repeat && (e.key === "Enter" || e.key === " ") && e.target.closest("button")) e.preventDefault(); });
    on(undoBtn, "click", undo);
    /* Ctrl or Cmd with Z undoes and with Shift and Z (or Y) redoes, while the sample is on
       screen, wherever focus is, but never in a text field. Escape puts the toast away. */
    on(document, "keydown", function (e) {
      if (e.key === "Escape" && toast.classList.contains("on") && !menu.open) { hide(); return; }
      if (!(e.ctrlKey || e.metaKey) || e.altKey || !inView) return;
      var k = e.key.toLowerCase();
      if (k !== "z" && k !== "y") return;
      if (e.target.closest && e.target.closest("input, textarea, select, [contenteditable]")) return;
      if (k === "y" || e.shiftKey ? redo() : undo()) e.preventDefault();
    });
    on(toast, "pointerenter", function () { hovering = true; });
    on(toast, "pointerleave", function () { hovering = false; });
    /* Fixed to the screen, so it leaves once less than a third of the sample is in view. */
    if ("IntersectionObserver" in window) {
      var th = []; for (var i = 0; i <= 20; i++) th.push(i / 20);
      watch(function (es) {
        var e = es[0], visible = e.intersectionRect.height, most = Math.min(e.boundingClientRect.height, window.innerHeight);
        inView = visible >= most / 3;
        if (!inView && !toast.contains(document.activeElement)) hide();
      }, { threshold: th }).observe(home);
    }
    /* On a phone the sample is cut to a screen; the button, or focus moving past the cut, opens it. */
    function openAll() { if (!home.classList.contains("capped")) return; home.classList.remove("capped"); moreBtn.setAttribute("aria-expanded", "true"); later(refresh, 0); }
    on(moreBtn, "click", function () { openAll(); var next = $(".row[data-file] button", home); if (next) next.focus({ preventScroll: true }); });
    on(home, "focusin", function (e) {
      if (!home.classList.contains("capped") || e.target === moreBtn) return;
      var box = $(".home", home).getBoundingClientRect(), r = e.target.getBoundingClientRect();
      if (r.bottom > box.bottom - 56) openAll();
    });
    stops.push(function () { home.classList.add("capped"); moreBtn.setAttribute("aria-expanded", "false"); hide(); });
    render();
  })();

  /* ── Plates with more than one view: a tab list. The other views are fetched as the
     plate comes near, and a view is only shown once its capture has decoded, so the
     plate is never empty. ── */
  $$(".tabs[data-for]").forEach(function (group) {
    var plate = byId(group.dataset["for"]), btns = $$("button", group);
    var caps = plate.dataset.caps.split("|"), cap = $('[data-cap="' + plate.id + '"]'), want = 0;
    function shots(i) { return $$('.shot[data-view="' + i + '"]', plate); }
    function show(i) {
      $$(".shot", plate).forEach(function (s) { s.classList.toggle("on", +s.dataset.view === i); });
      cap.textContent = caps[i];
    }
    function warm() { $$("img", plate).forEach(function (im) { if (laidOut(im.parentNode) && im.loading !== "eager") im.loading = "eager"; }); }
    if ("IntersectionObserver" in window) { var io = watch(function (es) { if (es[0].isIntersecting) { io.disconnect(); warm(); } }, { rootMargin: "800px 0px" }); io.observe(plate); }
    on(group, "pointerenter", warm); on(group, "focusin", warm); on(group, "touchstart", warm, { passive: true });
    function choose(i, focus) {
      want = i;
      btns.forEach(function (o, k) { o.setAttribute("aria-selected", k === i ? "true" : "false"); o.tabIndex = k === i ? 0 : -1; });
      plate.setAttribute("aria-labelledby", btns[i].id);
      if (focus) btns[i].focus();
      var im = shots(i).map(function (s) { return $("img", s); }).filter(laidOut)[0];
      if (!im || (im.complete && im.naturalWidth) || im.classList.contains("failed")) { show(i); return; }
      im.loading = "eager";
      var go = function () { im.removeEventListener("load", go); im.removeEventListener("error", go); if (!dead && want === i) show(i); };
      im.addEventListener("load", go); im.addEventListener("error", go);
    }
    btns.forEach(function (b, i) {
      on(b, "click", function () { choose(i, false); });
      on(b, "keydown", function (e) {
        var to = e.key === "ArrowRight" ? (i + 1) % btns.length : e.key === "ArrowLeft" ? (i + btns.length - 1) % btns.length : e.key === "Home" ? 0 : e.key === "End" ? btns.length - 1 : -1;
        if (to < 0) return;
        e.preventDefault(); choose(to, true);
      });
    });
  });

  /* ── The whiteboard. Notes sit in loose groups. A note can be dragged, picked up and
     set down with a click or a tap, or moved with the keyboard, and Tidy drops everything
     into columns and back. Every move is a transform, so nothing is laid out again.
     Four sample people work on the wall on a script, then move about for a while. They
     are decoration: nothing they do is announced, they leave alone whatever you hold,
     and they stop when asked, when you are using the keyboard and when out of sight. ── */
  (function () {
    var wb = byId("wb"), tidyBtn = byId("tidy"), pauseBtn = byId("wb-pause"), notes = $$(".note", wb), hands = $$(".hand", wb);
    var frames = {}; $$(".frame", wb).forEach(function (f) { frames[f.dataset.g] = f; });
    var cursors = {}; $$(".cursor", wb).forEach(function (c) { cursors[c.dataset.who] = c; });
    var typedN = byId("n-typed"), strayN = byId("n-stray"), floristN = byId("n-florist");
    var arrA = byId("arr-a"), arrB = byId("arr-b"), depA = byId("dep-a"), depB = byId("dep-b"), bubble = byId("bubble"), tx = $(".tx", typedN);
    var tidy = false, strayHome = false, castDone = false, L = null, moved = {}, tmoved = {};
    var rover = null, picked = null, pickedFrom = null, byPointer = false, dragging = null, movedT = 0, zTop = 3, topNote = null, onNote = {};
    var userPaused = false, budget = 12, onWall = false, started = false, parkedAt = 0;
    notes.forEach(function (n) { n._k = +n.dataset.k; });
    /* The last note touched stays on top. The counter stays under the focus ring (5): when it
       would reach it, every note drops back to its place and the count starts again. */
    function raise(n) {
      if (topNote === n) return;
      if (zTop >= 5) { notes.forEach(function (o) { o.style.removeProperty("--lp-z"); }); zTop = 3; }
      n.style.setProperty("--lp-z", zTop++); topNote = n;
    }
    /* One tab stop: the wall remembers one note, and the arrow keys move between them. */
    function setRover(n) { if (rover === n) return; if (rover) rover.tabIndex = -1; rover = n; n.tabIndex = 0; }
    function title(n) { return NOTES[n._k].title.replace("&", "and"); }
    function live(n) { return !n.hidden && !n.classList.contains("pending"); }
    /* A note the visitor has moved is remembered as a share of the wall, so it keeps its
       place when the wall changes width. */
    function target(n) {
      var m = (tidy ? tmoved : moved)[n._k];
      if (m) return [m[0] * (L.W - L.nw), m[1] * (L.H - L.nh)];
      return (tidy ? L.T : L.S)[n._k];
    }
    function place(n, p) { n.style.setProperty("--lp-nx", p[0].toFixed(1) + "px"); n.style.setProperty("--lp-ny", p[1].toFixed(1) + "px"); }
    function rects() { return tidy ? L.tfr : L.fr; }
    function groupAt(n) {
      var p = target(n), cx = p[0] + L.nw / 2, cy = p[1] + L.nh / 2, r = rects(), found = "";
      L.order.forEach(function (g) { var b = r[g]; if (b && cx >= b[0] && cx <= b[0] + b[2] && cy >= b[1] && cy <= b[1] + b[3]) found = GROUP_NAME[g]; });
      return found ? "in " + found : "between groups";
    }
    function placeBubble() {
      var fp = target(floristN);
      bubble.style.left = Math.max(4, Math.min(fp[0] + 30, L.W - 222)) + "px"; bubble.style.top = fp[1] + L.nh - 16 + "px";
    }
    function applyFrames() {
      var r = rects();
      Object.keys(frames).forEach(function (g) {
        var f = frames[g], b = r[g]; f.hidden = !b; if (!b) return;
        f.style.setProperty("--lp-fx", b[0].toFixed(1) + "px"); f.style.setProperty("--lp-fy", b[1].toFixed(1) + "px");
        f.style.setProperty("--lp-fwd", b[2].toFixed(1) + "px"); f.style.setProperty("--lp-fht", b[3].toFixed(1) + "px");
        var count = L.count[g]; if (g === "kitchen" && !tidy && !strayHome) count -= 1;
        $("b", f).textContent = count;
      });
    }
    function apply(framesToo) {
      L = layoutWall(wb.clientWidth, strayHome);
      wb.style.setProperty("--lp-nw", L.nw + "px"); wb.style.setProperty("--lp-nh", L.nh + "px");
      wb.classList.toggle("wb-s", L.nw < 150);
      notes.forEach(function (n) {
        var shown = L.shown.indexOf(n._k) >= 0; n.hidden = !shown; if (!shown) return;
        place(n, target(n));
      });
      if (framesToo !== false) applyFrames();
      var hs = handSpots(L);
      hands.forEach(function (h, i) { h.hidden = !hs[i]; if (hs[i]) { h.style.setProperty("--lp-hx", hs[i][0] + "px"); h.style.setProperty("--lp-hy", hs[i][1] + "px"); } });
      var arrows = arrowPaths(L);
      $(".wb-arrows", wb).style.display = arrows ? "" : "none"; depA.hidden = depB.hidden = !arrows;
      if (arrows) {
        $(".ln", arrA).setAttribute("d", arrows.a.ln); $(".hd", arrA).setAttribute("d", arrows.a.hd);
        depA.style.left = arrows.a.dep[0] + "px"; depA.style.top = arrows.a.dep[1] + "px";
        $(".ln", arrB).setAttribute("d", arrows.b.ln); $(".hd", arrB).setAttribute("d", arrows.b.hd);
        depB.style.left = arrows.b.dep[0] + "px"; depB.style.top = arrows.b.dep[1] + "px";
      }
      placeBubble();
      if (!rover || rover.hidden) { var first = notes.filter(live)[0]; if (first) setRover(first); }
      if (cursors.dev) cursors.dev.hidden = L.mode === "m";
      if (cursors.aoife) cursors.aoife.hidden = typedN.hidden;
    }
    function endDrag() { if (dragging) dragging(); }
    function setTidy(to) {
      endDrag(); if (picked) putDown(false, true);
      tidy = to; tmoved = {};
      /* The group outlines step out while the notes travel, and come back where the notes land. */
      wb.classList.add("shuffling"); wb.classList.toggle("tidy", to);
      apply(false);
      later(function () { applyFrames(); wb.classList.remove("shuffling"); }, reduce ? 0 : 150);
      park(reduce ? 1 : 450);
      $("span", tidyBtn).textContent = to ? "Put it back" : "Tidy";
      announce(to ? "Tidied, one group to a column." : "Back where you left them.");
    }
    on(tidyBtn, "click", function () { setTidy(!tidy); });
    function put(n, x, y) {
      var p = [Math.max(0, Math.min(x, L.W - L.nw)), Math.max(0, Math.min(y, L.H - L.nh))];
      (tidy ? tmoved : moved)[n._k] = [p[0] / (L.W - L.nw), p[1] / (L.H - L.nh)];
      place(n, p);
      if (n === floristN) placeBubble();
    }
    function pickUp(n, pointer) {
      var m = tidy ? tmoved : moved;
      if (picked && picked !== n) putDown(false, true);
      picked = n; byPointer = !!pointer; pickedFrom = { had: n._k in m, p: m[n._k] };
      n.classList.remove("sel", "held"); n.classList.add("picked"); raise(n);
      wb.classList.toggle("aim", byPointer);
      announce(title(n) + ", picked up. " + (byPointer ? "Press where it should go, or press it again to put it down." : "Arrow keys move it. Enter puts it down, Escape puts it back."));
    }
    function putDown(back, quiet) {
      var n = picked; if (!n) return;
      picked = null; clearTimeout(movedT);
      n.classList.remove("picked"); wb.classList.remove("aim");
      if (back) {
        var m = tidy ? tmoved : moved;
        if (pickedFrom.had) m[n._k] = pickedFrom.p; else delete m[n._k];
        place(n, target(n));
        if (n === floristN) placeBubble();
      }
      if (!quiet) announce(title(n) + (back ? ", put back " : ", put down ") + groupAt(n) + ".");
    }
    /* The nearest note in the direction pressed, counting sideways drift against it. */
    function nextNote(n, d) {
      var p = target(n), best = null, bs = Infinity;
      notes.filter(live).forEach(function (o) {
        if (o === n) return;
        var q = target(o), dx = q[0] - p[0], dy = q[1] - p[1], along = dx * d[0] + dy * d[1], across = Math.abs(dx * d[1]) + Math.abs(dy * d[0]);
        if (along < 8) return;
        var sc = along + 2.5 * across; if (sc < bs) { bs = sc; best = o; }
      });
      return best;
    }
    /* With a note picked up by pointer, a press on the wall sends it there. */
    on(wb, "pointerdown", function (e) {
      if (!picked || !byPointer || e.button || e.target.closest(".note, .wb-tools")) return;
      e.preventDefault();
      var box = wb.getBoundingClientRect(), n = picked;
      put(n, e.clientX - box.left - L.nw / 2, e.clientY - box.top - L.nh / 2);
      putDown(false);
    });
    notes.forEach(function (n) {
      var start = null;
      function lift() { start.moved = true; n.classList.remove("sel", "held", "press"); n.classList.add("drag"); if (picked) putDown(false, true); }
      function end(e) {
        if (!start) return;
        clearTimeout(start.timer);
        var was = start; start = null; dragging = null;
        n.classList.remove("drag", "press");
        if (was.moved) { raise(n); announce(title(n) + ", moved, " + groupAt(n) + "."); return; }
        /* A press that did not travel picks the note up, or sets it down. */
        if (e && e.type === "pointerup" && (was.armed || was.touch)) { if (picked === n) putDown(false); else pickUp(n, true); }
      }
      on(n, "pointerdown", function (e) {
        if (e.button) return;
        var p = target(n), mouse = e.pointerType === "mouse", id = e.pointerId;
        start = { px: e.clientX, py: e.clientY, x: p[0], y: p[1], moved: false, armed: mouse, touch: !mouse, timer: 0 };
        dragging = function () { end(null); };
        n.classList.add("press");
        if (mouse) { n.setPointerCapture(id); return; }
        /* Touch and pen: a swipe scrolls the page. Press and hold for 220ms to drag the note. */
        var mine = start;
        start.timer = later(function () {
          if (start !== mine) return;
          start.armed = true; lift();
          try { n.setPointerCapture(id); } catch (err) {}
        }, 220);
      });
      on(n, "pointermove", function (e) {
        if (!start) return;
        var far = Math.abs(e.clientX - start.px) + Math.abs(e.clientY - start.py);
        if (!start.armed) { if (far > 8) { clearTimeout(start.timer); start = null; dragging = null; n.classList.remove("press"); } return; }
        if (!start.moved) { if (far < 3) return; lift(); }
        put(n, start.x + e.clientX - start.px, start.y + e.clientY - start.py);
      });
      /* Once a held note is being carried, the page must not scroll under the finger. */
      on(n, "touchmove", function (e) { if (start && start.armed && e.cancelable) e.preventDefault(); }, { passive: false });
      on(n, "contextmenu", function (e) { if (start) e.preventDefault(); });
      on(n, "pointerup", end); on(n, "pointercancel", function () { if (start) { clearTimeout(start.timer); start = null; dragging = null; n.classList.remove("drag", "press"); } });
      on(n, "keydown", function (e) {
        var k = e.key;
        if (k === "Enter" || k === " " || k === "Spacebar") {
          e.preventDefault(); if (e.repeat) return;
          if (picked === n) putDown(false); else pickUp(n, false);
          return;
        }
        if (k === "Escape") { if (picked === n) { e.preventDefault(); e.stopPropagation(); putDown(true); } return; }
        if (k === "Home" || k === "End") {
          if (picked) return;
          var all = notes.filter(live), to = k === "Home" ? all[0] : all[all.length - 1];
          e.preventDefault(); if (to) { setRover(to); to.focus(); }
          return;
        }
        var d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[k]; if (!d) return;
        e.preventDefault();
        if (picked === n) {
          var p = target(n), step = e.shiftKey ? 48 : 16; put(n, p[0] + d[0] * step, p[1] + d[1] * step);
          clearTimeout(movedT); movedT = later(function () { announce("Now " + groupAt(n) + "."); }, 500);
        } else { var o = nextNote(n, d); if (o) { setRover(o); o.focus(); } }
      });
      /* The click that follows a press is the press's own business; Enter and Space are handled above. */
      on(n, "click", function (e) { e.preventDefault(); });
      on(n, "keyup", function (e) { if (e.key === " ") e.preventDefault(); });
      on(n, "focus", function () { setRover(n); });
      on(n, "blur", function () { if (picked === n && !byPointer) putDown(false); });
    });
    on(document, "keydown", function (e) { if (e.key === "Escape" && picked && byPointer) putDown(true); });

    /* The cast. */
    function sleep(ms) { return new Promise(function (r) { later(r, ms); }); }
    function keyboardOnWall() { var a = document.activeElement; return !!a && wb.contains(a) && a.classList.contains("note") && a.matches(":focus-visible"); }
    function blocked() { return userPaused || !onWall || document.hidden || !!picked || !!dragging || keyboardOnWall(); }
    async function clear() { while (blocked()) await sleep(300); }
    function fly(who, x, y, ms) {
      var c = cursors[who]; if (!c || c.hidden) return sleep(0);
      x = Math.max(4, Math.min(x, L.W - 74)); c.style.setProperty("--lp-d", (ms || 900) + "ms"); c.style.setProperty("--lp-x", x.toFixed(1) + "px"); c.style.setProperty("--lp-y", y.toFixed(1) + "px");
      return sleep(ms || 900);
    }
    function over(who, n, fx, fy, ms) { var p = target(n); onNote[who] = n; return fly(who, p[0] + L.nw * fx, p[1] + L.nh * fy, ms); }
    /* The scripted and the idle moves wait their turn: nothing starts while the people are paused. */
    async function go(who, x, y, ms) { await clear(); return fly(who, x, y, ms); }
    async function goOver(who, n, fx, fy, ms) { await clear(); return over(who, n, fx, fy, ms); }
    function busy(n) { return n === picked || n.classList.contains("drag") || n.classList.contains("press") || n.hidden; }
    function who(n, c) { n.style.setProperty("--lp-who", getComputedStyle(cursors[c]).getPropertyValue("--lp-who")); }
    /* Dev waits in the gap between Kitchen and Guests: beside the arrow on the loose wall,
       between the two columns when tidy, and under the Kitchen column when they are not neighbours. */
    function devSpot() {
      if (!tidy) { var b1 = L.slot("kitchen", 3), b2 = L.slot("guests", 1); return [b2[0] + L.nw / 2 - 60, (b1[1] + L.nh + b2[1]) / 2 + 6]; }
      var k = L.tfr.kitchen, g = L.tfr.guests;
      if (g[1] === k[1] && g[0] > k[0]) return [(k[0] + k[2] + g[0]) / 2 - 7, k[1] + L.nh * 1.5];
      return [k[0] + k[2] - 70, k[1] + k[3] + 3];
    }
    /* Each person on the note they were last working on: Aoife where she is typing, Dara on
       the note he straightened, Niamh on the florist's, Dev in his gap. */
    function park(ms) {
      if (!typedN.hidden) over("aoife", typedN, 0.82, 0.52, ms || 1);
      over("dara", strayN, 0.6, 0.56, ms || 1); over("niamh", floristN, 0.72, 0.3, ms || 1);
      if (L.mode !== "m") { var p = devSpot(); onNote.dev = null; fly("dev", p[0], p[1], ms || 1); }
      parkedAt = Date.now();
    }
    async function dara() {
      await goOver("dara", strayN, 0.6, 0.56, 1100);
      for (var i = 0; i < 6 && (busy(strayN) || tidy); i++) await sleep(1500);
      if (strayHome || moved[strayN._k] || busy(strayN) || tidy) { strayHome = strayHome || tidy; return; }
      await clear();
      who(strayN, "dara"); strayN.classList.add("held"); await sleep(350);
      strayHome = true; apply(); await goOver("dara", strayN, 0.6, 0.56, 450);
      strayN.classList.remove("held"); await sleep(300);
    }
    async function aoife() {
      if (typedN.hidden) return;
      await sleep(700); await goOver("aoife", typedN, 0.82, 0.52, 1200);
      who(typedN, "aoife"); typedN.classList.remove("pending"); typedN.classList.add("sel"); apply();
      var full = tx.dataset.full;
      for (var i = 1; i <= full.length; i++) { await clear(); tx.textContent = full.slice(0, i); await sleep(full[i - 1] === " " ? 120 : 62); }
      await sleep(700); var c = $(".caret", typedN); if (c) c.remove(); typedN.classList.remove("sel");
    }
    async function dev() {
      if (L.mode === "m") return;
      await clear();
      var b1 = L.slot("kitchen", 3), b2 = L.slot("guests", 1), x = b1[0] + L.nw / 2 + 6;
      await go("dev", x, b1[1] + L.nh + 2, 1100); await sleep(250);
      arrB.classList.remove("undrawn"); await go("dev", x, b2[1] - 11, 900);
      depB.classList.remove("pending"); await sleep(300); await go("dev", x - 66, (b1[1] + L.nh + b2[1]) / 2 + 6, 450);
    }
    async function niamh() {
      await goOver("niamh", floristN, 0.72, 0.3, 1200);
      if (!busy(floristN)) { who(floristN, "niamh"); floristN.classList.add("sel"); }
      await sleep(300); bubble.classList.remove("pending"); await sleep(1400); floristN.classList.remove("sel");
      later(function () {
        bubble.classList.add("pending");
        var chip = document.createElement("u"); chip.className = "cm"; chip.textContent = "1";
        var sm = $("small", floristN); sm.insertBefore(chip, $("i", sm));
        floristN.setAttribute("aria-label", floristN.getAttribute("aria-label") + ", 1 comment");
      }, 5200);
    }
    var HOME_GROUPS = { aoife: ["day", "guests", "ideas"], dara: ["suppliers", "signage", "kitchen"], dev: ["kitchen", "guests"], niamh: ["suppliers", "day"] };
    function showPause() {
      pauseBtn.classList.toggle("paused", userPaused);
      pauseBtn.setAttribute("aria-label", userPaused ? "Resume sample people" : "Pause sample people");
      $("span", pauseBtn).textContent = userPaused ? "Resume" : "Pause";
    }
    /* After the script the four keep moving for a dozen turns, then rest. Resume gives them a dozen more. */
    async function ambient() {
      var names = Object.keys(HOME_GROUPS), i = 0;
      for (;;) {
        await sleep(1500 + Math.random() * 1200);
        if (dead) return;
        if (blocked() || Date.now() - parkedAt < 1600) continue;
        if (budget <= 0) { userPaused = true; showPause(); continue; }
        var name = names[i++ % names.length]; if (cursors[name].hidden) continue;
        var pool = notes.filter(function (n) { return live(n) && HOME_GROUPS[name].indexOf(n.dataset.g) >= 0 && !busy(n) && !n.classList.contains("sel") && !names.some(function (o) { return o !== name && onNote[o] === n; }); });
        if (!pool.length) continue;
        var n = pool[Math.floor(Math.random() * pool.length)];
        budget--;
        await goOver(name, n, 0.45 + Math.random() * 0.3, 0.4 + Math.random() * 0.3, 1200);
        if (busy(n) || blocked()) continue;
        who(n, name); n.classList.add("sel"); await sleep(1300); n.classList.remove("sel");
      }
    }
    on(pauseBtn, "click", function () {
      userPaused = !userPaused; if (!userPaused) budget = 12;
      showPause();
      announce(userPaused ? "Sample people paused." : "Sample people moving again.");
    });
    async function cast() {
      Object.keys(cursors).forEach(function (k) { cursors[k].classList.remove("away"); });
      await Promise.all([dara(), aoife()]);
      await Promise.all([dev(), sleep(900).then(niamh)]);
      castDone = true; ambient();
    }
    apply();
    if (reduce || !("IntersectionObserver" in window)) { park(); castDone = true; pauseBtn.hidden = true; }
    else {
      /* Motion allowed: rewind the still to its opening state, then play once the wall is in view. */
      typedN.classList.add("pending"); typedN.classList.remove("sel"); tx.textContent = "";
      var caret = document.createElement("i"); caret.className = "caret"; tx.parentNode.appendChild(caret);
      arrB.classList.add("undrawn"); depB.classList.add("pending"); bubble.classList.add("pending");
      apply();
      var seat = { aoife: [0.5, 0.96], dara: [0.98, 0.5], dev: [0.9, 0.04], niamh: [0.3, 0.02] };
      Object.keys(cursors).forEach(function (k) { cursors[k].classList.add("away"); fly(k, seat[k][0] * L.W, seat[k][1] * L.H, 1); });
      watch(function (es) {
        onWall = es[0].isIntersecting;
        if (onWall && !started && es[0].intersectionRatio >= 0.3) { started = true; cast(); }
      }, { threshold: [0, 0.3] }).observe(wb);
    }
    /* From here the notes ease when they move. Before it they were only being put in place. */
    requestAnimationFrame(function () { requestAnimationFrame(function () { if (!dead) wb.classList.add("ready"); }); });
    stops.push(function () { wb.classList.remove("ready", "tidy", "aim", "shuffling"); });
    /* Only a change of width re-lays the wall; a phone's address bar sliding away must not.
       Notes the visitor moved keep their share of the wall. */
    var wbW = wb.clientWidth;
    function wbResize() {
      if (wb.clientWidth === wbW) return; wbW = wb.clientWidth;
      endDrag(); if (picked) putDown(false, true);
      wb.classList.remove("ready"); apply(); if (castDone) park(1);
      requestAnimationFrame(function () { requestAnimationFrame(function () { if (!dead) wb.classList.add("ready"); }); });
    }
    if ("ResizeObserver" in window) { var wro = new ResizeObserver(function () { if (!dead) wbResize(); }); wro.observe(wb); stops.push(function () { wro.disconnect(); }); }
    else on(window, "resize", wbResize);
  })();

  /* ── The waitlist form is a React component (home-waitlist.tsx) wired to the real action.
     Every other "Join the waitlist" lands there with the cursor in the field, except on
     touch screens, where that would throw the keyboard up over the page. ── */
  var wlForm = byId("waitlist-form"), wlIn = byId("wl-email"), wlDone = byId("wl-done");
  var touchy = matchMedia("(hover: none), (pointer: coarse)");
  function arriveJoin() {
    if (touchy.matches) return;
    (wlForm.hidden ? wlDone : wlIn).focus({ preventScroll: true });
  }
  $$('a[href="#join"]').forEach(function (a) { on(a, "click", function () { later(arriveJoin, 0); }); });
  if (location.hash === "#join") later(arriveJoin, 0);

  return function stop() {
    dead = true;
    offs.forEach(function (f) { f(); });
    timers.forEach(function (id) { clearTimeout(id); });
    observers.forEach(function (o) { o.disconnect(); });
    stops.forEach(function (f) { f(); });
  };
}
