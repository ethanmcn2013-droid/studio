// @ts-nocheck
/* The home page runtime: the working Home sample, the pinned Tasks story, the
   plates and their tabs, the whiteboard and its four sample people, the theme
   toggle, the header marker, the closing rings and the dot run above the
   footer. Ported from the reviewed static build (remote-redesign,
   work/2026-10-01-landing-v3-2026-10/master.html) and DOM-driven on purpose:
   the markup is static and React never reconciles what this touches.

   startHome(root) returns a stop function. Every listener, timer, observer
   and animation it starts is tracked, so stopping leaves nothing behind and
   starting again on the same markup is safe. */
import { shotSources } from "./shot-sources";

/* The theme the page should open in: ?theme=light|dark, else the device
   setting, else dark. Nothing is stored, as in the reviewed build. */
export function openingTheme() {
  var t = null;
  try { t = new URLSearchParams(location.search).get("theme"); } catch (e) {}
  if (t !== "light" && t !== "dark") t = window.matchMedia && matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  return t;
}

/* What the inline boot script in home-page.tsx does while the page is parsed,
   for the times it does not run (arriving by a client-side link). Captures
   behind another one give up their src until they are asked for; in the light
   theme the rest are pointed at their light files before anything is fetched. */
export function bootHome(root) {
  if (!root || root.classList.contains("js")) return;
  var t = openingTheme();
  root.setAttribute("data-theme", t);
  root.classList.add("js");
  if (!window.IntersectionObserver) return;
  Array.prototype.slice.call(root.querySelectorAll("img[data-shot]")).forEach(function (im) {
    var p = im.parentNode.classList;
    if ((p.contains("layer") || p.contains("stack")) && !p.contains("on")) { im.removeAttribute("srcset"); im.removeAttribute("src"); }
    else if (t === "light") { var w = shotSources(im.getAttribute("data-shot"), "light"); im.setAttribute("srcset", w.srcSet); im.setAttribute("src", w.src); }
  });
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

  /* ── The dot run. The dot is the mascot: it hops along the line, sends out a
     signal each time it lands, and settles into the ring to make the mark.
     Decorative, and still under reduced motion. ── */
  (function () {
      var run = byId("dotrun"), dot = byId("dotrun-dot"), ring = byId("dotrun-ring");
      if (!run || !dot || !ring || !dot.animate) return;
      var reduce = matchMedia("(prefers-reduced-motion: reduce)");
      var playing = [];
      function clear() {
        playing.forEach(function (a) { a.cancel(); });
        playing = [];
        Array.prototype.slice.call(run.querySelectorAll(".dotrun-ping")).forEach(function (p) { p.remove(); });
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
        var hop = 620, pause = 150, lead = 500, total = lead + hops * (hop + pause);
        var frames = [{ transform: "translate(" + start + "px, 0) scale(1, 1)", offset: 0 }];
        var at = lead;
        for (var i = 0; i < hops; i++) {
          var x0 = start + (span * i) / hops, x1 = start + (span * (i + 1)) / hops, xm = (x0 + x1) / 2;
          var last = i === hops - 1, height = last ? 74 : 44 + (i % 2) * 14;
          // crouch, rise, fall, land: squash and stretch give it weight
          frames.push({ transform: "translate(" + x0 + "px, 0) scale(1.18, 0.8)", offset: at / total, easing: "cubic-bezier(.2,.8,.4,1)" }); // ds-allow: the dot hop, crouch
          frames.push({ transform: "translate(" + xm + "px, -" + height + "px) scale(0.94, 1.08)", offset: (at + hop * 0.5) / total, easing: "cubic-bezier(.6,0,.8,.35)" }); // ds-allow: the dot hop, fall
          frames.push({ transform: "translate(" + x1 + "px, 0) scale(1.22, 0.76)", offset: (at + hop) / total, easing: "ease-out" });
          frames.push({ transform: "translate(" + x1 + "px, 0) scale(1, 1)", offset: (at + hop + pause * 0.9) / total });
          // the signal: a ring goes out from where it landed
          if (!last) {
            var ping = document.createElement("span");
            ping.className = "dotrun-ping";
            ping.style.left = x1 + "px";
            run.appendChild(ping);
            playing.push(ping.animate([{ transform: "scale(1)", opacity: 0.7 }, { transform: "scale(4.2)", opacity: 0 }], { duration: 900, delay: at + hop, easing: "cubic-bezier(.2,.7,.3,1)" })); // ds-allow: the signal ring
          }
          at += hop + pause;
        }
        frames.push({ transform: "translate(" + end + "px, 0) scale(1, 1)", offset: 1 });
        var a = dot.animate(frames, { duration: total, fill: "forwards" });
        playing.push(a);
        // the ring wakes up as the dot arrives, then the mark breathes once
        playing.push(ring.animate([{ opacity: 0.35, transform: "scale(1)" }, { opacity: 1, transform: "scale(1.14)" }, { opacity: 1, transform: "scale(1)" }], { duration: 700, delay: total - 120, fill: "forwards", easing: "cubic-bezier(.2,.8,.3,1)" })); // ds-allow: the mark settles
        a.onfinish = function () { run.classList.add("still"); };
      }
      function start() { if (reduce.matches) rest(); else play(); }
      var seen = false;
      if ("IntersectionObserver" in window) {
        watch(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting && !seen) { seen = true; start(); }
            if (!e.isIntersecting) seen = false;
          });
        }, { threshold: 0.6 }).observe(run);
      } else start();
      rest();
      on(run, "click", start);
      var t;
      on(window, "resize", function () { clearTimeout(t); t = later(rest, 150); });
      stops.push(clear);
  })();

  /* ── The page. ── */
  (function () {
      var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      var live = $("#live");
      function announce(t) { live.textContent = ""; requestAnimationFrame(function () { if (!dead) live.textContent = t; }); }

      /* Theme: product shots follow the page. */
      var themeBtns = $$("[data-theme-toggle]");
      /* Every image has its dark capture as src in the HTML and loads lazily. On a theme
         change only the captures on screen are swapped; the rest wait until they are scrolled
         near or their tab is opened, so a toggle does not fetch the whole page again. */
      var shotImgs = $$("img[data-shot]");
      function want(im) { return shotSources(im.getAttribute("data-shot"), root.getAttribute("data-theme") === "light" ? "light" : "dark"); }
      function point(im, w) { im.setAttribute("srcset", w.srcSet); im.setAttribute("src", w.src); }
      function shown(im) { return !!im.offsetParent && getComputedStyle(im.parentNode).visibility !== "hidden"; }
      function nextUp(im) { var l = im.parentNode; return l.classList.contains("layer") && Math.abs(layers.indexOf(l) - current) < 2; }
      function sync(im, hold, hidden) {
        var w = want(im);
        if (im.getAttribute("src") === w.src || !im._near || !(hidden || shown(im))) return;
        if (hold && im.complete && im.naturalWidth) {
          var done = function () { im.classList.remove("swap"); im.removeEventListener("load", done); im.removeEventListener("error", done); };
          im.classList.add("swap"); im.addEventListener("load", done); im.addEventListener("error", done);
        }
        point(im, w);
      }
      if ("IntersectionObserver" in window) {
        var nearIO = watch(function (es) {
          es.forEach(function (e) { var im = e.target.querySelector("img[data-shot]"); im._near = e.isIntersecting; if (e.isIntersecting) sync(im, false, nextUp(im)); });
        }, { rootMargin: "300px 0px" });
        shotImgs.forEach(function (im) { nearIO.observe(im.parentNode); });
      } else shotImgs.forEach(function (im) { im._near = true; });
      /* First paint: nothing has been fetched yet, so every image can take the right theme.
         The captures behind another one had their src taken off at boot; sync gives it back
         when the scene is next in line or the tab is reached for. */
      shotImgs.forEach(function (im) { var w = want(im); if (im.hasAttribute("src") && im.getAttribute("src") !== w.src) point(im, w); });
      function paint() {
        var t = root.getAttribute("data-theme");
        shotImgs.forEach(function (im) { sync(im); });
        var label = "Switch to " + (t === "dark" ? "light" : "dark") + " theme";
        themeBtns.forEach(function (b) { if (b.id === "theme") b.setAttribute("aria-label", label); else b.textContent = label; });
      }
      themeBtns.forEach(function (b) {
        on(b, "click", function () {
          root.setAttribute("data-theme", root.getAttribute("data-theme") === "dark" ? "light" : "dark");
          paint();
        });
      });
      paint();

      /* Fit: each scripted shot shows the product at one source pixel per CSS pixel or a
         touch under (data-s), never over, so 2x captures stay crisp and text stays readable. */
      function fit(el) {
        var W = el.clientWidth; if (!W) return;
        var d = el.dataset, sw = +(d.sw || 1440), sh = +(d.sh || 900), minx = +(d.minx || 0), r = +d.r, s = +(d.s || 1);
        var w = Math.min(W / s, sw - minx), h = w / r;
        if (h > sh) { h = sh; w = h * r; }
        var x = d.cx != null ? d.cx - w / 2 : d.ax === "r" ? sw - w : +d.x;
        x = Math.max(minx, Math.min(x, sw - w));
        var y = d.cy != null ? d.cy - h / 2 : +d.y;
        y = Math.max(0, Math.min(y, sh - h));
        el.style.setProperty("--lp-x", x.toFixed(1)); el.style.setProperty("--lp-y", y.toFixed(1));
        el.style.setProperty("--lp-w", w.toFixed(1)); el.style.setProperty("--lp-h", h.toFixed(1));
        $$(".spot[data-clip]", el).forEach(function (sp) {
          var sx = parseFloat(sp.style.getPropertyValue("--lp-sx"));
          if (!sp.dataset.spw) sp.dataset.spw = sp.style.getPropertyValue("--lp-spw");
          sp.style.setProperty("--lp-spw", Math.max(40, Math.min(+sp.dataset.spw, x + w - sx - 3)).toFixed(1));
        });
      }
      var fits = $$("[data-fit]");
      function fitAll() { fits.forEach(fit); }
      fitAll();

      /* Nav hairline and section marker. */
      var nav = $("#nav"), ticking = false;
      var menu = $(".menu"), menuSum = $("summary", menu), menuY = 0;
      function closeMenu(refocus) { if (!menu.open) return; menu.open = false; if (refocus) menuSum.focus(); }
      function onScroll() { ticking = false; nav.classList.toggle("scrolled", window.scrollY > 8); if (menu.open && Math.abs(window.scrollY - menuY) > 24) closeMenu(false); }
      on(window, "scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
      onScroll();
      /* The marker follows the section under the middle of the screen, in the header and in
         the phone menu, and clears over the blocks the header does not name. */
      var navA = $$("#navlinks a, .menu-panel a");
      if ("IntersectionObserver" in window) {
        var spy = watch(function (es) {
          es.forEach(function (e) {
            if (!e.isIntersecting) return;
            var href = e.target.hasAttribute("data-nav") ? "#" + e.target.id : "";
            navA.forEach(function (a) { if (a.getAttribute("href") === href) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); });
          });
        }, { rootMargin: "-45% 0px -50% 0px" });
        ["projects", "tasks", "timeline", "files", "analytics", "whiteboard"].forEach(function (id) { var el = byId(id); el.setAttribute("data-nav", ""); spy.observe(el); });
        $$("#top, .one, #words, .who, #venue, #join, .lp-foot, .lp-footer").forEach(function (el) { spy.observe(el); });
      }
      $$(".menu-panel a").forEach(function (a) { on(a, "click", function () { closeMenu(false); }); });
      on(menu, "toggle", function () { if (menu.open) menuY = window.scrollY; });
      on(document, "pointerdown", function (e) { if (menu.open && !menu.contains(e.target)) closeMenu(false); });
      on(document, "keydown", function (e) { if (e.key === "Escape" && menu.open) { e.preventDefault(); closeMenu(true); } });

      /* Reveal on entry. */
      var revs = $$(".lp-reveal");
      if ("IntersectionObserver" in window && !reduce) {
        var ro = watch(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
        revs.forEach(function (r) { ro.observe(r); });
      } else revs.forEach(function (r) { r.classList.add("in"); });

      /* The working Home. One small state object, snapshots for Undo. */
      var home = $("#home"), respond = $("#respond"), toast = $("#toast"), toastT = $("#toast-t"), undoBtn = $("#undo"), nudge = $("#nudge");
      var S = { done: { t1: 0, t2: 0, t3: 0, inv: 1 }, ok: { f1: 0, f2: 0 }, nudged: 0, ticks: 0, acts: 0 };
      var stack = [], toastTimer, replyLine = "";
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
          var id = row.dataset.id, on = !!S.done[id], b = $(".tick", row), m = $(".row-m", row), title = $(".row-t", row).textContent;
          row.classList.toggle("done", on);
          b.setAttribute("aria-pressed", on ? "true" : "false");
          b.setAttribute("aria-label", (on ? "Done: " : "Mark done: ") + title);
          m.textContent = on ? "Done" : row.dataset.late;
          m.classList.toggle("late", !on && id !== "inv");
        });
        $$(".row[data-file]", home).forEach(function (row) {
          var on = !!S.ok[row.dataset.file], b = $("button", row);
          b.setAttribute("aria-pressed", on ? "true" : "false");
          b.textContent = on ? "Approved" : "Approve";
          b.setAttribute("aria-label", (on ? "Approved: " : "Approve: ") + $(".row-t", row).textContent);
        });
        nudge.textContent = S.nudged ? "Nudged today" : "Nudge Fern and Furrow";
        if (S.nudged) nudge.setAttribute("aria-disabled", "true"); else nudge.removeAttribute("aria-disabled");
        var first = $(".tick.hint", home); if (first && S.acts) first.classList.remove("hint");
        /* The reply is built from what has actually been done. */
        var parts = [];
        if (jobs) parts.push(NUM[jobs] + (jobs === 1 ? " task done" : " tasks done"));
        if (appr) parts.push(NUM[appr] + (appr === 1 ? " file approved" : " files approved"));
        if (S.nudged) parts.push("one reminder sent");
        var tally = parts.join(", "); tally = tally.charAt(0).toUpperCase() + tally.slice(1) + ", no meeting held.";
        var line = !S.acts ? "Go on. Tick one off, or nudge the florist."
          : !parts.length ? "The counts above moved with you. Keep going."
          : need === 0 ? tally + " That is the whole point of the thing."
          : parts.length === 1 && jobs === 1 ? "That is it. You just did project management."
          : parts.length === 1 && S.nudged ? "Fern and Furrow gets one polite reminder. You get your morning back."
          : tally + " Keep going.";
        replyLine = S.acts ? line : "";
        var span = $("span", respond);
        if (span.textContent !== line) { respond.innerHTML = "<span></span>"; respond.firstChild.textContent = line; }
        respond.classList.toggle("said", !!S.acts);
      }
      /* The toast stays while keyboard focus is in the sample or on the toast itself. */
      function holding() { var a = document.activeElement; return !!a && (toast.contains(a) || (home.contains(a) && a.matches(":focus-visible"))); }
      function hideSoon(ms) { clearTimeout(toastTimer); toastTimer = later(function () { if (!holding()) toast.classList.remove("on"); }, ms); }
      function say(text, canUndo, near, reply) {
        toastT.textContent = "";
        var b = document.createElement("b"); b.textContent = text; toastT.appendChild(b);
        if (reply) toastT.appendChild(document.createTextNode(" " + reply));
        undoBtn.hidden = !canUndo;
        /* Keep it off the row that was just acted on. */
        toast.classList.remove("up");
        if (near) {
          var r = near.getBoundingClientRect(), vw = root.clientWidth, vh = window.innerHeight, w = toast.offsetWidth, h = toast.offsetHeight;
          var edge = vw <= 640 ? 12 : 22, top = vh - edge - h, left = vw <= 640 ? 12 : (vw - w) / 2;
          if (r.bottom > top - 8 && r.top < vh && r.right > left && r.left < left + w) toast.classList.add("up");
        }
        toast.classList.add("on"); announce(reply ? text + " " + reply : text);
        hideSoon(6500);
      }
      function near(b) { return b.closest(".row, .stuck"); }
      function act(text, change, b) { stack.push({ s: JSON.stringify(S), el: b }); change(); S.acts++; render(); say(text, true, near(b), replyLine); }
      function undo() {
        var last = stack.pop(); if (!last) return false;
        S = JSON.parse(last.s); render(); say("Undone. Everything is back as it was.", false, near(last.el));
        last.el.focus({ preventScroll: true });
        return true;
      }
      on(home, "click", function (e) {
        var b = e.target.closest("button"); if (!b) return;
        var row = b.closest(".row");
        if (b === nudge) {
          if (S.nudged) return say("Already nudged today. One reminder is enough.", false, near(b));
          return act("Nudge sent. Nothing left this page.", function () { S.nudged = 1; }, b);
        }
        if (row && row.dataset.id) {
          var id = row.dataset.id;
          if (S.done[id]) return act("Reopened.", function () { S.done[id] = 0; if (id !== "inv") S.ticks = Math.max(0, S.ticks - 1); }, b);
          return act("Marked done.", function () { S.done[id] = 1; if (id !== "inv") S.ticks++; }, b);
        }
        if (row && row.dataset.file) {
          var f = row.dataset.file;
          if (S.ok[f]) return act("Back to waiting on you.", function () { S.ok[f] = 0; }, b);
          return act("Approved.", function () { S.ok[f] = 1; }, b);
        }
      });
      on(undoBtn, "click", undo);
      /* Ctrl or Cmd with Z undoes, inside the sample and its toast only, never in a text field. */
      function zKey(e) {
        if (!(e.ctrlKey || e.metaKey) || e.shiftKey || e.altKey || (e.key !== "z" && e.key !== "Z")) return;
        if (e.target.closest && e.target.closest("input, textarea, select, [contenteditable]")) return;
        if (undo()) e.preventDefault();
      }
      on(home, "keydown", zKey); on(toast, "keydown", zKey);
      on(toast, "pointerenter", function () { clearTimeout(toastTimer); });
      on(toast, "pointerleave", function () { hideSoon(3000); });
      [home, toast].forEach(function (el) { on(el, "focusout", function () { later(function () { if (!holding() && toast.classList.contains("on")) hideSoon(3000); }, 0); }); });
      /* Fixed to the screen, so it leaves with the sample rather than following the page down. */
      if ("IntersectionObserver" in window) watch(function (es) { if (!es[0].isIntersecting && !toast.contains(document.activeElement)) { clearTimeout(toastTimer); toast.classList.remove("on"); } }).observe(home);

      /* The pinned stage. */
      var stage = $("#stage"), steps = $$("#steps .step"), tabs = $$("#tabs button"), bar = $("#bar"), layers = $$(".layer", stage), current = -1;
      function go(i) {
        if (i === current) return;
        current = i;
        layers.forEach(function (l, k) { l.classList.toggle("on", k === i); if (Math.abs(k - i) < 2) sync($("img", l), false, true); });
        steps.forEach(function (s, k) { s.classList.toggle("on", k === i); });
        tabs.forEach(function (t, k) { if (k === i) t.setAttribute("aria-current", "true"); else t.removeAttribute("aria-current"); });
        bar.style.setProperty("--lp-f", ((i + 1) / layers.length).toFixed(3));
      }
      go(0);
      /* Each caption parks on the stage's centre line. The scene changes when the next
         caption is nearer that line than the last: a band of 140px either side of it. */
      var anchors = $$("#steps .step-in"), so = null;
      function midLine() { var nh = parseFloat(getComputedStyle(root).getPropertyValue("--lp-nav-h")) || 60; return nh + (window.innerHeight - nh) / 2 + 18; }
      function watchSteps() {
        if (!("IntersectionObserver" in window)) return;
        if (so) so.disconnect();
        var c = midLine(), band = 140;
        so = watch(function (es) { es.forEach(function (e) { if (e.isIntersecting) go(+e.target.parentNode.getAttribute("data-step")); }); }, { rootMargin: "-" + Math.max(0, Math.round(c - band)) + "px 0px -" + Math.max(0, Math.round(window.innerHeight - c - band)) + "px 0px" });
        anchors.forEach(function (a) { so.observe(a); });
      }
      watchSteps();
      tabs.forEach(function (t, i) {
        on(t, "click", function () {
          var s = steps[i], pad = parseFloat(getComputedStyle(s).paddingTop) || 0;
          window.scrollTo({ top: s.getBoundingClientRect().top + window.scrollY + pad - midLine() + window.innerHeight * 0.2, behavior: reduce ? "auto" : "smooth" });
        });
      });

      /* Plates with more than one view. */
      $$(".tabs[data-for]").forEach(function (group) {
        var id = group.dataset["for"], plates = [byId(id), byId(id + "-m")], btns = $$("button", group);
        var caps = plates[0].dataset.caps.split("|"), cap = $('[data-cap="' + id + '"]');
        /* Reaching for the tabs fetches the views behind them, so the press itself is instant. */
        function warm() { plates.forEach(function (p) { if (p.offsetParent) $$("img", p).forEach(function (im) { sync(im, false, true); }); }); }
        on(group, "pointerenter", warm); on(group, "focusin", warm); on(group, "touchstart", warm, { passive: true });
        btns.forEach(function (b, i) {
          on(b, "click", function () {
            btns.forEach(function (o, k) { o.setAttribute("aria-pressed", k === i ? "true" : "false"); });
            plates.forEach(function (p) { $$(".shot", p).forEach(function (s, k) { s.classList.toggle("on", k === i); if (k === i) sync($("img", s), true); }); });
            cap.textContent = caps[i];
          });
        });
      });

      /* The whiteboard. Notes sit in loose groups; the visitor can drag any note (or move a
         focused one with the arrow keys) and Tidy drops everything into columns and back.
         Four sample people work on the wall on a script, then keep moving about. They are
         decoration: nothing they do is announced, and they leave alone whatever you hold. */
      var wb = $("#wb"), wbx = wb.closest(".wbx"), tidyBtn = $("#tidy"), notes = $$(".note", wb), hands = $$(".hand", wb), countEl = $("#wb-count");
      var frames = {}; $$(".frame", wb).forEach(function (f) { frames[f.dataset.g] = f; });
      var cursors = {}; $$(".cursor", wb).forEach(function (c) { cursors[c.dataset.who] = c; });
      var typedN = $("#n-typed"), strayN = $("#n-stray"), floristN = $("#n-florist"), finalN = $("#n-final"), approveN = $("#n-approve");
      var arrA = $("#arr-a"), arrB = $("#arr-b"), depA = $("#dep-a"), depB = $("#dep-b"), bubble = $("#bubble"), tx = $(".tx", typedN);
      var ORDER = { d: ["day", "suppliers", "kitchen", "signage", "ideas", "guests"], t: ["day", "suppliers", "kitchen", "signage", "guests", "ideas"], m: ["day", "suppliers", "kitchen", "ideas"] };
      var TORDER = ["day", "suppliers", "kitchen", "guests", "signage", "ideas"];
      var tidy = false, held = null, strayHome = false, castDone = false, L = null, moved = {}, tmoved = {};
      var wbFoot = $("#wb-foot"), rover = null, picked = null, pickedFrom = null, movedT = 0, zTop = 3, topNote = null, onNote = {};
      notes.forEach(function (n, k) { n._k = k; n._j = n.dataset.j.split(",").map(Number); n.tabIndex = -1; n.setAttribute("aria-pressed", "false"); });
      /* The last note touched stays on top. The counter stays under the focus ring (5): when it
         would reach it, every note drops back to its place and the count starts again. */
      function raise(n) {
        if (topNote === n) return;
        if (zTop >= 5) { notes.forEach(function (o) { o.style.removeProperty("--lp-z"); }); zTop = 3; }
        n.style.setProperty("--lp-z", zTop++); topNote = n;
      }
      /* One tab stop: the wall remembers one note, and the arrow keys move between them. */
      function setRover(n) { if (rover === n) return; if (rover) rover.tabIndex = -1; rover = n; n.tabIndex = 0; }
      function noteTitle(n) { return n.getAttribute("aria-label").split(", ")[0]; }

      function compute() {
        /* Three columns need 1152. Two columns hold while a note keeps 132px; under that, one. */
        var W = wb.clientWidth, mode = W >= 1152 ? "d" : Math.floor((W - 156) / 4) >= 132 ? "t" : "m";
        var fc = mode === "d" ? 3 : mode === "t" ? 2 : 1, m = mode === "m" ? 0 : 24, pad = mode === "m" ? 10 : 12, gap = mode === "m" ? 8 : 10;
        var nw = mode === "d" ? 164 : mode === "t" ? Math.min(164, Math.floor((W - 2 * m - 40 - 4 * pad - 2 * gap) / 4)) : Math.min(220, Math.floor((W - 2 * pad - gap) / 2));
        /* A narrow note takes a fourth line and the height for it, so no title is cut. */
        var nh = nw < 150 ? 108 : nw < 164 ? 118 : mode === "m" ? 104 : 108, top = 44, rowGap = mode === "m" ? 50 : 58;
        var fw = 2 * nw + gap + 2 * pad, fh = 2 * nh + gap + 2 * pad, colGap = fc > 1 ? Math.max(8, Math.min(60, (W - 2 * m - fc * fw) / (fc - 1))) : 0;
        var x0 = (W - fc * fw - (fc - 1) * colGap) / 2, order = ORDER[mode], cell = {}, S = {}, T = {}, fr = {}, tfr = {};
        order.forEach(function (g, i) { cell[g] = [x0 + (i % fc) * (fw + colGap), top + Math.floor(i / fc) * (fh + rowGap)]; });
        function slot(g, k) { return [cell[g][0] + pad + (k % 2) * (nw + gap), cell[g][1] + pad + Math.floor(k / 2) * (nh + gap)]; }
        var vis = notes.filter(function (n) { return order.indexOf(n.dataset.g) >= 0; });
        vis.forEach(function (n) {
          var g = n.dataset.g, k = +n.dataset.s, p;
          if (g === "ideas") { var c = cell.ideas; p = [[c[0] + 4, c[1] + 36], [c[0] + fw - nw - 6, c[1] + 56], [c[0] + (fw - nw) / 2 - 10, c[1] + 150]][k]; }
          else p = slot(g, k);
          if (n === strayN && !strayHome) p = [Math.max(2, p[0] - 38), p[1] + 70];
          else if (g !== "ideas") p = [p[0] + n._j[0], p[1] + n._j[1]];
          S[n._k] = p;
        });
        order.forEach(function (g) { fr[g] = [cell[g][0], cell[g][1], fw, fh]; });
        var rows = Math.ceil(order.length / fc), Hs = top + rows * (fh + rowGap) - rowGap + 86;
        /* tidy: one column a group */
        var tc = mode === "d" ? 6 : mode === "t" ? 3 : 2, tp = mode === "m" ? 4 : 10, tw = nw + 2 * tp, tm = mode === "m" ? 0 : 24;
        var tg = Math.max(8, Math.min(40, (W - 2 * tm - tc * tw) / (tc - 1))), tx0 = (W - tc * tw - (tc - 1) * tg) / 2, y = 48;
        var groups = TORDER.filter(function (g) { return order.indexOf(g) >= 0; });
        for (var r = 0; r * tc < groups.length; r++) {
          var rowMax = 0;
          groups.slice(r * tc, r * tc + tc).forEach(function (g, c) {
            var ns = vis.filter(function (n) { return n.dataset.g === g && !n.classList.contains("pending"); }).sort(function (a, b) { return a.dataset.s - b.dataset.s; });
            var gx = tx0 + c * (tw + tg);
            ns.forEach(function (n, i) { T[n._k] = [gx + tp, y + tp + i * (nh + 8)]; });
            var h = Math.max(1, ns.length) * (nh + 8) - 8 + 2 * tp;
            tfr[g] = [gx, y, tw, h, ns.length]; rowMax = Math.max(rowMax, h);
          });
          y += rowMax + 54;
        }
        var Ht = y - 54 + 92;
        return { W: W, mode: mode, nw: nw, nh: nh, S: S, T: T, fr: fr, tfr: tfr, Hs: Hs, Ht: Ht, vis: vis, order: order, slot: slot, cell: cell, fw: fw, fh: fh };
      }
      function H() { return tidy ? Math.max(L.Ht, L.mode === "d" ? L.Hs : 0) : L.Hs; }
      function target(n) { return tidy ? (tmoved[n._k] || L.T[n._k] || L.S[n._k]) : (moved[n._k] || L.S[n._k]); }
      function placeBubble() {
        var fp = target(floristN);
        bubble.style.left = Math.max(4, Math.min(fp[0] + 30, L.W - 214)) + "px"; bubble.style.top = fp[1] + L.nh - 16 + "px";
      }
      function apply() {
        L = compute();
        wb.style.setProperty("--lp-nw", L.nw + "px"); wb.style.setProperty("--lp-nh", L.nh + "px");
        wb.classList.toggle("wb-s", L.nw < 150); wb.classList.toggle("wb-4", L.nw < 164);
        wb.style.height = H() + "px";
        notes.forEach(function (n) {
          var on = L.vis.indexOf(n) >= 0; n.hidden = !on; if (!on) return;
          var p = target(n); n.style.left = p[0].toFixed(1) + "px"; n.style.top = p[1].toFixed(1) + "px";
        });
        Object.keys(frames).forEach(function (g) {
          var f = frames[g], on = L.order.indexOf(g) >= 0; f.hidden = !on; if (!on) return;
          var r = tidy ? L.tfr[g] : L.fr[g];
          f.style.left = r[0] + "px"; f.style.top = r[1] + "px"; f.style.width = r[2] + "px"; f.style.height = r[3] + "px";
          var n = L.tfr[g][4]; if (g === "kitchen" && !tidy && !strayHome) n -= 1;
          $("b", f).textContent = n;
        });
        var c = L.cell, hp = [[c.ideas[0] + 6, c.ideas[1] + 2], [c.day[0] + 8, c.day[1] + L.fh + 16], [c.suppliers[0] + (L.mode === "d" ? 150 : 8), c.suppliers[1] + L.fh + 16]];
        hands.forEach(function (h, i) { h.hidden = L.mode === "m" && i > 0; h.style.left = hp[i][0] + "px"; h.style.top = hp[i][1] + "px"; });
        var arrows = L.mode !== "m";
        $(".wb-arrows", wb).style.display = arrows ? "" : "none"; depA.hidden = depB.hidden = !arrows;
        if (arrows) {
          var a1 = L.slot("day", 1), a2 = L.slot("suppliers", 0), x1 = a1[0] + L.nw + 6, y1 = a1[1] + L.nh / 2, x2 = a2[0] - 6;
          $(".ln", arrA).setAttribute("d", "M" + x1 + " " + y1 + " L" + x2 + " " + y1);
          $(".hd", arrA).setAttribute("d", "M" + (x2 - 7) + " " + (y1 - 5) + " L" + x2 + " " + y1 + " L" + (x2 - 7) + " " + (y1 + 5));
          depA.style.left = (x1 + x2) / 2 + "px"; depA.style.top = y1 + 20 + "px";
          var b1 = L.slot("kitchen", 3), b2 = L.slot("guests", 1), bx = b1[0] + L.nw / 2, by1 = b1[1] + L.nh + 6, by2 = b2[1] - 7;
          $(".ln", arrB).setAttribute("d", "M" + bx + " " + by1 + " L" + bx + " " + by2);
          $(".hd", arrB).setAttribute("d", "M" + (bx - 5) + " " + (by2 - 7) + " L" + bx + " " + by2 + " L" + (bx + 5) + " " + (by2 - 7));
          depB.style.left = bx + 56 + "px"; depB.style.top = (by1 + by2) / 2 + "px";
        }
        placeBubble();
        if (!rover || rover.hidden) { var first = L.vis.filter(function (n) { return !n.classList.contains("pending"); })[0]; if (first) setRover(first); }
        var shownN = L.vis.filter(function (n) { return !n.classList.contains("pending"); }).length;
        countEl.innerHTML = "<b>" + shownN + "</b> notes in <b>" + L.order.length + "</b> groups";
        if (cursors.dev) cursors.dev.hidden = L.mode === "m";
        $("span", tidyBtn).textContent = !tidy ? "Tidy" : window.innerWidth < 480 ? "Undo tidy" : "Back as it was";
      }
      function setTidy(on) {
        tidy = on; tmoved = {};
        wb.classList.toggle("tidy", on); apply();
        /* The four people go with their notes, on the notes' own timing, both ways. */
        park(reduce ? 1 : 800);
        tidyBtn.setAttribute("aria-pressed", on ? "true" : "false");
        announce(on ? "Tidied into columns, one for each group." : "Back where you left them.");
      }
      on(tidyBtn, "click", function () {
        setTidy(!tidy);
        /* Stacked layouts change height under the button, so bring the wall back to the top of the screen. */
        if (L.mode !== "d") wbx.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
      });
      function put(n, x, y) {
        var p = [Math.max(0, Math.min(x, L.W - L.nw)), Math.max(0, Math.min(y, H() - L.nh))];
        (tidy ? tmoved : moved)[n._k] = p; n.style.left = p[0] + "px"; n.style.top = p[1] + "px";
        if (n === floristN) placeBubble();
      }
      function pickUp(n) {
        var m = tidy ? tmoved : moved;
        picked = n; pickedFrom = { had: n._k in m, p: m[n._k] };
        n.classList.remove("sel", "held"); n.classList.add("picked"); n.setAttribute("aria-pressed", "true"); raise(n);
        announce(noteTitle(n) + ", picked up. Arrow keys move it.");
      }
      function putDown(back) {
        var n = picked; if (!n) return;
        picked = null; clearTimeout(movedT);
        n.classList.remove("picked"); n.setAttribute("aria-pressed", "false");
        if (back) {
          var m = tidy ? tmoved : moved;
          if (pickedFrom.had) m[n._k] = pickedFrom.p; else delete m[n._k];
          var p = target(n); n.style.left = p[0].toFixed(1) + "px"; n.style.top = p[1].toFixed(1) + "px";
          if (n === floristN) placeBubble();
        }
        announce(noteTitle(n) + (back ? ", put back." : ", put down."));
      }
      /* The nearest note in the direction pressed, counting sideways drift against it. */
      function nextNote(n, d) {
        var p = at(n), best = null, bs = Infinity;
        L.vis.forEach(function (o) {
          if (o === n || o.classList.contains("pending")) return;
          var q = at(o), dx = q[0] - p[0], dy = q[1] - p[1], along = dx * d[0] + dy * d[1], across = Math.abs(dx * d[1]) + Math.abs(dy * d[0]);
          if (along < 8) return;
          var sc = along + 2.5 * across; if (sc < bs) { bs = sc; best = o; }
        });
        return best;
      }
      notes.forEach(function (n) {
        var start = null;
        function lift() { start.moved = true; held = n; n.classList.remove("sel", "held"); n.classList.add("drag"); }
        on(n, "pointerdown", function (e) {
          if (e.button) return;
          var p = target(n), mouse = e.pointerType === "mouse", id = e.pointerId;
          start = { px: e.clientX, py: e.clientY, x: p[0], y: p[1], moved: false, armed: mouse, timer: 0 };
          if (mouse) { n.setPointerCapture(id); return; }
          /* Touch and pen: a swipe scrolls the page. Press and hold for 220ms to pick the note up. */
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
          if (!start.armed) { if (far > 8) { clearTimeout(start.timer); start = null; } return; }
          if (!start.moved) { if (far < 3) return; lift(); }
          put(n, start.x + e.clientX - start.px, start.y + e.clientY - start.py);
        });
        /* Once a held note is being carried, the page must not scroll under the finger. */
        on(n, "touchmove", function (e) { if (start && start.armed && e.cancelable) e.preventDefault(); }, { passive: false });
        on(n, "contextmenu", function (e) { if (start) e.preventDefault(); });
        function end() { if (!start) return; clearTimeout(start.timer); if (start.moved) { raise(n); announce("Note moved."); } start = null; held = null; n.classList.remove("drag"); }
        on(n, "pointerup", end); on(n, "pointercancel", end);
        on(n, "keydown", function (e) {
          var k = e.key;
          if (k === "Enter" || k === " " || k === "Spacebar") {
            e.preventDefault(); if (e.repeat) return;
            if (picked === n) putDown(false); else pickUp(n);
            return;
          }
          if (k === "Escape") { if (picked === n) { e.preventDefault(); putDown(true); } return; }
          var d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[k]; if (!d) return;
          e.preventDefault();
          if (picked === n) {
            var p = target(n), step = e.shiftKey ? 48 : 16; put(n, p[0] + d[0] * step, p[1] + d[1] * step);
            clearTimeout(movedT); movedT = later(function () { announce("Note moved."); }, 400);
          } else { var o = nextNote(n, d); if (o) { setRover(o); o.focus(); } }
        });
        on(n, "keyup", function (e) { if (e.key === " ") e.preventDefault(); });
        on(n, "focus", function () { setRover(n); if (n.matches(":focus-visible")) { held = n; wbFoot.classList.add("keys"); } });
        on(n, "blur", function () { if (picked === n) putDown(false); if (held === n && !n.classList.contains("drag")) held = null; });
      });

      /* The cast. */
      function sleep(ms) { return new Promise(function (r) { later(r, ms); }); }
      function at(n) { return [parseFloat(n.style.left), parseFloat(n.style.top)]; }
      function fly(who, x, y, ms, ease) {
        var c = cursors[who]; if (!c) return sleep(0);
        if (ease) c.style.setProperty("--lp-e", ease); else c.style.removeProperty("--lp-e");
        x = Math.max(4, Math.min(x, L.W - 74)); c.style.setProperty("--lp-d", (ms || 900) + "ms"); c.style.setProperty("--lp-x", x.toFixed(1) + "px"); c.style.setProperty("--lp-y", y.toFixed(1) + "px");
        return sleep(ms || 900);
      }
      function over(who, n, fx, fy, ms, ease) { var p = at(n); onNote[who] = n; return fly(who, p[0] + L.nw * fx, p[1] + L.nh * fy, ms, ease); }
      function busy(n) { return n === held || n === picked || n.classList.contains("drag") || n.hidden; }
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
        var e = ms > 1 ? "var(--ease-out)" : "";
        over("aoife", typedN, 0.82, 0.52, ms || 1, e); over("dara", strayN, 0.6, 0.56, ms || 1, e); over("niamh", floristN, 0.72, 0.3, ms || 1, e);
        if (L.mode !== "m") { var p = devSpot(); onNote.dev = null; fly("dev", p[0], p[1], ms || 1, e); }
        parkedAt = Date.now();
      }
      async function dara() {
        await over("dara", strayN, 0.6, 0.56, 1100);
        for (var i = 0; i < 6 && (busy(strayN) || tidy); i++) await sleep(1500);
        if (strayHome || moved[strayN._k] || busy(strayN) || tidy) { strayHome = strayHome || tidy; return; }
        who(strayN, "dara"); strayN.classList.add("held"); await sleep(350);
        strayHome = true; apply(); await over("dara", strayN, 0.6, 0.56, 800);
        strayN.classList.remove("held"); await sleep(300);
      }
      async function aoife() {
        await sleep(700); await over("aoife", typedN, 0.82, 0.52, 1200);
        who(typedN, "aoife"); typedN.classList.remove("pending"); typedN.classList.add("sel"); apply();
        var full = tx.dataset.full;
        for (var i = 1; i <= full.length; i++) { tx.textContent = full.slice(0, i); await sleep(full[i - 1] === " " ? 120 : 62); }
        await sleep(700); var c = $(".caret", typedN); if (c) c.remove(); typedN.classList.remove("sel");
      }
      async function dev() {
        if (L.mode === "m") return;
        var b1 = L.slot("kitchen", 3), b2 = L.slot("guests", 1), x = b1[0] + L.nw / 2 + 6;
        await fly("dev", x, b1[1] + L.nh + 2, 1100); await sleep(250);
        arrB.classList.remove("undrawn"); await fly("dev", x, b2[1] - 11, 900);
        depB.classList.remove("pending"); await sleep(300); await fly("dev", x - 66, (b1[1] + L.nh + b2[1]) / 2 + 6, 500);
      }
      async function niamh() {
        await over("niamh", floristN, 0.72, 0.3, 1200);
        if (!busy(floristN)) { who(floristN, "niamh"); floristN.classList.add("sel"); }
        await sleep(300); bubble.classList.remove("pending"); await sleep(1400); floristN.classList.remove("sel");
        later(function () {
          bubble.classList.add("pending");
          var chip = document.createElement("u"); chip.className = "cm"; chip.textContent = "1";
          var sm = $("small", floristN); sm.insertBefore(chip, $("i", sm));
          floristN.setAttribute("aria-label", floristN.getAttribute("aria-label") + ", 1 comment");
        }, 5200);
      }
      var parkedAt = 0, HOME = { aoife: ["day", "guests", "ideas"], dara: ["suppliers", "signage", "kitchen"], dev: ["kitchen", "guests"], niamh: ["suppliers", "day"] };
      async function ambient() {
        var names = Object.keys(HOME), i = 0;
        for (;;) {
          await sleep(1500 + Math.random() * 1200);
          if (!onWall || document.hidden || Date.now() - parkedAt < 1600) continue;
          var name = names[i++ % names.length]; if (cursors[name].hidden) continue;
          var pool = L.vis.filter(function (n) { return HOME[name].indexOf(n.dataset.g) >= 0 && !busy(n) && n !== picked && !n.classList.contains("pending") && !n.classList.contains("sel") && !names.some(function (o) { return o !== name && onNote[o] === n; }); });
          if (!pool.length) continue;
          var n = pool[Math.floor(Math.random() * pool.length)];
          await over(name, n, 0.45 + Math.random() * 0.3, 0.4 + Math.random() * 0.3, 1200);
          if (busy(n)) continue;
          who(n, name); n.classList.add("sel"); await sleep(1300); n.classList.remove("sel");
        }
      }
      var onWall = false, started = false;
      async function cast() {
        Object.keys(cursors).forEach(function (k) { cursors[k].classList.remove("away"); });
        await Promise.all([dara(), aoife()]);
        await Promise.all([dev(), sleep(900).then(niamh)]);
        castDone = true; ambient();
      }
      apply();
      if (reduce || !("IntersectionObserver" in window)) { park(); castDone = true; }
      else {
        /* Motion allowed: rewind the still to its opening state, then play once the wall is in view. */
        typedN.classList.add("pending"); typedN.classList.remove("sel"); tx.textContent = "";
        arrB.classList.add("undrawn"); depB.classList.add("pending"); bubble.classList.add("pending");
        apply();
        var seat = { aoife: [0.5, 0.96], dara: [0.98, 0.5], dev: [0.9, 0.04], niamh: [0.3, 0.02] };
        Object.keys(cursors).forEach(function (k) { cursors[k].classList.add("away"); fly(k, seat[k][0] * L.W, seat[k][1] * L.Hs, 1); });
        watch(function (es) {
          onWall = es[0].isIntersecting;
          if (onWall && !started && es[0].intersectionRatio >= 0.3) { started = true; cast(); }
        }, { threshold: [0, 0.3] }).observe(wb);
      }
      /* Only a change of width re-lays the wall; a phone's address bar sliding away must not. */
      var wbW = wb.clientWidth;
      function wbResize() { if (wb.clientWidth === wbW) return; wbW = wb.clientWidth; if (picked) putDown(false); moved = {}; tmoved = {}; apply(); if (castDone) park(1); }

      var rt;
      on(window, "resize", function () { clearTimeout(rt); rt = later(function () { fitAll(); wbResize(); watchSteps(); ringFit(); }, 120); });

      /* The closing rings clear the promise line and the form at every width. */
      var rings = $("#rings"), closeWrap = rings.parentNode;
      function ringFit() {
        var b = closeWrap.getBoundingClientRect(), cx = b.left + b.width / 2, cy = b.top + b.height / 2, need = 0;
        /* The confirmation is a full-width row, so its words are measured, not its box. */
        $$(".sub, .wl, .wl-done > *", closeWrap).forEach(function (el) {
          if (el.closest("[hidden]")) return;
          var r = el.getBoundingClientRect();
          [[r.left, r.top], [r.right, r.top], [r.left, r.bottom], [r.right, r.bottom]].forEach(function (p) { need = Math.max(need, Math.sqrt(Math.pow(p[0] - cx, 2) + Math.pow(p[1] - cy, 2))); });
        });
        rings.style.setProperty("--lp-r1", Math.round(Math.max(need + 16, 360 * Math.min(1, window.innerWidth / 1440))) + "px");
      }
      ringFit();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(ringFit);
      on(window, "load", ringFit);

      /* The waitlist form is a React component (home-waitlist.tsx) wired to the real action.
         Its height changes when the form gives way to the confirmation, so the rings refit. */
      var wlForm = $("#waitlist-form"), wlIn = $("#wl-email"), wlDone = $("#wl-done");
      if ("ResizeObserver" in window) { var ringRO = new ResizeObserver(function () { if (!dead) ringFit(); }); ringRO.observe(closeWrap); stops.push(function () { ringRO.disconnect(); }); }
      /* Every other "Join the waitlist" lands here with the cursor in the field, except on
         touch screens, where that would throw the keyboard up over the page. */
      var touchy = matchMedia("(hover: none), (pointer: coarse)");
      function arriveJoin() {
        if (touchy.matches) return;
        (wlForm.hidden ? wlDone : wlIn).focus({ preventScroll: true });
      }
      $$('a[href="#join"]').forEach(function (a) { on(a, "click", function () { later(arriveJoin, 0); }); });
      if (location.hash === "#join") later(arriveJoin, 0);
  })();

  return function stop() {
    dead = true;
    offs.forEach(function (f) { f(); });
    timers.forEach(function (id) { clearTimeout(id); });
    observers.forEach(function (o) { o.disconnect(); });
    stops.forEach(function (f) { f(); });
  };
}
