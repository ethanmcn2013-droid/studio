// @ts-nocheck
// Generated from the Design canvas (landing/project/Main.dc.html) by port.py. Edit the canvas source and re-run the port.
"use client";

import React from "react";
import { joinWaitlistAction } from "@/app/waitlist/actions";
import { initialWaitlistFormState } from "@/app/waitlist/types";
import "./landing-v3-palette.css";
import "./landing-v3.css";

const USE_CASE = { Venue: "venues", "Building crew": "trades", School: "other", Studio: "small-business", "Something else": "other" };

const CARDS = [{"id": "c0", "col": 0, "title": "Agree the winter price list"}, {"id": "c1", "col": 0, "title": "Order the heating manifold"}, {"id": "c2", "col": 0, "title": "Reprint the faded welcome sign"}, {"id": "c3", "col": 0, "title": "Hire extra glassware for the launch evening"}, {"id": "c4", "col": 1, "title": "Order tonic and the good olives"}, {"id": "c5", "col": 1, "title": "Menu tasting at The Orchard"}, {"id": "c6", "col": 1, "title": "Build the Saturday run-sheet"}, {"id": "c7", "col": 2, "title": "Approve the seating plan"}, {"id": "c8", "col": 2, "title": "Chase florist deposit"}, {"id": "c9", "col": 2, "title": "Confirm the band’s arrival time with The Lindens"}, {"id": "c10", "col": 3, "title": "Sign off the winter menu"}, {"id": "c11", "col": 3, "title": "Approve the brochure copy"}, {"id": "c12", "col": 3, "title": "Lay out the long table for twenty"}];
const FILES = [{"id": "f0", "src": "signal", "hay": "seating plan v4.pdf approve the seating plan aoife walsh uploaded"}, {"id": "f1", "src": "signal", "hay": "tasting menu, draft 2.pdf menu tasting at the orchard dara quinn uploaded"}, {"id": "f3", "src": "signal", "hay": "barn floor plan.png lay out the long table for twenty tomás ryan uploaded"}, {"id": "f2", "src": "drive", "hay": "guest list confirm final numbers orla byrne google drive"}, {"id": "f4", "src": "links", "hay": "fernandfurrow.ie chase florist deposit orla byrne fernandfurrow.ie"}, {"id": "f5", "src": "signal", "hay": "run-sheet v2.docx build the saturday run-sheet aoife walsh uploaded"}, {"id": "f6", "src": "drive", "hay": "event costings send the final invoice orla byrne google drive"}, {"id": "f7", "src": "signal", "hay": "table names.xlsx print table names orla byrne uploaded"}, {"id": "f8", "src": "drive", "hay": "ceremony running order brief the ceremony team aoife walsh google drive"}, {"id": "f9", "src": "links", "hay": "thelindens.ie confirm the band's arrival time dara quinn thelindens.ie"}, {"id": "f10", "src": "signal", "hay": "florist quote.pdf chase florist deposit orla byrne uploaded"}, {"id": "f11", "src": "drive", "hay": "supplier contacts send final numbers to suppliers aoife walsh google drive"}];
const PROJECTS = [{"slug": "winter", "group": "venue", "pace": "behind", "late": 4}, {"slug": "mf", "group": "events", "pace": "behind", "late": 3}, {"slug": "roof", "group": "venue", "pace": "close", "late": 1}, {"slug": "xmas", "group": "events", "pace": "pace", "late": 0}, {"slug": "spring", "group": "events", "pace": "pace", "late": 0}, {"slug": "web", "group": "venue", "pace": "pace", "late": 0}, {"slug": "rhythm", "group": "business", "pace": "nodate", "late": 1}, {"slug": "personal", "group": "business", "pace": "nodate", "late": 0}];
const COL_BASE = [23, 7, 5, 4];

const SCOPES = [
  { id: 'all', label: 'All', n: 8, lead: '2 of 6 projects with a date are behind.', rest: '4 of the 9 late tasks are on the winter launch.',
    onTime: 77, late: 9, lateSub: 'the oldest 7 days late', listTitle: 'Every project', foot: 'Two more are on pace. Two have no date yet.',
    order: ['winter', 'mf', 'roof', 'xmas'] },
  { id: 'events', label: 'Weddings and events', n: 3, lead: '1 of 3 is behind.', rest: 'Mara and Finn’s wedding has 3 late tasks and 8 days to go.',
    onTime: 81, late: 3, lateSub: 'all on Mara and Finn’s wedding', listTitle: 'Weddings and events', foot: 'Spring open day starts in March.',
    order: ['mf', 'xmas', 'spring'] },
  { id: 'venue', label: 'The venue', n: 3, lead: '1 of 3 is behind, and 1 is close.', rest: 'The winter launch has the most late work.',
    onTime: 70, late: 5, lateSub: 'the oldest 7 days late', listTitle: 'The venue', foot: 'The website refresh is ahead of the time gone.',
    order: ['winter', 'roof', 'web'] },
  { id: 'business', label: 'Running the business', n: 2, lead: 'Neither project has a date, so neither can fall behind.', rest: 'One task is late, on the monthly business rhythm.',
    onTime: 84, late: 1, lateSub: 'on the monthly business rhythm', listTitle: 'Running the business', foot: 'Add a date to a project to see its pace.',
    order: ['rhythm', 'personal'] }
];
const DRAFT = '@Ping move the table names to Thursday and remind Dara about the tonic.';
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';

class LandingV3 extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      run: null, done: [], gone: [], toast: [], bump: false, say: '', cue: null, rover: 'c0', flashRun: false,
      scope: 'all', anSwap: false, anReveal: false,
      q: '', src: null, view: 'cards',
      tlN: 8,
      cx: 0, sending: false, applied: false, reply: false, ring: false,
      email: '', wl: 'idle', wlMsg: '', wlFrom: 'close',
      sticky: false, vp: false
    };
    this.timers = [];
    this.root = null;
    this.played = {};
    this.chatT = [];
    this.setRoot = (el) => { if (el) this.root = el; };
    this.state.theme = 'light';
  }

  later(fn, ms) { const t = setTimeout(fn, ms); this.timers.push(t); return t; }
  reduced() { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }
  $(sel) { const r = this.root || document; return r.querySelector(sel); }
  $$(sel) { const r = this.root || document; return Array.prototype.slice.call(r.querySelectorAll(sel)); }

  componentDidMount() {
    try {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const pick = () => this.setState({ theme: document.documentElement.dataset.lv3Theme || (mq.matches ? 'dark' : 'light') });
      pick(); mq.addEventListener('change', pick); this.mq = () => mq.removeEventListener('change', pick);
    } catch (e) {}
    const root = this.root || document.querySelector('.ss');
    if (!root) return;
    this.root = root;
    root.setAttribute('data-motion', '');
    if (this.reduced()) this.setState({ tlN: 8 });
    const els = root.querySelectorAll('[data-reveal]');
    const fire = (el) => {
      if (el.hasAttribute('data-in')) return;
      el.setAttribute('data-in', '');
      this.onReveal(el.getAttribute('data-reveal'));
    };
    if (typeof IntersectionObserver === 'undefined') { els.forEach(fire); this.setState({ tlN: 8 }); return; }
    this.io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { fire(e.target); this.io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -15% 0px', threshold: 0 });
    els.forEach((el) => this.io.observe(el));
    // board cue waits until half the board is in view
    const board = root.querySelector('.win');
    if (board) {
      this.boardIo = new IntersectionObserver((en) => {
        en.forEach((e) => { if (e.intersectionRatio >= 0.5) { this.cueBoard(); this.boardIo.disconnect(); } });
      }, { threshold: [0.5] });
      this.boardIo.observe(board);
    }
    // phone sticky bar: after the hero, until the waitlist
    const hero = root.querySelector('.hero'), wl = root.querySelector('#waitlist');
    if (hero && wl) {
      this.seen = { hero: true, wl: false };
      this.stickyIo = new IntersectionObserver((en) => {
        en.forEach((e) => { if (e.target === hero) this.seen.hero = e.isIntersecting; else this.seen.wl = e.isIntersecting; });
        const on = !this.seen.hero && !this.seen.wl;
        if (on !== this.state.sticky) this.setState({ sticky: on });
      }, { threshold: 0 });
      this.stickyIo.observe(hero); this.stickyIo.observe(wl);
    }
  }

  componentWillUnmount() {
    if (this.mq) this.mq();
    this.timers.forEach(clearTimeout);
    [this.io, this.boardIo, this.stickyIo, this.chatIo].forEach((o) => { if (o) o.disconnect(); });
  }

  // ---------- FLIP: things that move keep their place on screen ----------
  getSnapshotBeforeUpdate(prevProps, prevState) {
    const snap = {};
    const s = this.state;
    if (prevState.scope !== s.scope) snap.rows = this.rects('.an-row:not(.is-out)', 'data-row');
    if (prevState.q !== s.q || prevState.src !== s.src || prevState.view !== s.view) snap.files = this.rects('.files_shelf_cardItem:not(.is-out)', 'data-file');
    const stream = this.$('[data-stream]');
    if (stream) snap.streamH = stream.scrollHeight;
    return snap;
  }
  rects(sel, attr) { const m = {}; this.$$(sel).forEach((el) => { m[el.getAttribute(attr)] = el.getBoundingClientRect(); }); return m; }
  flip(sel, attr, before) {
    if (!before || this.reduced()) return;
    this.$$(sel).forEach((el) => {
      const b = before[el.getAttribute(attr)]; if (!b || !el.animate) return;
      const a = el.getBoundingClientRect(); const dx = b.left - a.left, dy = b.top - a.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 220, easing: EASE_OUT });
    });
  }
  componentDidUpdate(prevProps, prevState, snap) {
    if (!snap) return;
    if (snap.rows) this.flip('.an-row:not(.is-out)', 'data-row', snap.rows);
    if (snap.files) this.flip('.files_shelf_cardItem:not(.is-out)', 'data-file', snap.files);
    const stream = this.$('[data-stream]');
    if (stream && snap.streamH && stream.scrollHeight > snap.streamH && !this.reduced() && stream.animate) {
      const dh = Math.min(stream.scrollHeight - snap.streamH, 160);
      stream.animate([{ transform: `translateY(${dh}px)` }, { transform: 'none' }], { duration: 320, easing: EASE_OUT });
    }
  }

  onReveal(name) {
    if (this.played[name]) return;
    this.played[name] = true;
    if (name === 'timeline') this.countDown();
    if (name === 'chat') this.waitForChat();
    if (name === 'files') this.later(() => this.setState({ filesSettled: true }), 1600);
    if (name === 'analytics') { this.setState({ anReveal: true }); this.later(() => this.setState({ anReveal: false }), 1400); }
    if (name === 'venues') this.later(() => this.setState({ vp: true }), this.reduced() ? 0 : 450);
  }

  cueBoard() {
    if (this.reduced() || this.touched) return;
    const first = this.visibleCards()[0];
    if (!first) return;
    this.setState({ cue: first.id });
    this.later(() => this.setState({ cue: null }), 1900);
  }

  countDown() {}

  // ---------- chat ----------
  waitForChat() {
    const stage = this.$('.cx-stage');
    if (!stage || typeof IntersectionObserver === 'undefined') { this.playChat(); return; }
    this.chatIo = new IntersectionObserver((en) => { en.forEach((e) => { if (e.intersectionRatio >= 0.5) { this.chatIo.disconnect(); this.playChat(); } }); }, { threshold: [0.5] });
    this.chatIo.observe(stage);
  }
  playChat() {
    this.chatT.forEach(clearTimeout); this.chatT = [];
    const at = (fn, ms) => { this.chatT.push(this.later(fn, ms)); };
    if (this.reduced()) { this.setState({ cx: 3, applied: false, reply: false, ring: false, sending: false }); return; }
    this.setState({ cx: 0, applied: false, reply: false, ring: false, sending: false, typed: 0, mTyping: false });
    let t = 300;
    for (let i = 1; i <= DRAFT.length; i += 2) { const n = i; t += 28; at(() => this.setState({ typed: n }), t); }
    at(() => this.setState({ typed: DRAFT.length }), t + 28);
    t += 420;
    at(() => this.setState({ sending: true }), t);
    at(() => this.setState({ cx: 1, sending: false }), t + 140);
    at(() => this.setState({ cx: 2 }), t + 640);
    at(() => this.setState({ cx: 3 }), t + 1500);
    at(() => { if (!this.state.applied) this.setState({ ring: true }); }, t + 2300);
  }
  apply() {
    if (this.state.applied || this.state.cx < 3) return;
    this.chatT.forEach(clearTimeout); this.chatT = [];
    this.setState({ applied: true, ring: false });
    if (this.reduced()) { this.setState({ reply: true }); return; }
    this.chatT.push(this.later(() => this.setState({ mTyping: true }), 700));
    this.chatT.push(this.later(() => this.setState({ mTyping: false, reply: true }), 1400));
  }

  // ---------- board ----------
  visibleCards() { return CARDS.filter((c) => this.state.gone.indexOf(c.id) === -1); }
  focusCard(id) {
    this.later(() => { const el = this.$(`[data-card="${id}"] .tk-ck`); if (el) el.focus(); }, 30);
  }
  tick(id, ev) {
    this.touched = true;
    const card = CARDS.find((c) => c.id === id);
    if (!card || this.state.done.indexOf(id) !== -1) return;
    const kb = !!(ev && ev.detail === 0);
    const vis = this.visibleCards(); const at = vis.findIndex((c) => c.id === id);
    const next = (vis[at + 1] || vis[at - 1] || {}).id;
    this.goneT = this.goneT || {};
    clearTimeout(this.toastT); clearTimeout(this.bumpT);
    const toast = (this.state.toast || []).concat(id);
    this.setState({ done: this.state.done.concat(id), toast: toast, say: card.title + ' marked done. Undo is in the message at the top of the board.', cue: null, kb: kb });
    this.goneT[id] = this.later(() => {
      this.setState((st) => ({ gone: st.gone.concat(id), bump: true, rover: next || st.rover }));
      if (kb && next) this.focusCard(next);
      clearTimeout(this.bumpT); this.bumpT = this.later(() => this.setState({ bump: false }), 360);
    }, kb ? 200 : 360);
    this.toastT = this.later(() => this.setState({ toast: [] }), 5200);
  }
  undo() {
    const ids = this.state.toast || [];
    if (!ids.length) return;
    clearTimeout(this.toastT);
    ids.forEach((id) => { if (this.goneT && this.goneT[id]) clearTimeout(this.goneT[id]); });
    const first = ids[0];
    const say = ids.length === 1 ? CARDS.find((c) => c.id === first).title + ' is back on the board.' : ids.length + ' cards are back on the board.';
    this.setState({ done: this.state.done.filter((x) => ids.indexOf(x) === -1), gone: this.state.gone.filter((x) => ids.indexOf(x) === -1), toast: [], rover: first, say: say });
    this.focusCard(first);
  }
  boardKey(e) {
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1, Home: 'first', End: 'last' };
    if (!(e.key in keys)) return;
    const vis = this.visibleCards(); if (!vis.length) return;
    const at = Math.max(0, vis.findIndex((c) => c.id === this.state.rover));
    const k = keys[e.key];
    const to = k === 'first' ? 0 : k === 'last' ? vis.length - 1 : Math.min(vis.length - 1, Math.max(0, at + k));
    e.preventDefault();
    this.setState({ rover: vis[to].id });
    this.focusCard(vis[to].id);
  }

  renderBoard() {
    const { done, gone, toast, bump, say, cue, rover } = this.state;
    const bd = { bump: bump ? 'bump' : '', say: say, undo: () => this.undo(), key: (e) => this.boardKey(e),
      hold: () => clearTimeout(this.toastT),
      release: () => { clearTimeout(this.toastT); if ((this.state.toast || []).length) this.toastT = this.later(() => this.setState({ toast: [] }), 3000); } };
    const n = COL_BASE.slice();
    const vis = this.visibleCards();
    const roverId = vis.some((c) => c.id === rover) ? rover : (vis[0] || {}).id;
    CARDS.forEach((c) => {
      const isDone = done.indexOf(c.id) !== -1, isGone = gone.indexOf(c.id) !== -1;
      if (isGone) n[c.col] -= 1;
      bd[c.id] = { p: isDone ? 'true' : 'false', c: (isDone ? 'is-done' : '') + (cue === c.id ? ' cue' : '') + (isDone && this.state.kb ? ' kb' : ''), w: isGone ? 'is-gone' : '',
        ti: c.id === roverId ? '0' : '-1', t: (e) => (isDone ? null : this.tick(c.id, e)) };
    });
    n.forEach((v, i) => { bd['n' + i] = String(v); });
    bd.doneLabel = (58 + gone.length) + ' done';
    const ts = toast || [];
    const tc = ts.length === 1 ? CARDS.find((c) => c.id === ts[0]) : null;
    bd.toastText = ts.length > 1 ? ts.length + ' done' : tc ? 'Done: ' + tc.title : '';
    bd.toastCls = ts.length ? 'on' : '';
    bd.undoTab = ts.length ? '0' : '-1';
    return bd;
  }

  renderAnalytics() {
    const cur = SCOPES.find((s) => s.id === this.state.scope) || SCOPES[0];
    const p = {};
    PROJECTS.forEach((pr) => { const i = cur.order.indexOf(pr.slug); p[pr.slug] = { cls: i === -1 ? 'is-out' : '', o: String(i === -1 ? 99 : i) }; });
    return {
      scopes: SCOPES.map((s) => ({ label: s.label, n: String(s.n), pressed: s.id === cur.id ? 'true' : 'false',
        pick: () => { if (s.id === this.state.scope) return; this.setState({ scope: s.id, anSwap: true }); this.later(() => this.setState({ anSwap: false }), 240); } })),
      lead: cur.lead, rest: cur.rest, onTime: String(cur.onTime), late: String(cur.late), lateSub: cur.lateSub,
      listTitle: cur.listTitle, foot: cur.foot, p: p,
      cardCls: (this.state.anSwap ? 'is-swap' : '') + (this.state.anReveal ? ' is-revealing' : '')
    };
  }

  renderFiles() {
    const { q, src, view } = this.state;
    const qq = q.trim().toLowerCase();
    const terms = qq ? qq.split(/\s+/) : [];
    const c = {};
    let hits = 0;
    FILES.forEach((f) => {
      const ok = (!terms.length || terms.every((t) => f.hay.indexOf(t) !== -1)) && (!src || f.src === src);
      c[f.id] = ok ? '' : 'is-out';
      if (ok) hits += 1;
    });
    const set = (patch) => this.setState(patch);
    const NAMES = { signal: 'Uploaded', drive: 'Google Drive', links: 'Links' };
    const filtered = !!qq || !!src;
    const sp = {}, pick = {};
    ['signal', 'drive', 'links'].forEach((k) => { sp[k] = src === k ? 'true' : 'false'; pick[k] = () => set({ src: src === k ? null : k }); });
    const what = [qq ? '“' + q.trim() + '”' : '', src ? NAMES[src] : ''].filter(Boolean).join(' in ');
    return {
      q: q, hasQ: !!qq, c: c, empty: filtered && hits === 0, sp: sp, pick: pick,
      emptyT: 'Nothing matches ' + (what || 'that'),
      rowCls: (filtered ? 'is-search' : '') + (view === 'list' ? ' is-list' : ''),
      frameCls: (src ? 'has-src' : '') + (this.state.filesSettled ? ' is-settled' : '') + (this.state.viewSwap ? ' is-swap' : ''),
      sum: filtered ? 'Showing ' + hits + ' of 12 files.' : '12 files on 11 tasks for Mara and Finn’s wedding, 8 added this week.',
      title: filtered ? (hits === 1 ? '1 file' : hits + ' files') : 'Latest additions',
      sub: filtered ? 'matching ' + what : 'Newest files from every source',
      vCards: view === 'cards' ? 'true' : 'false', vList: view === 'list' ? 'true' : 'false',
      asCards: () => this.swapView('cards'), asList: () => this.swapView('list'),
      onFind: (e) => set({ q: e && e.target ? e.target.value : '' }),
      clear: () => set({ q: '' }), reset: () => set({ q: '', src: null }),
      tryMara: () => this.typeQuery('Aoife'), tryMenu: () => this.typeQuery('menu'), tryDrive: () => { this.setState({ q: '', src: 'drive' }); }
    };
  }
  swapView(view) {
    if (view === this.state.view) return;
    this.setState({ view: view, viewSwap: true });
    this.later(() => this.setState({ viewSwap: false }), 200);
  }
  typeQuery(word) {
    clearTimeout(this.typeT);
    this.setState({ src: null });
    if (this.reduced()) { this.setState({ q: word }); return; }
    let i = 0;
    const step = () => { i += 1; this.setState({ q: word.slice(0, i) }); if (i < word.length) this.typeT = this.later(step, 45); };
    this.setState({ q: '' });
    this.typeT = this.later(step, 60);
  }

  renderChat() {
    const { cx, applied, reply, ring, sending, typed, mTyping } = this.state;
    const tn = typed == null ? DRAFT.length : typed;
    return {
      s1: cx >= 1, typing: cx === 2, s3: cx >= 3, reply: reply, mTyping: mTyping,
      draft: cx >= 1 ? 'Message Mara & Finn’s wedding' : (tn === 0 ? 'Message Mara & Finn’s wedding' : DRAFT.slice(0, tn)),
      aud: applied ? 'The 5 people on this project can see the changes' : 'When you apply, the 5 people on this project see the changes',
      compCls: cx >= 1 || tn === 0 ? '' : 'has-draft',
      sendCls: sending ? 'is-pressed' : '',
      planCls: applied ? 'is-applied' : '',
      planSub: applied ? 'Applied' : '3 steps',
      applyLabel: applied ? 'Applied' : 'Apply 3 steps',
      applyCls: ring ? 'is-ready' : '',
      replayCls: cx >= 3 ? 'is-ready' : '',
      applied: applied ? 'true' : 'false',
      canUndo: applied,
      footNote: applied ? 'Dara has been reminded' : 'Undo any step',
      badge: '2',
      apply: () => this.apply(),
      undo: () => { this.chatT.forEach(clearTimeout); this.chatT = []; this.setState({ applied: false, reply: false, mTyping: false }); },
      replay: () => { this.played.chat = true; this.playChat(); }
    };
  }

  // ---------- waitlist: one state, two forms ----------
  submitFrom(from, e) {
    if (e && e.preventDefault) e.preventDefault();
    if (this.state.wl === 'busy') return;
    const v = (this.state.email || '').trim();
    const input = from === 'hero' ? '#hero-email' : '#wl-email';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      this.setState({ wl: 'error', wlFrom: from, wlMsg: v ? 'That email looks incomplete. Check it and try again.' : 'Enter your email address to join.' });
      this.later(() => { const el = this.$(input); if (el) el.focus(); }, 20);
      return;
    }
    this.setState({ wl: 'busy', wlMsg: '', wlFrom: from });
    const run = this.state.run;
    const fd = new FormData();
    fd.set('email', v); fd.set('source', from === 'hero' ? 'home_hero' : 'home_close'); fd.set('campaign', 'pre_access_waitlist');
    fd.set('audience', run ? run.toLowerCase() : ''); fd.set('useCase', USE_CASE[run] || ''); fd.set('artifact', from === 'hero' ? 'hero_form' : 'close_form');
    fd.set('touch', 'site'); fd.set('path', '/'); fd.set('company', (this.$('input[name=company]') || {}).value || '');
    joinWaitlistAction(initialWaitlistFormState, fd).then((res) => {
      if (res.status === 'success') {
        this.setState({ wl: 'done', email: v });
        this.later(() => { const el = this.$(from === 'hero' ? '#hero-done' : '#close-done'); if (el) el.focus(); }, 40);
      } else {
        this.setState({ wl: 'error', wlMsg: res.message || 'That did not save. Try again in a moment.' });
        this.later(() => { const el = this.$(input); if (el) el.focus(); }, 20);
      }
    }, () => {
      this.setState({ wl: 'error', wlMsg: 'That did not save. Check your connection and try again.' });
    });
  }
  renderWaitlist() {
    const { email, wl, wlMsg, wlFrom } = this.state;
    const busy = wl === 'busy', err = wl === 'error';
    const mine = (f) => wlFrom === f;
    return {
      email: email, showForm: wl !== 'done', done: wl === 'done', busy: busy ? 'true' : 'false',
      invalid: err && mine('close') ? 'true' : 'false', invalidHero: err && mine('hero') ? 'true' : 'false',
      btnLabel: busy && mine('close') ? 'Joining' : 'Join the waitlist', btnCls: busy && mine('close') ? 'is-busy' : '',
      btnLabelHero: busy && mine('hero') ? 'Joining' : 'Join the waitlist', btnClsHero: busy && mine('hero') ? 'is-busy' : '',
      msg: mine('close') ? wlMsg : '', msgCls: err && mine('close') ? 'is-error' : '',
      msgHero: mine('hero') ? wlMsg : '', msgClsHero: err && mine('hero') ? 'is-error' : '',
      onEmail: (e) => this.setState({ email: e && e.target ? e.target.value : '', wl: err ? 'idle' : wl, wlMsg: err ? '' : wlMsg }),
      submit: (e) => this.submitFrom('close', e),
      submitHero: (e) => this.submitFrom('hero', e),
      reset: () => { this.setState({ wl: 'idle', email: '', wlMsg: '', wlFrom: 'close' }); this.later(() => { const el = this.$('#wl-email'); if (el) el.focus(); }, 40); }
    };
  }

  renderVals() {
    const labels = ['Venue', 'Building crew', 'School', 'Studio', 'Something else'];
    const run = this.state.run;
    const sticky = this.state.sticky && this.state.wl !== 'done';
    return {
      themeClass: this.state.theme === 'dark' ? 'dark' : '',
      setRoot: this.setRoot,
      tlN: String(this.state.tlN), tlCls: this.state.tlRoll ? 'roll' : '',
      bd: this.renderBoard(),
      an: this.renderAnalytics(),
      fs: this.renderFiles(),
      cx: this.renderChat(),
      wl: this.renderWaitlist(),
      vpCls: this.state.vp ? 'on' : '',
      venueCta: () => { this.setState({ run: 'Venue', flashRun: true }); this.later(() => this.setState({ flashRun: false }), 1400); },
      stickyCls: sticky ? 'on' : '', stickyHidden: sticky ? 'false' : 'true', stickyTab: sticky ? '0' : '-1',
      runs: labels.map((l, i) => ({
        label: l, cls: this.state.flashRun && l === 'Venue' ? 'flash' : '',
        checked: run === l ? 'true' : 'false',
        ti: (run ? run === l : i === 0) ? '0' : '-1',
        pick: () => this.setState({ run: l }),
        key: (e) => {
          const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
          if (!step) return;
          e.preventDefault();
          const next = labels[(i + step + labels.length) % labels.length];
          this.setState({ run: next });
          this.later(() => { const b = (this.root || document).querySelectorAll('.runs [role="radio"]')[labels.indexOf(next)]; if (b) b.focus(); }, 20);
        }
      }))
    };
  }

  render() {
    const v = this.renderVals();
    return (
<div suppressHydrationWarning className={`ss ${v.themeClass}`} ref={v.setRoot} style={{minHeight: '100vh', width: '100%'}}>
<a href="#waitlist" className="skip">Skip to the waitlist</a>
<header className="wrap">
<nav className="nav" aria-label="Main">
<a href="#top" className="mark" aria-label="Signal Studio home"><span className="ring" aria-hidden="true"><i /></span>Signal Studio</a>
<div className="nav-links">
<a href="#venues">For venues</a>
<a href="#timeline">Timeline</a>
<a href="#analytics">Analytics</a>
<a href="#files">Files</a>
<a href="#chat">Chat</a>
<a href="#pricing">Pricing</a>
</div>
<div className="nav-r">
<a href="#waitlist" className="btn btn-line btn-sm">Join the waitlist</a>
</div>
</nav>
</header>
<main id="top">
<section className="hero" id="tasks" aria-labelledby="hero-title" data-reveal="hero">
<div className="dots" aria-hidden="true" />
<div className="dots-fade" aria-hidden="true" />
<div className="wrap hero-in">
<h1 className="h1 rise d1" id="hero-title">Know what needs you today<em>.</em></h1>
<p className="lede rise d2">Tasks, dates, files and chat in one place, for the people who run venues, crews, schools and studios, not software.</p>
{(v.wl.showForm) ? (<>
<form className="hero-form rise d3" noValidate={true} onSubmit={v.wl.submitHero}>
<label htmlFor="hero-email" className="hero-l">Your email</label>
<input id="hero-email" type="email" placeholder="you@example.ie" autoComplete="email" value={v.wl.email} onChange={v.wl.onEmail} aria-invalid={v.wl.invalidHero} aria-describedby="hero-msg" />
<button type="submit" className={`btn btn-solid wl-btn ${v.wl.btnClsHero}`} aria-disabled={v.wl.busy}><span className="wl-spin" aria-hidden="true" /><span>{v.wl.btnLabelHero}</span></button>
</form>
<p id="hero-msg" className={`hero-msg ${v.wl.msgClsHero}`} aria-live="polite">{v.wl.msgHero}</p>
</>) : null}
{(v.wl.done) ? (<>
<p className="hero-done rise" id="hero-done" tabIndex="-1"><span className="hd-ck" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></span>You’re on the list. I will email <b>{v.wl.email}</b> once, when your access is ready.</p>
</>) : null}
<p className="trust rise d3">Free to join. No card. Running a venue? <a href="#venues" className="trust-link">See the Founding 25 <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" /></svg></a></p>
<div className="win-wrap rise d4" id="sample">
<div className="win" role="group" aria-label="A working sample of the task board for The Orchard" data-reveal="board">
<aside className="side" aria-hidden="true">
<span className="mark"><span className="ring"><i /></span>Signal Studio</span>
<div className="side-search"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4-4" /></svg>Find a task</div>
<div className="side-ws"><span className="lg">O</span><span><b>The Orchard, events</b><small>Adare</small></span></div>
<span className="side-i"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></svg>Home</span>
<span className="side-i"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l5-6 4 4 4-7 5 9" /></svg>Overview</span>
<span className="side-i"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><rect x="3" y="4" width="7" height="7" rx="1.5" /><rect x="14" y="4" width="7" height="7" rx="1.5" /><rect x="3" y="15" width="7" height="5" rx="1.5" /><rect x="14" y="15" width="7" height="5" rx="1.5" /></svg>Projects</span>
<span className="side-h">Tasks</span>
<span className="side-i on"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><rect x="3" y="4" width="5" height="16" rx="1.5" /><rect x="10" y="4" width="5" height="10" rx="1.5" /><rect x="17" y="4" width="4" height="13" rx="1.5" /></svg>Board</span>
<span className="side-i"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" /></svg>List</span>
<span className="side-i"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>Calendar</span>
<span className="side-h">{"\u200b"}</span>
<span className="side-i"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z" /><path d="M14 3v5h5" /></svg>Files</span>
<span className="side-i"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 20V11M12 20V4M19 20v-6" /></svg>Analytics</span>
<span className="side-i"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16v11H9l-5 4z" /></svg>Chat</span>
</aside>
<div className="board-area">
<div className="tbar">
<span className="tseg" aria-hidden="true"><span className="on"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><rect x="3" y="4" width="5" height="16" rx="1.5" /><rect x="10" y="4" width="5" height="10" rx="1.5" /><rect x="17" y="4" width="4" height="13" rx="1.5" /></svg>Board</span><span><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" /></svg>List</span><span><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17" /></svg>Calendar</span></span>
<span className="tgroup" aria-hidden="true">Group by <b>Stage</b><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg></span>
<span className={`tdone ${v.bd.bump}`}><svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="var(--good)" /><path d="m8 12 3 3 5-6" stroke="var(--lv3-c-ffffff)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg><span className="done-n">{v.bd.doneLabel}</span></span><span className="tfind" aria-hidden="true"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4-4" /></svg>Find a task</span>
</div>
<div className="board" onKeyDown={v.bd.key}>
<div className="col">
<div className="col-h"><div className="col-t"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /></svg><b>To do</b><span className="n">{v.bd.n0}</span></div>
</div>
<div className={`tkw ${v.bd.c0.w}`} data-card="c0"><div className="tkw-in">
<div className={`tk ${v.bd.c0.c}`}><div className="tk-b"><button type="button" className="tk-ck" tabIndex={v.bd.c0.ti} aria-pressed={v.bd.c0.p} onClick={v.bd.c0.t} aria-label="Mark done: Agree the winter price list"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></button><span className="tk-t">Agree the winter price list</span>
<div className="tk-row"><span className="dc late"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17" /></svg>7 days late</span><span className="av" style={{background: 'var(--tone-plum-bg)', color: 'var(--tone-plum-fg)'}}>OB</span></div>
<div className="tk-row"><span className="pj"><i style={{background: 'var(--lv3-c-16a34a)'}} />Winter launch</span></div></div></div>
</div></div>
<div className={`tkw ${v.bd.c1.w}`} data-card="c1"><div className="tkw-in">
<div className={`tk ${v.bd.c1.c}`}><div className="tk-b"><button type="button" className="tk-ck" tabIndex={v.bd.c1.ti} aria-pressed={v.bd.c1.p} onClick={v.bd.c1.t} aria-label="Mark done: Order the heating manifold"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></button><span className="tk-t">Order the heating manifold</span>
<div className="tk-row"><span className="dc late"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17" /></svg>4 days late</span><span className="av" style={{background: 'var(--tone-blue-bg)', color: 'var(--tone-blue-fg)'}}>TR</span></div>
<div className="tk-row"><span className="pj"><i style={{background: 'var(--lv3-c-2563eb)'}} />Barn roof</span></div></div></div>
</div></div>
<div className={`tkw ${v.bd.c2.w}`} data-card="c2"><div className="tkw-in">
<div className={`tk ${v.bd.c2.c}`}><div className="tk-b"><button type="button" className="tk-ck" tabIndex={v.bd.c2.ti} aria-pressed={v.bd.c2.p} onClick={v.bd.c2.t} aria-label="Mark done: Reprint the faded welcome sign"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></button><span className="tk-t">Reprint the faded welcome sign</span>
<div className="tk-row"><span className="dc late"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17" /></svg>3 days late</span><span className="av" style={{background: 'var(--tone-amber-bg)', color: 'var(--tone-amber-fg)'}}>NK</span></div>
<div className="tk-row"><span className="pj"><i style={{background: 'var(--lv3-c-7c3aed)'}} />Mara &amp; Finn</span></div></div></div>
</div></div>
<div className={`tkw ${v.bd.c3.w}`} data-card="c3"><div className="tkw-in">
<div className={`tk ${v.bd.c3.c}`}><div className="tk-b"><button type="button" className="tk-ck" tabIndex={v.bd.c3.ti} aria-pressed={v.bd.c3.p} onClick={v.bd.c3.t} aria-label="Mark done: Hire extra glassware for the launch evening"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></button><span className="tk-t">Hire extra glassware for the launch evening</span>
<div className="tk-row"><span className="dc late"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17" /></svg>2 days late</span><span className="av" style={{background: 'var(--tone-amber-bg)', color: 'var(--tone-amber-fg)'}}>NK</span></div>
<div className="tk-row"><span className="pj"><i style={{background: 'var(--lv3-c-16a34a)'}} />Winter launch</span></div></div></div>
</div></div>
</div>
<div className="col">
<div className="col-h"><div className="col-t"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none" /></svg><b>In progress</b><span className="n">{v.bd.n1}</span></div>
</div>
<div className={`tkw ${v.bd.c4.w}`} data-card="c4"><div className="tkw-in">
<div className={`tk ${v.bd.c4.c}`}><div className="tk-b"><button type="button" className="tk-ck" tabIndex={v.bd.c4.ti} aria-pressed={v.bd.c4.p} onClick={v.bd.c4.t} aria-label="Mark done: Order tonic and the good olives"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></button><span className="tk-t">Order tonic and the good olives</span>
<div className="tk-row"><span className="dc late"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17" /></svg>2 days late</span><span className="av" style={{background: 'var(--tone-green-bg)', color: 'var(--tone-green-fg)'}}>DQ</span></div>
<div className="tk-row"><span className="pj"><i style={{background: 'var(--lv3-c-7c3aed)'}} />Mara &amp; Finn</span></div></div></div>
</div></div>
<div className={`tkw ${v.bd.c5.w}`} data-card="c5"><div className="tkw-in">
<div className={`tk ${v.bd.c5.c}`}><div className="tk-b"><button type="button" className="tk-ck" tabIndex={v.bd.c5.ti} aria-pressed={v.bd.c5.p} onClick={v.bd.c5.t} aria-label="Mark done: Menu tasting at The Orchard"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></button><span className="tk-t">Menu tasting at The Orchard</span>
<span className="att"><span className="att-i"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z" /><path d="M14 3v5h5" /></svg></span><span className="att-n">Tasting menu, draft 2</span><span className="att-k">PDF</span></span>
<div className="tk-row"><span className="dc today"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17" /></svg>Today</span><span className="pj"><i style={{background: 'var(--lv3-c-7c3aed)'}} />Mara &amp; Finn</span></div></div>
<div className="prog"><span className="dots5"><i className="on" /><i className="on" /><i /><i /><i /></span>2/5<span className="avs"><span className="av" style={{background: 'var(--tone-green-bg)', color: 'var(--tone-green-fg)'}}>DQ</span><span className="av" style={{background: 'var(--tone-teal-bg)', color: 'var(--tone-teal-fg)'}}>AW</span><span className="av more">+2</span></span></div></div>
</div></div>
<div className={`tkw ${v.bd.c6.w}`} data-card="c6"><div className="tkw-in">
<div className={`tk ${v.bd.c6.c}`}><div className="tk-b"><button type="button" className="tk-ck" tabIndex={v.bd.c6.ti} aria-pressed={v.bd.c6.p} onClick={v.bd.c6.t} aria-label="Mark done: Build the Saturday run-sheet"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></button><span className="tk-t">Build the Saturday run-sheet</span>
<span className="att"><span className="att-i"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z" /><path d="M14 3v5h5" /></svg></span><span className="att-n">Run-sheet v2</span><span className="att-k">DOC</span></span>
<div className="tk-row"><span className="dc"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17" /></svg>Tue</span><span className="pj"><i style={{background: 'var(--lv3-c-7c3aed)'}} />Mara &amp; Finn</span></div></div>
<div className="prog"><span className="dots5"><i className="on" /><i className="on" /><i className="on" /><i /><i /></span>3/8<span className="avs"><span className="av" style={{background: 'var(--tone-teal-bg)', color: 'var(--tone-teal-fg)'}}>AW</span></span></div></div>
</div></div>
</div>
<div className="col">
<div className="col-h"><div className="col-t"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg><b>Waiting</b><span className="n">{v.bd.n2}</span></div>
</div>
<div className={`tkw ${v.bd.c7.w}`} data-card="c7"><div className="tkw-in">
<div className={`tk ${v.bd.c7.c}`}><div className="tk-b"><button type="button" className="tk-ck" tabIndex={v.bd.c7.ti} aria-pressed={v.bd.c7.p} onClick={v.bd.c7.t} aria-label="Mark done: Approve the seating plan"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></button><span className="tk-t">Approve the seating plan</span>
<span className="att"><span className="att-i"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z" /><path d="M14 3v5h5" /></svg></span><span className="att-n">Seating plan v4</span><span className="att-k">PDF</span></span>
<span className="wait"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>Waiting on <b>Mara</b></span>
<div className="tk-row"><span className="dc"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17" /></svg>Tomorrow</span><span className="av" style={{background: 'var(--tone-teal-bg)', color: 'var(--tone-teal-fg)'}}>AW</span></div>
<div className="tk-row"><span className="pj"><i style={{background: 'var(--lv3-c-7c3aed)'}} />Mara &amp; Finn</span></div></div></div>
</div></div>
<div className={`tkw ${v.bd.c8.w}`} data-card="c8"><div className="tkw-in">
<div className={`tk ${v.bd.c8.c}`}><div className="tk-b"><button type="button" className="tk-ck" tabIndex={v.bd.c8.ti} aria-pressed={v.bd.c8.p} onClick={v.bd.c8.t} aria-label="Mark done: Chase florist deposit"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></button><span className="tk-t">Chase florist deposit</span>
<span className="wait"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>Waiting on <b>Fern and Furrow</b><span className="dc amber">7 days</span></span>
<div className="tk-row"><span className="dc">Mon</span><span className="pj"><i style={{background: 'var(--lv3-c-7c3aed)'}} />Mara &amp; Finn</span><span className="av" style={{background: 'var(--tone-teal-bg)', color: 'var(--tone-teal-fg)'}}>AW</span></div></div></div>
</div></div>
<div className={`tkw ${v.bd.c9.w}`} data-card="c9"><div className="tkw-in">
<div className={`tk ${v.bd.c9.c}`}><div className="tk-b"><button type="button" className="tk-ck" tabIndex={v.bd.c9.ti} aria-pressed={v.bd.c9.p} onClick={v.bd.c9.t} aria-label="Mark done: Confirm the band's arrival time with The Lindens"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></button><span className="tk-t">Confirm the band’s arrival time with The Lindens</span>
<span className="wait"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>Waiting on <b>The Lindens</b></span>
<div className="tk-row"><span className="dc">Tue</span><span className="pj"><i style={{background: 'var(--lv3-c-7c3aed)'}} />Mara &amp; Finn</span><span className="av" style={{background: 'var(--tone-amber-bg)', color: 'var(--tone-amber-fg)'}}>NK</span></div></div></div>
</div></div>
</div>
<div className="col">
<div className="col-h"><div className="col-t"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2"><circle cx="12" cy="12" r="9" stroke="var(--accent)" /><path d="M12 3a9 9 0 0 1 9 9h-9z" fill="var(--accent)" /></svg><b>To check</b><span className="n">{v.bd.n3}</span></div>
</div>
<div className={`tkw ${v.bd.c10.w}`} data-card="c10"><div className="tkw-in">
<div className={`tk ${v.bd.c10.c}`}><div className="tk-b"><button type="button" className="tk-ck" tabIndex={v.bd.c10.ti} aria-pressed={v.bd.c10.p} onClick={v.bd.c10.t} aria-label="Mark done: Sign off the winter menu"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></button><span className="tk-t">Sign off the winter menu</span>
<div className="tk-row"><span className="dc late"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17" /></svg>7 days late</span><span className="av" style={{background: 'var(--tone-green-bg)', color: 'var(--tone-green-fg)'}}>DQ</span></div>
<div className="tk-row"><span className="pj"><i style={{background: 'var(--lv3-c-16a34a)'}} />Winter launch</span></div></div></div>
</div></div>
<div className={`tkw ${v.bd.c11.w}`} data-card="c11"><div className="tkw-in">
<div className={`tk ${v.bd.c11.c}`}><div className="tk-b"><button type="button" className="tk-ck" tabIndex={v.bd.c11.ti} aria-pressed={v.bd.c11.p} onClick={v.bd.c11.t} aria-label="Mark done: Approve the brochure copy"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></button><span className="tk-t">Approve the brochure copy</span>
<span className="att"><span className="att-i"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z" /><path d="M14 3v5h5" /></svg></span><span className="att-n">Winter brochure v2</span><span className="att-k">PDF</span></span>
<div className="tk-row"><span className="dc late"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17" /></svg>1 day late</span><span className="av" style={{background: 'var(--tone-plum-bg)', color: 'var(--tone-plum-fg)'}}>OB</span></div>
<div className="tk-row"><span className="pj"><i style={{background: 'var(--lv3-c-16a34a)'}} />Winter launch</span></div></div></div>
</div></div>
<div className={`tkw ${v.bd.c12.w}`} data-card="c12"><div className="tkw-in">
<div className={`tk ${v.bd.c12.c}`}><div className="tk-b"><button type="button" className="tk-ck" tabIndex={v.bd.c12.ti} aria-pressed={v.bd.c12.p} onClick={v.bd.c12.t} aria-label="Mark done: Lay out the long table for twenty"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></button><span className="tk-t">Lay out the long table for twenty</span>
<div className="tk-row"><span className="dc">Mon</span><span className="pj"><i style={{background: 'var(--lv3-c-7c3aed)'}} />Mara &amp; Finn</span><span className="avs"><span className="av" style={{background: 'var(--tone-amber-bg)', color: 'var(--tone-amber-fg)'}}>NK</span><span className="av" style={{background: 'var(--tone-teal-bg)', color: 'var(--tone-teal-fg)'}}>AW</span></span></div></div></div>
</div></div>
</div>
</div>
</div>
</div>
<div className={`win-toast ${v.bd.toastCls}`} onMouseEnter={v.bd.hold} onMouseLeave={v.bd.release} onFocus={v.bd.hold} onBlur={v.bd.release}><span className="wt-ck" aria-hidden="true"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></span><span className="wt-t">{v.bd.toastText}</span><button type="button" className="wt-u" onClick={v.bd.undo} tabIndex={v.bd.undoTab}>Undo</button></div>
<p className="sr" role="status">{v.bd.say}</p>
</div>
<p className="win-cap rise d4">A working sample. Tick any card. Nothing here is saved or sent.</p>
</div>
</section>
<section className="sec vn-sec" id="venues" aria-labelledby="venue-title" data-reveal="venues">
<div className="wrap">
<div className="band">
<div className="band-copy">
<h2 className="h2" id="venue-title">Gift every couple their own plan.</h2>
<p>Every couple who books their wedding with you gets a private place to plan it. Your name is on it, quietly. There is nothing for your team to run.</p>
<dl className="band-facts">
<div><dt>What it costs them</dt><dd>Nothing. It is a gift from you.</dd></div>
<div><dt>What you see</dt><dd>That they opened it. Not what is in it.</dd></div>
<div><dt>After the wedding</dt><dd>It stays open, read-only, and they can download everything in one click.</dd></div>
<div><dt>The Founding 25</dt><dd>Twenty-five venues in Limerick and the surrounding counties, from January 2027.</dd></div>
</dl>
<div className="ctas band-cta"><a href="mailto:hello@signalstudio.ie?subject=Founding%2025%20venue" className="btn btn-w">Ask me a question</a><span className="band-cta-s">It goes to me, not a form.<br />hello@signalstudio.ie</span></div>
</div>
<figure className="phone band-phone" role="img" aria-label="A couple's phone. One quiet line at the top says the plan is from The Orchard.">
<div className="phone-in vp" aria-hidden="true">
<div className="phone-notch" />
<p className={`vp-from ${v.vpCls}`}>From The Orchard</p>
<p className="vp-hi">Mara and Finn</p>
<p className="vp-lede">Your plan, your dates, your guests.</p>
<div className="vp-card"><small>Your wedding day</small><b>Saturday 2 October</b><span>8 days to go · 2pm</span></div>
<ul className="vp-rows">
<li><span>Today</span><b>Menu tasting</b></li>
<li><span>Guests</span><b>96 of 118 replied</b></li>
<li><span>Your jobs</span><b>4 open</b></li>
</ul>
</div>
</figure>
</div>
</div>
</section>
<section className="sec tl-sec" id="timeline" aria-labelledby="tl-title" data-reveal="timeline">
<div className="wrap">
<div className="sec-head">
<h2 className="h2" id="tl-title">The dates, for everyone who needs them.</h2>
<p className="sub">Set the dates once. Signal Studio turns them into a private, invite-only page the couple, their family and your suppliers can follow. When a date moves, everyone on the page gets one short email.</p>
</div>
<div className="tl-stage" data-product="">
<figure className="lap" role="img" aria-label="Mara and Finn's shared wedding timeline on a laptop: 8 days until the wedding on Saturday 2 October 2027, 3 of 8 dates done, the menu tasting is today.">
<div aria-hidden="true">
<div className="lap-bar"><span className="lap-dots"><i /><i /><i /></span><span className="lap-url"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>signalstudio.ie/t/k7Qm2v</span></div>
<div className="t3">
<div className="t3-head"><span className="t3-word">timeline<i>.</i></span><span className="t3-share"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12" /><path d="M7.5 7.5L12 3l4.5 4.5" /><path d="M8 11H6a1.5 1.5 0 0 0-1.5 1.5v7A1.5 1.5 0 0 0 6 21h12a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 18 11h-2" /></svg>Share this timeline</span></div>
<div className="t3-top">
<div><p className="t3-eye">A shared wedding timeline</p><h3 className="t3-name">Mara &amp; Finn</h3>
<p className="t3-count"><b className={`tl-n ${v.tlCls}`}>{v.tlN}</b><span>days until<br />the wedding day</span></p></div>
<div className="t3-panel"><p className="t3-eye">The wedding day</p><p className="t3-date">Saturday 2 October 2027</p><p className="t3-place">2pm · The Orchard · Adare</p>
<p className="t3-prog">3 of 8 dates done</p><span className="t3-bar"><i /></span>
<span className="t3-cal"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 10h17" /><path d="M8 3v4" /><path d="M16 3v4" /></svg>Add to my calendar</span></div>
</div>
<div className="t3-rail-wrap"><ol className="t3-rail"><span className="t3-line" /><span className="t3-line-done" />
<li style={{'--i': '0'}}><span className="t3-flag" /><span className="t3-dot"><span className="t3-done"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></span></span><span className="t3-t">We said yes</span><span className="t3-d">2 Jan</span><span className="t3-m">JAN</span></li>
<li style={{'--i': '1'}}><span className="t3-flag" /><span className="t3-dot"><span className="t3-done"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></span></span><span className="t3-t">The Orchard booked</span><span className="t3-d">18 Apr</span><span className="t3-m">APR</span></li>
<li style={{'--i': '2'}}><span className="t3-flag" /><span className="t3-dot"><span className="t3-done"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></span></span><span className="t3-t">Invitations sent</span><span className="t3-d">8 Aug</span><span className="t3-m">AUG</span></li>
<li style={{'--i': '3'}}><span className="t3-flag acc">Today</span><span className="t3-dot"><span className="t3-next"><i /></span></span><span className="t3-t acc">Menu tasting</span><span className="t3-d">24 Sep</span><span className="t3-m">SEP</span></li>
<li style={{'--i': '4'}}><span className="t3-flag" /><span className="t3-dot"><span className="t3-todo" /></span><span className="t3-t">Final dress fitting</span><span className="t3-d">25 Sep</span><span className="t3-m" /></li>
<li style={{'--i': '5'}}><span className="t3-flag">Your job</span><span className="t3-dot"><span className="t3-todo you" /></span><span className="t3-t strong">RSVP deadline</span><span className="t3-d">27 Sep</span><span className="t3-m" /></li>
<li style={{'--i': '6'}}><span className="t3-flag" /><span className="t3-dot"><span className="t3-todo" /></span><span className="t3-t">Venue walkthrough</span><span className="t3-d">30 Sep</span><span className="t3-m" /></li>
<li style={{'--i': '7'}}><span className="t3-flag" /><span className="t3-dot"><span className="t3-final"><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 21V3.5" /><path d="M5 4h13l-3 4.5 3 4.5H5z" /></svg></span></span><span className="t3-t strong">Wedding day</span><span className="t3-d">2 Oct</span><span className="t3-m">OCT</span></li>
</ol></div>
</div>
</div>
</figure>
<figure className="phone tl-phone" role="img" aria-label="The same page on a guest's phone, showing only their own job: reply by Monday 27 September.">
<div className="phone-in" aria-hidden="true">
<div className="phone-notch" />
<div className="pt-head"><span className="t3-word">timeline<i>.</i></span><span className="pt-share"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12" /><path d="M7.5 7.5L12 3l4.5 4.5" /><path d="M8 11H6a1.5 1.5 0 0 0-1.5 1.5v7A1.5 1.5 0 0 0 6 21h12a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 18 11h-2" /></svg></span></div>
<p className="t3-eye">A shared wedding timeline</p>
<p className="pt-name">Mara &amp; Finn</p>
<p className="pt-count"><b className={`tl-n ${v.tlCls}`}>{v.tlN}</b><span>days until<br />the wedding day</span></p>
<div className="pt-today"><span className="pt-ring"><i /></span><span><small>Your job</small><b>Reply by Monday 27 September</b></span></div>
<ul className="pt-rows">
<li><span className="pt-n">3<small>days</small></span><span><b>RSVP deadline</b><em>You</em></span></li>
<li><span className="pt-n">6<small>days</small></span><span><b className="reg">Venue walkthrough</b></span></li>
<li><span className="pt-n">8<small>days</small></span><span><b>Wedding day</b></span></li>
</ul>
<span className="pt-cal">Add to my calendar</span>
<p className="pt-foot">From <b>The Orchard</b></p>
</div>
</figure>
</div>
<figure className="season" aria-labelledby="season-cap" data-reveal="season">
<figcaption className="season-head"><p className="season-t" id="season-cap">Five of the eight dates land in the last nine days.</p><p className="season-s">Mara and Finn’s year at true scale. That is why their page counts down, and shows each person only what is theirs to do.</p></figcaption>
<div className="season-plot" aria-hidden="true"><div className="ss-early"><span className="ss-lab" style={{left: '0.36%'}}><b>We said yes</b>2 Jan</span><span className="ss-lab" style={{left: '38.08%'}}><b>The Orchard booked</b>18 Apr</span><span className="ss-lab" style={{left: '77.94%'}}><b>Invitations sent</b>8 Aug</span></div><div className="ss-axis"><span className="ss-line" /><span className="ss-fill" style={{width: '94.66%'}} /><span className="ss-crunch" style={{left: '94.16%', width: '3.85%'}} /><span className="ss-m" style={{left: '0.0%'}}>Jan</span><span className="ss-m" style={{left: '11.03%'}}>Feb</span><span className="ss-m" style={{left: '21.0%'}}>Mar</span><span className="ss-m" style={{left: '32.03%'}}>Apr</span><span className="ss-m" style={{left: '42.7%'}}>May</span><span className="ss-m" style={{left: '53.74%'}}>Jun</span><span className="ss-m" style={{left: '64.41%'}}>Jul</span><span className="ss-m" style={{left: '75.44%'}}>Aug</span><span className="ss-m" style={{left: '86.48%'}}>Sep</span><span className="ss-m" style={{left: '97.15%'}}>Oct</span><span className="ss-dot done" style={{left: '0.36%', '--i': '0'}} title="We said yes, 2 Jan" /><span className="ss-dot done" style={{left: '38.08%', '--i': '1'}} title="The Orchard booked, 18 Apr" /><span className="ss-dot done" style={{left: '77.94%', '--i': '2'}} title="Invitations sent, 8 Aug" /><span className="ss-dot today" style={{left: '94.66%', '--i': '3'}} title="Menu tasting, 24 Sep" /><span className="ss-dot todo" style={{left: '95.02%', '--i': '4'}} title="Final dress fitting, 25 Sep" /><span className="ss-dot todo" style={{left: '95.73%', '--i': '5'}} title="RSVP deadline, 27 Sep" /><span className="ss-dot todo" style={{left: '96.8%', '--i': '6'}} title="Venue walkthrough, 30 Sep" /><span className="ss-dot final" style={{left: '97.51%', '--i': '7'}} title="Wedding day, 2 Oct" /></div></div>
<div className="ss-zoom" aria-hidden="true"><div className="ss-trap" style={{clipPath: 'polygon(94.16% 0, 98.01% 0, 100% 100%, max(0%, calc(100% - 640px)) 100%)'}} /><div className="ss-zbox"><span className="ss-zline" /><span className="ss-zday" style={{left: 'calc(24px + 0.0000 * (100% - 48px))'}}>24</span><span className="ss-zday" style={{left: 'calc(24px + 0.1250 * (100% - 48px))'}}>25</span><span className="ss-zday" style={{left: 'calc(24px + 0.2500 * (100% - 48px))'}}>26</span><span className="ss-zday" style={{left: 'calc(24px + 0.3750 * (100% - 48px))'}}>27</span><span className="ss-zday" style={{left: 'calc(24px + 0.5000 * (100% - 48px))'}}>28</span><span className="ss-zday" style={{left: 'calc(24px + 0.6250 * (100% - 48px))'}}>29</span><span className="ss-zday" style={{left: 'calc(24px + 0.7500 * (100% - 48px))'}}>30</span><span className="ss-zday" style={{left: 'calc(24px + 0.8750 * (100% - 48px))'}}>1</span><span className="ss-zday" style={{left: 'calc(24px + 1.0000 * (100% - 48px))'}}>2</span><span className="ss-ztick today" style={{left: 'calc(24px + 0.0000 * (100% - 48px))'}} /><span className="ss-ztick todo" style={{left: 'calc(24px + 0.1250 * (100% - 48px))'}} /><span className="ss-ztick todo" style={{left: 'calc(24px + 0.3750 * (100% - 48px))'}} /><span className="ss-ztick todo" style={{left: 'calc(24px + 0.7500 * (100% - 48px))'}} /><span className="ss-ztick final" style={{left: 'calc(24px + 1.0000 * (100% - 48px))'}} /><span className="ss-zlab today first" style={{left: 'calc(24px + 0.0000 * (100% - 48px))'}}>Menu tasting</span><span className="ss-zlab todo row2" style={{left: 'calc(24px + 0.1250 * (100% - 48px))'}}>Final dress fitting</span><span className="ss-zlab todo" style={{left: 'calc(24px + 0.3750 * (100% - 48px))'}}>RSVP deadline</span><span className="ss-zlab todo row2" style={{left: 'calc(24px + 0.7500 * (100% - 48px))'}}>Venue walkthrough</span><span className="ss-zlab final" style={{left: 'calc(24px + 1.0000 * (100% - 48px))'}}>Wedding day</span><span className="ss-zcap">24 Sep to 2 Oct</span></div></div>
<ul className="sr"><li>We said yes: 2 January 2027</li><li>The Orchard booked: 18 April 2027</li><li>Invitations sent: 8 August 2027</li><li>Menu tasting: 24 September 2027</li><li>Final dress fitting: 25 September 2027</li><li>RSVP deadline: 27 September 2027</li><li>Venue walkthrough: 30 September 2027</li><li>Wedding day: 2 October 2027</li></ul>
</figure>
</div>
</section>
<section className="sec an-sec field" id="analytics" aria-labelledby="an-title" data-reveal="analytics">
<div className="wrap an-split">
<div className="copy">
<h2 className="h2" id="an-title">Will you make the date?</h2>
<p className="sub">Signal Studio compares the work done with the time gone, for every project with a date. You get the answer first, then the detail.</p>
<figure className="an-rule" aria-labelledby="an-rule-c">
<div className="an-rule-bar" aria-hidden="true"><i className="done" /><span className="gap" /><b className="tick" /><span className="lab l-done">Work done 50%</span><span className="lab l-time">Time gone 65%</span><span className="lab l-gap">15 points short</span></div>
<figcaption id="an-rule-c"><b>Behind</b> means the work is 10 or more points short of the time gone. <b>Close</b> means it is less than 10 short.</figcaption>
</figure>
</div>
<div className={`frame an-card ${v.an.cardCls}`} data-product="" role="group" aria-label="A working sample of the Analytics report">
<div className="an-top"><span className="an-title">Analytics</span><span className="an-range">Last 30 days</span></div>
<div className="an-scope" role="group" aria-label="Show projects"><span className="an-try" aria-hidden="true">Try a filter</span>
{(v.an.scopes).map((s: any, idx: number) => (<React.Fragment key={idx}>
<button type="button" className="an-q" aria-pressed={s.pressed} onClick={s.pick}>{s.label}<small>{s.n}</small></button>
</React.Fragment>))}
</div>
<p className="an-ans" aria-live="polite"><b>{v.an.lead}</b> {v.an.rest}</p>
<p className="an-stat"><span><b>{v.an.onTime}%</b> on time</span><span><b className="bad">{v.an.late}</b> late now, {v.an.lateSub}</span></p>
<div className="an-list-h"><b>{v.an.listTitle}</b><span>slowest first</span></div>
<ul className="an-rows">
<li className={`an-row ${v.an.p.winter.cls}`} style={{order: v.an.p.winter.o}} data-row="winter"><div className="an-row-in">
<span className="an-name"><i style={{background: 'var(--lv3-c-4f46e5)'}} />Winter launch</span>
<span className="an-track is-behind" style={{'--w': '0.5', '--t': '65%'}} aria-hidden="true"><i /><b><s /></b></span>
<span className="an-meta"><span className="late">4 late</span> · 11 open<span className="sr">, 50% done and 65% of the time gone</span></span>
<span className="an-pace behind">Behind</span>
</div></li>
<li className={`an-row ${v.an.p.mf.cls}`} style={{order: v.an.p.mf.o}} data-row="mf"><div className="an-row-in">
<span className="an-name"><i style={{background: 'var(--lv3-c-2563eb)'}} />Mara and Finn’s wedding</span>
<span className="an-track is-behind" style={{'--w': '0.85', '--t': '97%'}} aria-hidden="true"><i /><b><s /></b></span>
<span className="an-meta"><span className="late">3 late</span> · 12 open<span className="sr">, 85% done and 97% of the time gone</span></span>
<span className="an-pace behind">Behind</span>
</div></li>
<li className={`an-row ${v.an.p.roof.cls}`} style={{order: v.an.p.roof.o}} data-row="roof"><div className="an-row-in">
<span className="an-name"><i style={{background: 'var(--lv3-c-0f766e)'}} />Barn roof</span>
<span className="an-track " style={{'--w': '0.71', '--t': '77%'}} aria-hidden="true"><i /><b><s /></b></span>
<span className="an-meta"><span className="late">1 late</span> · 4 open<span className="sr">, 71% done and 77% of the time gone</span></span>
<span className="an-pace close">Close</span>
</div></li>
<li className={`an-row ${v.an.p.xmas.cls}`} style={{order: v.an.p.xmas.o}} data-row="xmas"><div className="an-row-in">
<span className="an-name"><i style={{background: 'var(--lv3-c-b45309)'}} />Christmas markets</span>
<span className="an-track " style={{'--w': '0.32', '--t': '30%'}} aria-hidden="true"><i /><b><s /></b></span>
<span className="an-meta">13 open<span className="sr">, 32% done and 30% of the time gone</span></span>
<span className="an-pace plain">On pace</span>
</div></li>
<li className={`an-row ${v.an.p.spring.cls}`} style={{order: v.an.p.spring.o}} data-row="spring"><div className="an-row-in">
<span className="an-name"><i style={{background: 'var(--lv3-c-0e7490)'}} />Spring open day</span>
<span className="an-track " style={{'--w': '0.11', '--t': '5%'}} aria-hidden="true"><i /><b><s /></b></span>
<span className="an-meta">8 open<span className="sr">, 11% done and 5% of the time gone</span></span>
<span className="an-pace plain">On pace</span>
</div></li>
<li className={`an-row ${v.an.p.web.cls}`} style={{order: v.an.p.web.o}} data-row="web"><div className="an-row-in">
<span className="an-name"><i style={{background: 'var(--lv3-c-c2410c)'}} />Website refresh</span>
<span className="an-track " style={{'--w': '0.38', '--t': '27%'}} aria-hidden="true"><i /><b><s /></b></span>
<span className="an-meta">10 open<span className="sr">, 38% done and 27% of the time gone</span></span>
<span className="an-pace plain">On pace</span>
</div></li>
<li className={`an-row ${v.an.p.rhythm.cls}`} style={{order: v.an.p.rhythm.o}} data-row="rhythm"><div className="an-row-in">
<span className="an-name"><i style={{background: 'var(--lv3-c-15803d)'}} />Monthly business rhythm</span>
<span className="an-track no-tick" style={{'--w': '0.67', '--t': '0%'}} aria-hidden="true"><i /><b><s /></b></span>
<span className="an-meta"><span className="late">1 late</span> · 4 open</span>
<span className="an-pace plain nodate">No date</span>
</div></li>
<li className={`an-row ${v.an.p.personal.cls}`} style={{order: v.an.p.personal.o}} data-row="personal"><div className="an-row-in">
<span className="an-name"><i style={{background: 'var(--lv3-c-be185d)'}} />Personal</span>
<span className="an-track no-tick" style={{'--w': '0.6', '--t': '0%'}} aria-hidden="true"><i /><b><s /></b></span>
<span className="an-meta">4 open</span>
<span className="an-pace plain nodate">No date</span>
</div></li>
</ul>
<p className="an-foot">{v.an.foot}</p>
</div>
</div>
</section>
<section className="sec fl-sec" id="files" aria-labelledby="files-title" data-reveal="files">
<div className="wrap fl-head">
<div>
<h2 className="h2" id="files-title">Every file, where it lives.</h2>
</div>
<div className="fl-side">
<p className="sub">Uploads, Google Drive and links on one shelf. Find any file by its name, its task or the person who added it.</p>
</div>
</div>
<div className="fl-bleed">
<div className={`frame fsx ${v.fs.frameCls}`} data-product="" role="group" aria-label="A working sample of the Files page">
<div className="files_shelf_page"><div className="files_shelf_inner"><div className="fx-tools"><label className="files_shelf_field"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="7" cy="7" r="4.5" /><path d="m10.5 10.5 3 3" /></svg><input className="files_shelf_input" placeholder="Find a file, task or person" aria-label="Search the sample files by file, task or person" autoComplete="off" spellCheck="false" enterKeyHint="search" type="search" value={v.fs.q} onChange={v.fs.onFind} />{(v.fs.hasQ) ? (<><button type="button" className="fx-clear" onClick={v.fs.clear} aria-label="Clear the search"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg></button></>) : null}</label><p className="fx-try">Try <button type="button" className="fl-sug" onClick={v.fs.tryMara}>Aoife</button><button type="button" className="fl-sug" onClick={v.fs.tryMenu}>menu</button><button type="button" className="fl-sug" onClick={v.fs.tryDrive}>Google Drive</button></p><p className="fx-sum" aria-live="polite">{v.fs.sum}</p></div><div className="files_shelf_split"><div className="files_shelf_main"><ul className="files_shelf_sources" aria-label="Filter by where files live"><li className="files_shelf_sourceItem" style={{'--i': '0'}}><button type="button" className="files_shelf_source" data-source-folder="signal" aria-pressed={v.fs.sp.signal} onClick={v.fs.pick.signal}><span className="files_shelf_folder" data-size="large" aria-hidden="true"><svg viewBox="0 0 200 150" focusable="false"><path className="files_shelf_folderBack" d="M0 20a12 12 0 0 1 12-12h44c5 0 8 1.5 11 4.5l5 5c3 3 6 4.5 11 4.5h105a12 12 0 0 1 12 12v102a14 14 0 0 1-14 14H14a14 14 0 0 1-14-14Z" /><g className="files_shelf_paper files_shelf_paper2"><rect x="30" y="22" width="140" height="100" rx="5" /><path d="M44 34h54M44 45h96M44 56h78" /></g><g className="files_shelf_paper files_shelf_paper1"><rect x="22" y="29" width="156" height="100" rx="5" /><path d="M36 41h54M36 52h96M36 63h78" /></g><path className="files_shelf_folderLip" d="M10 57h180" /><path className="files_shelf_folderFront" d="M0 68a10 10 0 0 1 10-10h180a10 10 0 0 1 10 10v68a14 14 0 0 1-14 14H14a14 14 0 0 1-14-14Z" /></svg><span className="files_shelf_folderLabel"><span className="files_shelf_folderMark"><svg className="files_shelf_markSignal" width="22" height="22" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><circle cx="10" cy="10" r="7.25" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="10" cy="10" r="3.25" fill="currentColor" /></svg></span><span className="files_shelf_folderCount">6</span></span></span><span className="files_shelf_sourceText"><span className="files_shelf_sourceName">Uploaded</span><span className="files_shelf_sourceBlurb">Files uploaded.</span><span className="files_shelf_sourceFact">On 6 tasks · 4.2 MB</span></span></button></li><li className="files_shelf_sourceItem" style={{'--i': '1'}}><button type="button" className="files_shelf_source" data-source-folder="drive" aria-pressed={v.fs.sp.drive} onClick={v.fs.pick.drive}><span className="files_shelf_folder" data-size="large" aria-hidden="true"><svg viewBox="0 0 200 150" focusable="false"><path className="files_shelf_folderBack" d="M0 20a12 12 0 0 1 12-12h44c5 0 8 1.5 11 4.5l5 5c3 3 6 4.5 11 4.5h105a12 12 0 0 1 12 12v102a14 14 0 0 1-14 14H14a14 14 0 0 1-14-14Z" /><g className="files_shelf_paper files_shelf_paper2"><rect x="30" y="22" width="140" height="100" rx="5" /><path d="M44 34h54M44 45h96M44 56h78" /></g><g className="files_shelf_paper files_shelf_paper1"><rect x="22" y="29" width="156" height="100" rx="5" /><path d="M36 41h54M36 52h96M36 63h78" /></g><path className="files_shelf_folderLip" d="M10 57h180" /><path className="files_shelf_folderFront" d="M0 68a10 10 0 0 1 10-10h180a10 10 0 0 1 10 10v68a14 14 0 0 1-14 14H14a14 14 0 0 1-14-14Z" /></svg><span className="files_shelf_folderLabel"><span className="files_shelf_folderMark"><svg className="files_shelf_markDrive" width="22" height="20" viewBox="0 0 87.3 78" aria-hidden="true" focusable="false"><path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="var(--lv3-c-0066da)" /><path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="var(--lv3-c-00ac47)" /><path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="var(--lv3-c-ea4335)" /><path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="var(--lv3-c-00832d)" /><path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="var(--lv3-c-2684fc)" /><path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="var(--lv3-c-ffba00)" /></svg></span><span className="files_shelf_folderCount">4</span></span></span><span className="files_shelf_sourceText"><span className="files_shelf_sourceName">Google Drive</span><span className="files_shelf_sourceBlurb">In Google Drive. Opens in Drive.</span><span className="files_shelf_sourceFact">On 4 tasks</span></span></button></li><li className="files_shelf_sourceItem" style={{'--i': '2'}}><button type="button" className="files_shelf_source" data-source-folder="links" aria-pressed={v.fs.sp.links} onClick={v.fs.pick.links}><span className="files_shelf_folder" data-size="large" aria-hidden="true"><svg viewBox="0 0 200 150" focusable="false"><path className="files_shelf_folderBack" d="M0 20a12 12 0 0 1 12-12h44c5 0 8 1.5 11 4.5l5 5c3 3 6 4.5 11 4.5h105a12 12 0 0 1 12 12v102a14 14 0 0 1-14 14H14a14 14 0 0 1-14-14Z" /><g className="files_shelf_paper files_shelf_paper2"><rect x="30" y="22" width="140" height="100" rx="5" /><path d="M44 34h54M44 45h96M44 56h78" /></g><g className="files_shelf_paper files_shelf_paper1"><rect x="22" y="29" width="156" height="100" rx="5" /><path d="M36 41h54M36 52h96M36 63h78" /></g><path className="files_shelf_folderLip" d="M10 57h180" /><path className="files_shelf_folderFront" d="M0 68a10 10 0 0 1 10-10h180a10 10 0 0 1 10 10v68a14 14 0 0 1-14 14H14a14 14 0 0 1-14-14Z" /></svg><span className="files_shelf_folderLabel"><span className="files_shelf_folderMark"><svg className="files_shelf_markLink" width="22" height="22" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M6.75 9.25a2.75 2.75 0 0 0 3.9 0l1.9-1.9a2.75 2.75 0 0 0-3.9-3.9l-.6.6" /><path d="M9.25 6.75a2.75 2.75 0 0 0-3.9 0l-1.9 1.9a2.75 2.75 0 0 0 3.9 3.9l.6-.6" /></svg></span><span className="files_shelf_folderCount">2</span></span></span><span className="files_shelf_sourceText"><span className="files_shelf_sourceName">Links</span><span className="files_shelf_sourceBlurb">Web pages and tools saved to tasks.</span><span className="files_shelf_sourceFact">On 2 tasks</span></span></button></li></ul><section className="files_shelf_section" aria-labelledby="shelf-latest"><div className="files_shelf_sectionHead"><h3 id="shelf-latest" className="files_shelf_sectionTitle">{v.fs.title}</h3><span className="files_shelf_sectionSub" aria-live="polite">{v.fs.sub}</span><span className="files_shelf_spacer" /><div className="files_shelf_seg" role="group" aria-label="Show files as"><button type="button" aria-pressed={v.fs.vCards} onClick={v.fs.asCards} aria-label="Cards"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="5" height="5" rx="1" /><rect x="9" y="2" width="5" height="5" rx="1" /><rect x="2" y="9" width="5" height="5" rx="1" /><rect x="9" y="9" width="5" height="5" rx="1" /></svg></button><button type="button" aria-pressed={v.fs.vList} onClick={v.fs.asList} aria-label="List"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="M5 4h9M5 8h9M5 12h9M2 4h.01M2 8h.01M2 12h.01" /></svg></button></div></div><ul className={`files_shelf_cards fx-row ${v.fs.rowCls}`} aria-label="Files" tabIndex="0"><li className={`files_shelf_cardItem ${v.fs.c.f0}`} style={{'--i': '0'}} data-file="f0"><div className="files_shelf_card"><span className="files_shelf_cardThumb" aria-hidden="true"><span className="files_shelf_thumb" data-type="document" aria-hidden="true"><svg className="fx-art" viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fontFamily="Geist, sans-serif"><rect width="160" height="120" fill="var(--shelf-paper)" /><text x="12" y="15" fontSize="8" fontWeight="600" fill="var(--v3-text)" textAnchor="start">Seating plan v4</text><text x="148" y="15" fontSize="6.5" fontWeight="400" fill="var(--v3-text-2)" textAnchor="end">118 guests</text><rect x="44" y="23" width="72" height="11" rx="2" fill="none" stroke="var(--fx-h)" strokeWidth="1.2" /><text x="80" y="31" fontSize="6" fontWeight="500" fill="var(--v3-text-2)" textAnchor="middle">Top table</text><circle cx="36" cy="62" r="11" fill="none" stroke="var(--fx-h)" strokeWidth="1.3" /><circle cx="51.5" cy="62.0" r="1.6" fill="var(--fx-h)" /><circle cx="47.0" cy="73.0" r="1.6" fill="var(--fx-h)" /><circle cx="36.0" cy="77.5" r="1.6" fill="var(--fx-h)" /><circle cx="25.0" cy="73.0" r="1.6" fill="var(--fx-h)" /><circle cx="20.5" cy="62.0" r="1.6" fill="var(--fx-h)" /><circle cx="25.0" cy="51.0" r="1.6" fill="var(--fx-h)" /><circle cx="36.0" cy="46.5" r="1.6" fill="var(--fx-h)" /><circle cx="47.0" cy="51.0" r="1.6" fill="var(--fx-h)" /><text x="36" y="64.5" fontSize="7.5" fontWeight="600" fill="var(--v3-text)" textAnchor="middle">1</text><circle cx="80" cy="62" r="11" fill="var(--v3-accent-soft)" stroke="var(--v3-accent)" strokeWidth="1.3" /><circle cx="95.5" cy="62.0" r="1.6" fill="var(--v3-accent)" /><circle cx="91.0" cy="73.0" r="1.6" fill="var(--v3-accent)" /><circle cx="80.0" cy="77.5" r="1.6" fill="var(--v3-accent)" /><circle cx="69.0" cy="73.0" r="1.6" fill="var(--v3-accent)" /><circle cx="64.5" cy="62.0" r="1.6" fill="var(--v3-accent)" /><circle cx="69.0" cy="51.0" r="1.6" fill="var(--v3-accent)" /><circle cx="80.0" cy="46.5" r="1.6" fill="var(--v3-accent)" /><circle cx="91.0" cy="51.0" r="1.6" fill="var(--v3-accent)" /><text x="80" y="64.5" fontSize="7.5" fontWeight="600" fill="var(--v3-accent)" textAnchor="middle">2</text><circle cx="124" cy="62" r="11" fill="none" stroke="var(--fx-h)" strokeWidth="1.3" /><circle cx="139.5" cy="62.0" r="1.6" fill="var(--fx-h)" /><circle cx="135.0" cy="73.0" r="1.6" fill="var(--fx-h)" /><circle cx="124.0" cy="77.5" r="1.6" fill="var(--fx-h)" /><circle cx="113.0" cy="73.0" r="1.6" fill="var(--fx-h)" /><circle cx="108.5" cy="62.0" r="1.6" fill="var(--fx-h)" /><circle cx="113.0" cy="51.0" r="1.6" fill="var(--fx-h)" /><circle cx="124.0" cy="46.5" r="1.6" fill="var(--fx-h)" /><circle cx="135.0" cy="51.0" r="1.6" fill="var(--fx-h)" /><text x="124" y="64.5" fontSize="7.5" fontWeight="600" fill="var(--v3-text)" textAnchor="middle">3</text><circle cx="36" cy="98" r="11" fill="none" stroke="var(--fx-h)" strokeWidth="1.3" /><circle cx="51.5" cy="98.0" r="1.6" fill="var(--fx-h)" /><circle cx="47.0" cy="109.0" r="1.6" fill="var(--fx-h)" /><circle cx="36.0" cy="113.5" r="1.6" fill="var(--fx-h)" /><circle cx="25.0" cy="109.0" r="1.6" fill="var(--fx-h)" /><circle cx="20.5" cy="98.0" r="1.6" fill="var(--fx-h)" /><circle cx="25.0" cy="87.0" r="1.6" fill="var(--fx-h)" /><circle cx="36.0" cy="82.5" r="1.6" fill="var(--fx-h)" /><circle cx="47.0" cy="87.0" r="1.6" fill="var(--fx-h)" /><text x="36" y="100.5" fontSize="7.5" fontWeight="600" fill="var(--v3-text)" textAnchor="middle">4</text><circle cx="80" cy="98" r="11" fill="none" stroke="var(--fx-h)" strokeWidth="1.3" /><circle cx="95.5" cy="98.0" r="1.6" fill="var(--fx-h)" /><circle cx="91.0" cy="109.0" r="1.6" fill="var(--fx-h)" /><circle cx="80.0" cy="113.5" r="1.6" fill="var(--fx-h)" /><circle cx="69.0" cy="109.0" r="1.6" fill="var(--fx-h)" /><circle cx="64.5" cy="98.0" r="1.6" fill="var(--fx-h)" /><circle cx="69.0" cy="87.0" r="1.6" fill="var(--fx-h)" /><circle cx="80.0" cy="82.5" r="1.6" fill="var(--fx-h)" /><circle cx="91.0" cy="87.0" r="1.6" fill="var(--fx-h)" /><text x="80" y="100.5" fontSize="7.5" fontWeight="600" fill="var(--v3-text)" textAnchor="middle">5</text><circle cx="124" cy="98" r="11" fill="none" stroke="var(--fx-h)" strokeWidth="1.3" /><circle cx="139.5" cy="98.0" r="1.6" fill="var(--fx-h)" /><circle cx="135.0" cy="109.0" r="1.6" fill="var(--fx-h)" /><circle cx="124.0" cy="113.5" r="1.6" fill="var(--fx-h)" /><circle cx="113.0" cy="109.0" r="1.6" fill="var(--fx-h)" /><circle cx="108.5" cy="98.0" r="1.6" fill="var(--fx-h)" /><circle cx="113.0" cy="87.0" r="1.6" fill="var(--fx-h)" /><circle cx="124.0" cy="82.5" r="1.6" fill="var(--fx-h)" /><circle cx="135.0" cy="87.0" r="1.6" fill="var(--fx-h)" /><text x="124" y="100.5" fontSize="7.5" fontWeight="600" fill="var(--v3-text)" textAnchor="middle">6</text></svg></span></span><span className="files_shelf_cardName"><span className="files_shelf_name"><span className="files_shelf_nameBase">Seating plan v4</span><span className="files_shelf_nameExt">.pdf</span></span></span><span className="files_shelf_cardMeta"><span className="files_shelf_where"><svg aria-hidden="true" className="files_shelf_markSignal" width="12" height="12" viewBox="0 0 20 20" focusable="false"><circle cx="10" cy="10" r="7.25" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="10" cy="10" r="3.25" fill="currentColor" /></svg>Uploaded</span><span>24 Sep</span></span><span className="files_shelf_cardMeta"><span>Aoife</span><span className="files_shelf_ctx">Approve the seating plan</span></span></div></li><li className={`files_shelf_cardItem ${v.fs.c.f1}`} style={{'--i': '1'}} data-file="f1"><div className="files_shelf_card"><span className="files_shelf_cardThumb" aria-hidden="true"><span className="files_shelf_thumb" data-type="document" aria-hidden="true"><svg className="fx-art" viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fontFamily="Geist, sans-serif"><rect width="160" height="120" fill="var(--shelf-paper)" /><text x="80" y="16" fontSize="6" fontWeight="600" fill="var(--v3-accent)" textAnchor="middle">THE ORCHARD</text><text x="80" y="30" fontSize="11" fontWeight="600" fill="var(--v3-text)" textAnchor="middle">Tasting menu</text><text x="80" y="46" fontSize="7.5" fontWeight="600" fill="var(--v3-text)" textAnchor="middle">Atlantic crab</text><text x="80" y="55" fontSize="6.5" fontWeight="400" fill="var(--v3-text-2)" textAnchor="middle">apple, brown butter</text><text x="80" y="70" fontSize="7.5" fontWeight="600" fill="var(--v3-text)" textAnchor="middle">Lamb, wild garlic</text><text x="80" y="79" fontSize="6.5" fontWeight="400" fill="var(--v3-text-2)" textAnchor="middle">new potatoes</text><text x="80" y="94" fontSize="7.5" fontWeight="600" fill="var(--v3-text)" textAnchor="middle">Brown bread ice cream</text><text x="80" y="103" fontSize="6.5" fontWeight="400" fill="var(--v3-text-2)" textAnchor="middle">honeycomb</text></svg></span></span><span className="files_shelf_cardName"><span className="files_shelf_name"><span className="files_shelf_nameBase">Tasting menu, draft 2</span><span className="files_shelf_nameExt">.pdf</span></span></span><span className="files_shelf_cardMeta"><span className="files_shelf_where"><svg aria-hidden="true" className="files_shelf_markSignal" width="12" height="12" viewBox="0 0 20 20" focusable="false"><circle cx="10" cy="10" r="7.25" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="10" cy="10" r="3.25" fill="currentColor" /></svg>Uploaded</span><span>24 Sep</span></span><span className="files_shelf_cardMeta"><span>Dara</span><span className="files_shelf_ctx">Menu tasting at The Orchard</span></span></div></li><li className={`files_shelf_cardItem ${v.fs.c.f3}`} style={{'--i': '2'}} data-file="f3"><div className="files_shelf_card"><span className="files_shelf_cardThumb" aria-hidden="true"><span className="files_shelf_thumb" data-type="image" aria-hidden="true"><svg className="fx-art" viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fontFamily="Geist, sans-serif"><rect width="160" height="120" fill="var(--shelf-paper)" /><rect x="10" y="10" width="140" height="100" rx="2" fill="var(--shelf-paper)" stroke="var(--v3-text-2)" strokeWidth="1.6" /><path d="M100 10v36M100 64v46M10 74h34" stroke="var(--v3-text-2)" strokeWidth="1.6" fill="none" /><rect x="20" y="30" width="66" height="10" rx="2" fill="var(--v3-accent-soft)" stroke="var(--v3-accent)" strokeWidth="1.2" /><text x="53" y="37.5" fontSize="6" fontWeight="600" fill="var(--v3-accent)" textAnchor="middle">Long table</text><text x="16" y="22" fontSize="6.5" fontWeight="600" fill="var(--v3-text-2)" textAnchor="start">BARN</text><text x="106" y="22" fontSize="6.5" fontWeight="600" fill="var(--v3-text-2)" textAnchor="start">BAR</text><text x="16" y="104" fontSize="6" fontWeight="400" fill="var(--v3-text-2)" textAnchor="start">Entrance</text><rect x="108" y="74" width="34" height="28" rx="2" fill="none" stroke="var(--fx-h)" strokeDasharray="2 2" /><text x="125" y="91" fontSize="5.5" fontWeight="500" fill="var(--v3-text-2)" textAnchor="middle">Dance floor</text><circle cx="120" cy="34" r="6" fill="none" stroke="var(--fx-h)" strokeWidth="1.3" /><circle cx="136" cy="52" r="6" fill="none" stroke="var(--fx-h)" strokeWidth="1.3" /></svg></span></span><span className="files_shelf_cardName"><span className="files_shelf_name"><span className="files_shelf_nameBase">Barn floor plan</span><span className="files_shelf_nameExt">.png</span></span></span><span className="files_shelf_cardMeta"><span className="files_shelf_where"><svg aria-hidden="true" className="files_shelf_markSignal" width="12" height="12" viewBox="0 0 20 20" focusable="false"><circle cx="10" cy="10" r="7.25" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="10" cy="10" r="3.25" fill="currentColor" /></svg>Uploaded</span><span>23 Sep</span></span><span className="files_shelf_cardMeta"><span>Tomás</span><span className="files_shelf_ctx">Lay out the long table for twenty</span></span></div></li><li className={`files_shelf_cardItem ${v.fs.c.f2}`} style={{'--i': '3'}} data-file="f2"><div className="files_shelf_card"><span className="files_shelf_cardThumb" aria-hidden="true"><span className="files_shelf_thumb" data-type="sheet" aria-hidden="true"><svg className="fx-art" viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fontFamily="Geist, sans-serif"><rect width="160" height="120" fill="var(--shelf-paper)" /><rect x="0" y="0" width="160" height="16" fill="color-mix(in srgb, var(--v3-text) 5%, var(--shelf-paper))" /><text x="10" y="11" fontSize="6.5" fontWeight="600" fill="var(--v3-text-2)" textAnchor="start">Guest</text><text x="98" y="11" fontSize="6.5" fontWeight="600" fill="var(--v3-text-2)" textAnchor="start">Table</text><text x="150" y="11" fontSize="6.5" fontWeight="600" fill="var(--v3-text-2)" textAnchor="end">RSVP</text><text x="10" y="27" fontSize="7" fontWeight="500" fill="var(--v3-text)" textAnchor="start">Aoife Murphy</text><text x="98" y="27" fontSize="7" fontWeight="400" fill="var(--v3-text-2)" textAnchor="start">3</text><text x="150" y="27" fontSize="7.5" fontWeight="700" fill="var(--good, var(--lv3-c-0b7a4b))" textAnchor="end">✓</text><path d="M6 31.5h148" stroke="var(--fx-l)" strokeWidth=".6" /><text x="10" y="40" fontSize="7" fontWeight="500" fill="var(--v3-text)" textAnchor="start">Cian Doyle</text><text x="98" y="40" fontSize="7" fontWeight="400" fill="var(--v3-text-2)" textAnchor="start">1</text><text x="150" y="40" fontSize="7.5" fontWeight="700" fill="var(--good, var(--lv3-c-0b7a4b))" textAnchor="end">✓</text><path d="M6 44.5h148" stroke="var(--fx-l)" strokeWidth=".6" /><text x="10" y="53" fontSize="7" fontWeight="500" fill="var(--v3-text)" textAnchor="start">Niamh and Rory</text><text x="98" y="53" fontSize="7" fontWeight="400" fill="var(--v3-text-2)" textAnchor="start">5</text><text x="150" y="53" fontSize="7.5" fontWeight="700" fill="var(--good, var(--lv3-c-0b7a4b))" textAnchor="end">✓</text><path d="M6 57.5h148" stroke="var(--fx-l)" strokeWidth=".6" /><text x="10" y="66" fontSize="7" fontWeight="500" fill="var(--v3-text)" textAnchor="start">Gran Doyle</text><text x="98" y="66" fontSize="7" fontWeight="400" fill="var(--v3-text-2)" textAnchor="start">1</text><text x="150" y="66" fontSize="7.5" fontWeight="700" fill="var(--good, var(--lv3-c-0b7a4b))" textAnchor="end">✓</text><path d="M6 70.5h148" stroke="var(--fx-l)" strokeWidth=".6" /><text x="10" y="79" fontSize="7" fontWeight="500" fill="var(--v3-text)" textAnchor="start">Seán Keane</text><text x="98" y="79" fontSize="7" fontWeight="400" fill="var(--v3-text-2)" textAnchor="start">4</text><text x="150" y="79" fontSize="7.5" fontWeight="700" fill="var(--v3-text-2)" textAnchor="end">…</text><path d="M6 83.5h148" stroke="var(--fx-l)" strokeWidth=".6" /><text x="10" y="92" fontSize="7" fontWeight="500" fill="var(--v3-text)" textAnchor="start">The Walshes</text><text x="98" y="92" fontSize="7" fontWeight="400" fill="var(--v3-text-2)" textAnchor="start">6</text><text x="150" y="92" fontSize="7.5" fontWeight="700" fill="var(--good, var(--lv3-c-0b7a4b))" textAnchor="end">✓</text><path d="M6 96.5h148" stroke="var(--fx-l)" strokeWidth=".6" /><text x="10" y="105" fontSize="7" fontWeight="500" fill="var(--v3-text)" textAnchor="start">Dr. Ruth Moran</text><text x="98" y="105" fontSize="7" fontWeight="400" fill="var(--v3-text-2)" textAnchor="start">2</text><text x="150" y="105" fontSize="7.5" fontWeight="700" fill="var(--good, var(--lv3-c-0b7a4b))" textAnchor="end">✓</text><path d="M6 109.5h148" stroke="var(--fx-l)" strokeWidth=".6" /></svg></span></span><span className="files_shelf_cardName"><span className="files_shelf_name"><span className="files_shelf_nameBase">Guest list</span></span></span><span className="files_shelf_cardMeta"><span className="files_shelf_where"><svg aria-hidden="true" className="files_shelf_markDrive" width="12" height="11" viewBox="0 0 87.3 78" focusable="false"><path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="var(--lv3-c-0066da)" /><path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="var(--lv3-c-00ac47)" /><path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="var(--lv3-c-ea4335)" /><path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="var(--lv3-c-00832d)" /><path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="var(--lv3-c-2684fc)" /><path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="var(--lv3-c-ffba00)" /></svg>Google Drive</span><span>23 Sep</span></span><span className="files_shelf_cardMeta"><span>Orla</span><span className="files_shelf_ctx">Confirm final numbers</span></span></div></li><li className={`files_shelf_cardItem ${v.fs.c.f4}`} style={{'--i': '4'}} data-file="f4"><div className="files_shelf_card"><span className="files_shelf_cardThumb" aria-hidden="true"><span className="files_shelf_thumb" data-type="link" aria-hidden="true"><svg className="fx-art" viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fontFamily="Geist, sans-serif"><rect width="160" height="120" fill="var(--shelf-paper)" /><rect x="0" y="0" width="160" height="14" fill="color-mix(in srgb, var(--v3-text) 6%, var(--shelf-paper))" /><circle cx="8" cy="7" r="2" fill="var(--fx-h)" /><circle cx="15" cy="7" r="2" fill="var(--fx-h)" /><rect x="26" y="4" width="90" height="6" rx="3" fill="var(--shelf-paper)" /><text x="30" y="9" fontSize="4.8" fontWeight="500" fill="var(--v3-text-2)" textAnchor="start">fernandfurrow.ie</text><text x="12" y="32" fontSize="6" fontWeight="600" fill="var(--v3-accent)" textAnchor="start">FERN AND FURROW</text><text x="12" y="48" fontSize="11" fontWeight="600" fill="var(--v3-text)" textAnchor="start">Wedding flowers,</text><text x="12" y="61" fontSize="11" fontWeight="600" fill="var(--v3-text)" textAnchor="start">grown in Cork.</text><rect x="12" y="72" width="44" height="12" rx="6" fill="var(--v3-text)" /><text x="34" y="80" fontSize="5.5" fontWeight="600" fill="var(--v3-canvas)" textAnchor="middle">Get a quote</text><circle cx="124" cy="52" r="16" fill="var(--v3-accent-soft)" stroke="var(--v3-accent)" strokeWidth="1" /><circle cx="142" cy="76" r="10" fill="var(--v3-accent-soft)" stroke="var(--v3-accent)" strokeWidth="1" /><circle cx="108" cy="82" r="9" fill="var(--v3-accent-soft)" stroke="var(--v3-accent)" strokeWidth="1" /></svg></span></span><span className="files_shelf_cardName"><span className="files_shelf_name"><span className="files_shelf_nameBase">fernandfurrow</span><span className="files_shelf_nameExt">.ie</span></span></span><span className="files_shelf_cardMeta"><span className="files_shelf_where"><svg aria-hidden="true" className="files_shelf_markLink" width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" focusable="false"><path d="M6.75 9.25a2.75 2.75 0 0 0 3.9 0l1.9-1.9a2.75 2.75 0 0 0-3.9-3.9l-.6.6" /><path d="M9.25 6.75a2.75 2.75 0 0 0-3.9 0l-1.9 1.9a2.75 2.75 0 0 0 3.9 3.9l.6-.6" /></svg>fernandfurrow.ie</span><span>22 Sep</span></span><span className="files_shelf_cardMeta"><span>Orla</span><span className="files_shelf_ctx">Chase florist deposit</span></span></div></li><li className={`files_shelf_cardItem ${v.fs.c.f5}`} style={{'--i': '5'}} data-file="f5"><div className="files_shelf_card"><span className="files_shelf_cardThumb" aria-hidden="true"><span className="files_shelf_thumb" data-type="document" aria-hidden="true"><svg className="fx-art" viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fontFamily="Geist, sans-serif"><rect width="160" height="120" fill="var(--shelf-paper)" /><text x="12" y="16" fontSize="8.5" fontWeight="600" fill="var(--v3-text)" textAnchor="start">Saturday run-sheet</text><rect x="10" y="25" width="24" height="10" rx="2" fill="var(--v3-accent-soft)" /><text x="22" y="32" fontSize="6.5" fontWeight="600" fill="var(--v3-accent)" textAnchor="middle">14:00</text><text x="40" y="32" fontSize="7" fontWeight="500" fill="var(--v3-text)" textAnchor="start">Ceremony, the orchard</text><rect x="10" y="39" width="24" height="10" rx="2" fill="var(--v3-accent-soft)" /><text x="22" y="46" fontSize="6.5" fontWeight="600" fill="var(--v3-accent)" textAnchor="middle">15:00</text><text x="40" y="46" fontSize="7" fontWeight="500" fill="var(--v3-text)" textAnchor="start">Drinks on the lawn</text><rect x="10" y="53" width="24" height="10" rx="2" fill="var(--v3-accent-soft)" /><text x="22" y="60" fontSize="6.5" fontWeight="600" fill="var(--v3-accent)" textAnchor="middle">17:30</text><text x="40" y="60" fontSize="7" fontWeight="500" fill="var(--v3-text)" textAnchor="start">Dinner in the barn</text><rect x="10" y="67" width="24" height="10" rx="2" fill="var(--v3-accent-soft)" /><text x="22" y="74" fontSize="6.5" fontWeight="600" fill="var(--v3-accent)" textAnchor="middle">19:45</text><text x="40" y="74" fontSize="7" fontWeight="500" fill="var(--v3-text)" textAnchor="start">Speeches</text><rect x="10" y="81" width="24" height="10" rx="2" fill="var(--v3-accent-soft)" /><text x="22" y="88" fontSize="6.5" fontWeight="600" fill="var(--v3-accent)" textAnchor="middle">21:00</text><text x="40" y="88" fontSize="7" fontWeight="500" fill="var(--v3-text)" textAnchor="start">The Lindens</text><rect x="10" y="95" width="24" height="10" rx="2" fill="var(--v3-accent-soft)" /><text x="22" y="102" fontSize="6.5" fontWeight="600" fill="var(--v3-accent)" textAnchor="middle">00:30</text><text x="40" y="102" fontSize="7" fontWeight="500" fill="var(--v3-text)" textAnchor="start">Carriages</text></svg></span></span><span className="files_shelf_cardName"><span className="files_shelf_name"><span className="files_shelf_nameBase">Run-sheet v2</span><span className="files_shelf_nameExt">.docx</span></span></span><span className="files_shelf_cardMeta"><span className="files_shelf_where"><svg aria-hidden="true" className="files_shelf_markSignal" width="12" height="12" viewBox="0 0 20 20" focusable="false"><circle cx="10" cy="10" r="7.25" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="10" cy="10" r="3.25" fill="currentColor" /></svg>Uploaded</span><span>21 Sep</span></span><span className="files_shelf_cardMeta"><span>Aoife</span><span className="files_shelf_ctx">Build the Saturday run-sheet</span></span></div></li><li className={`files_shelf_cardItem ${v.fs.c.f6}`} style={{'--i': '6'}} data-file="f6"><div className="files_shelf_card"><span className="files_shelf_cardThumb" aria-hidden="true"><span className="files_shelf_thumb" data-type="sheet" aria-hidden="true"><span className="files_shelf_sheetHead"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span></span></span><span className="files_shelf_cardName"><span className="files_shelf_name"><span className="files_shelf_nameBase">Event costings</span></span></span><span className="files_shelf_cardMeta"><span className="files_shelf_where"><svg aria-hidden="true" className="files_shelf_markDrive" width="12" height="11" viewBox="0 0 87.3 78" focusable="false"><path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="var(--lv3-c-0066da)" /><path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="var(--lv3-c-00ac47)" /><path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="var(--lv3-c-ea4335)" /><path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="var(--lv3-c-00832d)" /><path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="var(--lv3-c-2684fc)" /><path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="var(--lv3-c-ffba00)" /></svg>Google Drive</span><span>20 Sep</span></span><span className="files_shelf_cardMeta"><span>Orla</span><span className="files_shelf_ctx">Send the final invoice</span></span></div></li><li className={`files_shelf_cardItem ${v.fs.c.f7}`} style={{'--i': '7'}} data-file="f7"><div className="files_shelf_card"><span className="files_shelf_cardThumb" aria-hidden="true"><span className="files_shelf_thumb" data-type="sheet" aria-hidden="true"><span className="files_shelf_sheetHead"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span></span></span><span className="files_shelf_cardName"><span className="files_shelf_name"><span className="files_shelf_nameBase">Table names</span><span className="files_shelf_nameExt">.xlsx</span></span></span><span className="files_shelf_cardMeta"><span className="files_shelf_where"><svg aria-hidden="true" className="files_shelf_markSignal" width="12" height="12" viewBox="0 0 20 20" focusable="false"><circle cx="10" cy="10" r="7.25" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="10" cy="10" r="3.25" fill="currentColor" /></svg>Uploaded</span><span>19 Sep</span></span><span className="files_shelf_cardMeta"><span>Orla</span><span className="files_shelf_ctx">Print table names</span></span></div></li><li className={`files_shelf_cardItem ${v.fs.c.f8}`} style={{'--i': '8'}} data-file="f8"><div className="files_shelf_card"><span className="files_shelf_cardThumb" aria-hidden="true"><span className="files_shelf_thumb" data-type="document" aria-hidden="true"><svg className="fx-art" viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fontFamily="Geist, sans-serif"><rect width="160" height="120" fill="var(--shelf-paper)" /><text x="80" y="18" fontSize="8.5" fontWeight="600" fill="var(--v3-text)" textAnchor="middle">Ceremony running order</text><text x="80" y="30" fontSize="6.5" fontWeight="400" fill="var(--v3-text-2)" textAnchor="middle">Lawn, 2pm. Chairs for 118</text><rect x="48.0" y="46" width="64" height="2.6" rx="1.5" fill="var(--fx-l)" /><rect x="42.0" y="53" width="76" height="2.6" rx="1.5" fill="var(--fx-l)" /><rect x="52.0" y="60" width="56" height="2.6" rx="1.5" fill="var(--fx-l)" /><rect x="45.0" y="74" width="70" height="2.6" rx="1.5" fill="var(--fx-l)" /><rect x="50.0" y="81" width="60" height="2.6" rx="1.5" fill="var(--fx-l)" /><rect x="43.0" y="88" width="74" height="2.6" rx="1.5" fill="var(--fx-l)" /><rect x="55.0" y="95" width="50" height="2.6" rx="1.5" fill="var(--fx-l)" /></svg></span></span><span className="files_shelf_cardName"><span className="files_shelf_name"><span className="files_shelf_nameBase">Ceremony running order</span></span></span><span className="files_shelf_cardMeta"><span className="files_shelf_where"><svg aria-hidden="true" className="files_shelf_markDrive" width="12" height="11" viewBox="0 0 87.3 78" focusable="false"><path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="var(--lv3-c-0066da)" /><path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="var(--lv3-c-00ac47)" /><path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="var(--lv3-c-ea4335)" /><path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="var(--lv3-c-00832d)" /><path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="var(--lv3-c-2684fc)" /><path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="var(--lv3-c-ffba00)" /></svg>Google Drive</span><span>18 Sep</span></span><span className="files_shelf_cardMeta"><span>Aoife</span><span className="files_shelf_ctx">Brief the ceremony team</span></span></div></li><li className={`files_shelf_cardItem ${v.fs.c.f9}`} style={{'--i': '9'}} data-file="f9"><div className="files_shelf_card"><span className="files_shelf_cardThumb" aria-hidden="true"><span className="files_shelf_thumb" data-type="link" aria-hidden="true"><span className="files_shelf_thumbPage"><span className="files_shelf_webBar"><b /><i className="files_shelf_line" style={{width: '44%'}} /></span><i className="files_shelf_line files_shelf_lineHead" style={{width: '80%'}} /><i className="files_shelf_line files_shelf_lineHead" style={{width: '56%'}} /><span className="files_shelf_webBlock" /></span></span></span><span className="files_shelf_cardName"><span className="files_shelf_name"><span className="files_shelf_nameBase">thelindens</span><span className="files_shelf_nameExt">.ie</span></span></span><span className="files_shelf_cardMeta"><span className="files_shelf_where"><svg aria-hidden="true" className="files_shelf_markLink" width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" focusable="false"><path d="M6.75 9.25a2.75 2.75 0 0 0 3.9 0l1.9-1.9a2.75 2.75 0 0 0-3.9-3.9l-.6.6" /><path d="M9.25 6.75a2.75 2.75 0 0 0-3.9 0l-1.9 1.9a2.75 2.75 0 0 0 3.9 3.9l.6-.6" /></svg>thelindens.ie</span><span>16 Sep</span></span><span className="files_shelf_cardMeta"><span>Dara</span><span className="files_shelf_ctx">Confirm the band’s arrival time</span></span></div></li><li className={`files_shelf_cardItem ${v.fs.c.f10}`} style={{'--i': '10'}} data-file="f10"><div className="files_shelf_card"><span className="files_shelf_cardThumb" aria-hidden="true"><span className="files_shelf_thumb" data-type="document" aria-hidden="true"><svg className="fx-art" viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fontFamily="Geist, sans-serif"><rect width="160" height="120" fill="var(--shelf-paper)" /><text x="12" y="18" fontSize="8.5" fontWeight="600" fill="var(--v3-text)" textAnchor="start">Fern and Furrow</text><text x="148" y="18" fontSize="6.5" fontWeight="400" fill="var(--v3-text-2)" textAnchor="end">Quote</text><text x="12" y="36" fontSize="7" fontWeight="500" fill="var(--v3-text)" textAnchor="start">Bridal bouquet</text><text x="148" y="36" fontSize="7" fontWeight="400" fill="var(--v3-text-2)" textAnchor="end">€180</text><text x="12" y="48" fontSize="7" fontWeight="500" fill="var(--v3-text)" textAnchor="start">Ceremony arch</text><text x="148" y="48" fontSize="7" fontWeight="400" fill="var(--v3-text-2)" textAnchor="end">€420</text><text x="12" y="60" fontSize="7" fontWeight="500" fill="var(--v3-text)" textAnchor="start">Table posies x12</text><text x="148" y="60" fontSize="7" fontWeight="400" fill="var(--v3-text-2)" textAnchor="end">€360</text><text x="12" y="72" fontSize="7" fontWeight="500" fill="var(--v3-text)" textAnchor="start">Buttonholes x8</text><text x="148" y="72" fontSize="7" fontWeight="400" fill="var(--v3-text-2)" textAnchor="end">€96</text><path d="M12 88h136" stroke="var(--fx-h)" strokeWidth=".8" /><text x="12" y="100" fontSize="7.5" fontWeight="600" fill="var(--v3-text)" textAnchor="start">Total</text><text x="148" y="100" fontSize="8.5" fontWeight="700" fill="var(--v3-accent)" textAnchor="end">€1,056</text></svg></span></span><span className="files_shelf_cardName"><span className="files_shelf_name"><span className="files_shelf_nameBase">Florist quote</span><span className="files_shelf_nameExt">.pdf</span></span></span><span className="files_shelf_cardMeta"><span className="files_shelf_where"><svg aria-hidden="true" className="files_shelf_markSignal" width="12" height="12" viewBox="0 0 20 20" focusable="false"><circle cx="10" cy="10" r="7.25" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="10" cy="10" r="3.25" fill="currentColor" /></svg>Uploaded</span><span>13 Sep</span></span><span className="files_shelf_cardMeta"><span>Orla</span><span className="files_shelf_ctx">Chase florist deposit</span></span></div></li><li className={`files_shelf_cardItem ${v.fs.c.f11}`} style={{'--i': '11'}} data-file="f11"><div className="files_shelf_card"><span className="files_shelf_cardThumb" aria-hidden="true"><span className="files_shelf_thumb" data-type="sheet" aria-hidden="true"><span className="files_shelf_sheetHead"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span><span className="files_shelf_sheetRow"><i /><i /><i /></span></span></span><span className="files_shelf_cardName"><span className="files_shelf_name"><span className="files_shelf_nameBase">Supplier contacts</span></span></span><span className="files_shelf_cardMeta"><span className="files_shelf_where"><svg aria-hidden="true" className="files_shelf_markDrive" width="12" height="11" viewBox="0 0 87.3 78" focusable="false"><path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="var(--lv3-c-0066da)" /><path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="var(--lv3-c-00ac47)" /><path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="var(--lv3-c-ea4335)" /><path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="var(--lv3-c-00832d)" /><path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="var(--lv3-c-2684fc)" /><path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="var(--lv3-c-ffba00)" /></svg>Google Drive</span><span>12 Sep</span></span><span className="files_shelf_cardMeta"><span>Aoife</span><span className="files_shelf_ctx">Send final numbers to suppliers</span></span></div></li></ul>{(v.fs.empty) ? (<><div className="fx-empty"><b>{v.fs.emptyT}</b><p>Files are found by their name, their task or the person who added them.</p><button type="button" className="btn btn-line btn-sm" onClick={v.fs.reset}>Show every file</button></div></>) : null}</section></div></div></div></div>
</div>
</div>
</section>
<section className="sec cx-sec" id="chat" aria-labelledby="chat-title" data-reveal="chat">
<div className="wrap cx-split">
<div className="cx-stage" data-product="" role="group" aria-label="A working sample of Chat">
<div className="cx-panel">
<div className="cp-rail" aria-hidden="true">
<span className="cp-rb"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="var(--accent)" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="var(--accent)" /></svg></span>
<span className="cp-sep" />
<span className="cp-rb cur"><span className="cp-pair"><span style={{background: 'var(--tone-rose-bg)', color: 'var(--tone-rose-fg)'}}>M</span><span style={{background: 'var(--tone-plum-bg)', color: 'var(--tone-plum-fg)'}}>F</span></span></span>
<span className="cp-rb"><span className="cp-av" style={{background: 'var(--tone-amber-bg)', color: 'var(--tone-amber-fg)'}}>NK</span><i className="cp-dot" /></span>
<span className="cp-rb"><span className="cp-av" style={{background: 'var(--tone-teal-bg)', color: 'var(--tone-teal-fg)'}}>AW</span><i className="cp-dot" /></span>
<span className="cp-rb"><span className="cp-av" style={{background: 'var(--tone-green-bg)', color: 'var(--tone-green-fg)'}}>DQ</span></span>
<span className="cp-rb"><span className="cp-av" style={{background: 'var(--tone-blue-bg)', color: 'var(--tone-blue-fg)'}}>TR</span></span>
</div>
<div className="cx-conv">
<div className="cp-vh"><span className="cp-pair" aria-hidden="true"><span style={{background: 'var(--tone-rose-bg)', color: 'var(--tone-rose-fg)'}}>M</span><span style={{background: 'var(--tone-plum-bg)', color: 'var(--tone-plum-fg)'}}>F</span></span><span className="cp-who"><b>Mara &amp; Finn’s wedding</b><small>Project · 5 people</small></span><span className="cp-catch" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="var(--accent)" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="var(--accent)" /></svg>Catch up</span></div>
<div className="cx-stream" aria-live="polite" data-stream="">
<div className="cp-day">Yesterday</div>
<div className="cp-msg cp-old"><span className="cp-av" style={{background: 'var(--tone-blue-bg)', color: 'var(--tone-blue-fg)'}} aria-hidden="true">TR</span><div><p className="cp-hd"><b>Tomás</b><time>16:40</time></p><p className="cp-body">Florist confirmed for Friday. The quote is on the task.</p></div></div>
<div className="cp-msg cp-old"><span className="cp-av" style={{background: 'var(--tone-amber-bg)', color: 'var(--tone-amber-fg)'}} aria-hidden="true">NK</span><div><p className="cp-hd"><b>Niamh</b><time>17:05</time></p><p className="cp-body">Thanks. I added the final numbers to the seating plan.</p></div></div>
<div className="cp-day">Today</div>
{(v.cx.s1) ? (<>
<div className="cp-new cx-in" aria-hidden="true">New</div>
<div className="cp-msg cx-in"><span className="cp-av" style={{background: 'var(--tone-plum-bg)', color: 'var(--tone-plum-fg)'}} aria-hidden="true">OB</span><div><p className="cp-hd"><b>Orla</b><time>09:14</time></p><p className="cp-body"><span className="cp-mention">@Ping</span> move the table names to Thursday and remind Dara about the tonic.</p></div></div>
</>) : null}
{(v.cx.typing) ? (<>
<div className="cp-typing cx-in"><span className="cp-dots" aria-hidden="true"><i /><i /><i /></span>Ping is drafting a plan</div>
</>) : null}
{(v.cx.s3) ? (<>
<div className="cp-msg ping cx-in"><span className="cp-pm" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="var(--accent)" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="var(--accent)" /></svg></span><div><p className="cp-hd"><b>Ping</b><span className="cp-priv"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>Only you see this</span></p>
<div className={`cp-plan ${v.cx.planCls}`}>
<div className="cp-ph"><b>Plan</b><span>{v.cx.planSub}</span></div>
<ol>
<li style={{'--i': '0'}}><span className="cp-box" aria-hidden="true"><span className="cp-num">1</span><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></span><span><span className="what">Move <b>Print table names</b> to Thursday</span><span className="cp-fields"><span className="cp-field"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17" /></svg>Thu 30 Sep</span></span></span></li>
<li style={{'--i': '1'}}><span className="cp-box" aria-hidden="true"><span className="cp-num">2</span><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></span><span><span className="what">Remind <b>Dara</b> about <b>Order tonic and the good olives</b></span><span className="cp-fields"><span className="cp-field"><span className="cp-av xs" style={{background: 'var(--tone-green-bg)', color: 'var(--tone-green-fg)'}} aria-hidden="true">D</span>Dara</span><span className="cp-field">Today</span></span></span></li>
<li style={{'--i': '2'}}><span className="cp-box" aria-hidden="true"><span className="cp-num">3</span><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></span><span><span className="what">Tell <b>Aoife</b> when both are done</span></span></li>
</ol>
<div className="cp-pf"><button type="button" className={`cp-apply ${v.cx.applyCls}`} onClick={v.cx.apply} aria-disabled={v.cx.applied}><svg className="cp-apply-ck" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg><span>{v.cx.applyLabel}</span></button>{(v.cx.canUndo) ? (<><button type="button" className="cp-edit" onClick={v.cx.undo}>Undo</button></>) : null}<small>{v.cx.footNote}</small></div>
</div></div></div>
</>) : null}
{(v.cx.mTyping) ? (<>
<div className="cp-typing cx-in"><span className="cp-dots" aria-hidden="true"><i /><i /><i /></span>Dara is typing</div>
</>) : null}
{(v.cx.reply) ? (<>
<div className="cp-msg cx-in"><span className="cp-av" style={{background: 'var(--tone-green-bg)', color: 'var(--tone-green-fg)'}} aria-hidden="true">DQ</span><div><p className="cp-hd"><b>Dara Quinn</b><time>09:16</time></p><p className="cp-body">On it. The tonic arrives Wednesday.</p></div></div>
</>) : null}
</div>
<div className="cp-comp">
<p className="cp-aud"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /></svg>{v.cx.aud}</p>
<div className={`cp-box2 ${v.cx.compCls}`} aria-hidden="true"><span className="cp-plus"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg></span><span className="cp-draft">{v.cx.draft}</span><span className={`cp-send ${v.cx.sendCls}`}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M6 11l6-6 6 6" /></svg></span></div>
</div>
</div>
</div>
</div>
<div className="copy">
<h2 className="h2" id="chat-title">Talk where the work is.</h2>
<p className="sub">Chat opens beside your tasks. Ask Ping for a change and it shows you a plan first. Nothing moves until you press Apply, and every step can be undone.</p>
<p className="cx-ping"><b>Ping</b> is built into chat. It is not a person. It drafts the change. You decide.</p>
<button type="button" className={`btn btn-line cx-replay ${v.cx.replayCls}`} onClick={v.cx.replay}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></svg>Play it again</button>
</div>
</div>
</section>
<section className="sec cl-sec field" id="waitlist" aria-labelledby="wl-title" data-reveal="waitlist">
<div className="wrap cl-grid">
<div className="cl-form">
<h2 className="h2" id="wl-title">Be first in.</h2>
<p className="sub">Venues first, in January 2027. Everyone else after that. One email, when it is your turn.</p>
{(v.wl.showForm) ? (<>
<form className="wl-form" noValidate={true} onSubmit={v.wl.submit}>
<label htmlFor="wl-email" className="field-l">Email address</label>
<input id="wl-email" className="wl-input" type="email" placeholder="you@example.ie" autoComplete="email" value={v.wl.email} onChange={v.wl.onEmail} aria-invalid={v.wl.invalid} aria-describedby="wl-msg" />
<p id="wl-msg" className={`field-msg ${v.wl.msgCls}`} aria-live="polite">{v.wl.msg}</p>
<fieldset className="runs">
<legend id="runs-q">What do you run? <span>Optional. It helps us invite you at the right time.</span></legend>
<div className="chips" role="radiogroup" aria-labelledby="runs-q">
{(v.runs).map((r: any, idx: number) => (<React.Fragment key={idx}>
<button type="button" role="radio" className={`chip ${r.cls}`} aria-checked={r.checked} tabIndex={r.ti} onClick={r.pick} onKeyDown={r.key}>{r.label}</button>
</React.Fragment>))}
</div>
</fieldset>
<button type="submit" className={`btn btn-solid wl-btn wl-submit ${v.wl.btnCls}`} aria-disabled={v.wl.busy}><span className="wl-spin" aria-hidden="true" /><span>{v.wl.btnLabel}</span></button>
<p className="wl-privacy">Your email is used only to tell you when your access is ready. <a href="/privacy">Privacy notice</a></p>
</form>
</>) : null}
{(v.wl.done) ? (<>
<div className="wl-done" role="status">
<span className="wl-check" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path className="draw" d="m5 12.5 4.5 4.5L19 7.5" /></svg></span>
<p className="wl-done-t" id="close-done" tabIndex="-1">You’re on the list.</p>
<p className="wl-done-s">I will email <b>{v.wl.email}</b> once, when your access is ready. Running a venue? Reply to that email and we can talk.</p>
<button type="button" className="btn btn-line btn-sm" onClick={v.wl.reset}>Use a different email</button>
</div>
</>) : null}
</div>
<div className="cl-side">
<div className="price" id="pricing" aria-labelledby="price-title">
<h3 className="price-h" id="price-title">Planned pricing at launch</h3>
<div className="price-g">
<div className="price-c"><b>Free</b><span className="price-v">€0</span><p>One workspace, with 3 people who can edit.</p><p className="price-n">No card needed.</p></div>
<div className="price-c"><b>Pro</b><span className="price-v">€12<small>a month</small></span><p>For work that keeps moving across projects.</p><p className="price-n">Or €120 a year.</p></div>
</div>
</div>
<p className="price-venue">Venues have separate terms, agreed one to one.</p>
<figure className="founder">
<blockquote><p>I am building Signal Studio in Limerick for the people the work runs through, not the people who run software.</p></blockquote>
<figcaption>Ethan, founder, Limerick</figcaption>
</figure>
</div>
</div>
</section>
</main>
<footer className="foot3">
<div className="wrap">
<p className="foot-word" aria-hidden="true">Signal Studio<i>.</i></p>
<nav className="foot-links" aria-label="Footer">
<a href="#venues">For venues</a><a href="#timeline">Timeline</a><a href="#analytics">Analytics</a><a href="#files">Files</a><a href="#chat">Chat</a><a href="#pricing">Pricing</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="mailto:hello@signalstudio.ie">hello@signalstudio.ie</a>
</nav>
<p className="foot-legal">© 2026 Signal Studio Limited. Registered in Ireland, CRO 823488. Made in Limerick.</p>
</div>
</footer>
<div className={`sticky-cta ${v.stickyCls}`} aria-hidden={v.stickyHidden}><a href="#waitlist" className="btn btn-solid" tabIndex={v.stickyTab}>Join the waitlist</a></div>
</div>
    );
  }
}

export default LandingV3;
