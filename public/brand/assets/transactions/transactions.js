import { MERCHANTS, TRANSACTIONS } from './merchants.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

function formatAmount(amount, currency = 'EUR') {
  const sym = currency === 'EUR' ? '€' : currency;
  const abs = Math.abs(amount).toLocaleString('en-IE', {
    minimumFractionDigits: amount % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  });
  const sign = amount >= 0 ? '+' : '-';
  return `${sign}${sym}${abs}`;
}

function formatCurrency(amount) {
  const abs = Math.abs(amount).toLocaleString('en-IE', {
    minimumFractionDigits: amount % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return `€${abs}`;
}

function formatDateLabel(iso) {
  const d = new Date(`${iso}T12:00:00`);
  const day = d.getDate();
  const month = d.toLocaleString('en-IE', { month: 'short' });
  return `${day} ${month}`;
}

function formatDetailDate(iso, time) {
  const d = new Date(`${iso}T${time}:00`);
  const day = d.getDate();
  const month = d.toLocaleString('en-IE', { month: 'short' });
  return `${day} ${month}, ${time}`;
}

function badgeSymbol(type) {
  if (type === 'inbound') return '+';
  if (type === 'p2p') return '→';
  if (type === 'failed') return '×';
  return null;
}

function avatarHtml(merchant, badge, size = '') {
  const lg = size === 'lg' ? ' lg' : '';
  const badgeType = badge || merchant.badge;
  const sym = badgeSymbol(badgeType);
  const badgeHtml = sym
    ? `<span class="merchant-badge ${badgeType}" aria-hidden="true">${sym}</span>`
    : '';

  return `
    <div class="merchant-avatar${lg}">
      <img src="${merchant.logo}" alt="" width="512" height="512" decoding="async" fetchpriority="${size === 'lg' ? 'high' : 'auto'}">
      ${badgeHtml}
    </div>`;
}

function groupByDate(transactions) {
  const sorted = [...transactions].sort((a, b) => {
    const da = new Date(`${a.date}T${a.time}`);
    const db = new Date(`${b.date}T${b.time}`);
    return db - da;
  });
  const groups = new Map();
  for (const tx of sorted) {
    const label = formatDateLabel(tx.date);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label).push(tx);
  }
  return groups;
}

function renderList() {
  const scroll = document.getElementById('tx-scroll');
  const groups = groupByDate(TRANSACTIONS);
  const parts = [];

  for (const [label, items] of groups) {
    parts.push(`<div class="tx-group-label">${label}</div>`);
    parts.push('<div class="tx-card">');
    for (const tx of items) {
      const m = MERCHANTS[tx.merchantId];
      const positive = tx.amount >= 0;
      parts.push(`
        <button type="button" class="tx-row" data-tx="${tx.id}">
          ${avatarHtml(m, tx.badge)}
          <div class="tx-row-body">
            <div class="tx-row-name">${m.listLabel ?? m.name}</div>
            <div class="tx-row-meta">${tx.time}</div>
          </div>
          <div class="tx-row-amount${positive ? ' positive' : ''}">${formatAmount(tx.amount)}</div>
        </button>`);
    }
    parts.push('</div>');
  }

  scroll.innerHTML = parts.join('');
}

function renderDetail(tx) {
  const m = MERCHANTS[tx.merchantId];
  const panel = document.getElementById('detail-panel');
  const positive = tx.amount >= 0;
  const isTransfer = tx.badge === 'p2p' || m.category === 'Transfers';
  const isTopUp = tx.amount > 0;

  const heroName =
    (m.subtitle && isTopUp) || (isTransfer && tx.badge === 'p2p')
      ? ''
      : `<p class="detail-name">${m.name}</p>`;
  const subtitle = m.subtitle && isTopUp
    ? `<p class="detail-subtitle">${m.subtitle}</p>`
    : isTransfer && tx.badge === 'p2p'
      ? `<p class="detail-subtitle">${m.name}</p>`
      : '';

  const actions = isTransfer
    ? `<div class="detail-actions">
        <button type="button" class="detail-action" style="background:var(--ink);color:#fff;">↗ Send again</button>
        <button type="button" class="detail-action">Request</button>
        <button type="button" class="detail-action">📅 Schedule</button>
      </div>`
    : `<div class="detail-actions">
        <button type="button" class="detail-action">⇄ Split bill</button>
        <button type="button" class="detail-action">⊘ Block future payments</button>
      </div>`;

  const totalRow = isTopUp
    ? `<div class="detail-row"><span class="detail-row-label">Total received</span><span class="detail-row-value">${formatCurrency(tx.receivedTotal || 0)}</span></div>`
    : isTransfer
      ? `<div class="detail-row"><span class="detail-row-label">Total sent</span><span class="detail-row-value">${formatCurrency(tx.sentTotal ?? 0)}</span></div>`
      : `<div class="detail-row"><span class="detail-row-label">Spent at ${m.name}</span><span class="detail-row-value">${formatCurrency(tx.spentTotal ?? 0)}</span></div>`;

  panel.innerHTML = `
    <div class="detail-header">
      <button type="button" class="detail-close" aria-label="Close">×</button>
      <button type="button" class="detail-more" aria-label="More">⋯</button>
    </div>
    <div class="detail-scroll">
      <div class="detail-hero">
        ${avatarHtml(m, tx.badge, 'lg')}
        ${subtitle}
        ${heroName}
        <p class="detail-amount">${formatAmount(tx.amount)}</p>
        <p class="detail-datetime">${formatDetailDate(tx.date, tx.time)}</p>
      </div>
      ${actions}
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-row-label">${isTopUp ? 'To' : isTransfer ? 'From' : 'Card'}</span>
          <span class="detail-row-value">Personal · EUR</span>
        </div>
        <div class="detail-row">
          <span class="detail-row-label">${isTopUp ? 'Confirmation' : 'Payment from'}</span>
          <span class="detail-row-value accent">Download ↓</span>
        </div>
      </div>
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-row-label">Exclude from analytics</span>
          <span class="detail-row-value">○</span>
        </div>
        <div class="detail-row">
          <span class="detail-row-label">Category</span>
          <span class="detail-row-value">${m.categoryIcon} ${m.category}</span>
        </div>
        ${totalRow}
        <div class="detail-row">
          <span class="detail-row-label">See all ${tx.txCount ?? 1} transactions</span>
          <span class="detail-chevron">›</span>
        </div>
      </div>
    </div>`;

  panel.querySelector('.detail-close').addEventListener('click', closePanel);
}

function openPanel(txId) {
  const tx = TRANSACTIONS.find((t) => t.id === txId);
  if (!tx) return;
  renderDetail(tx);
  document.getElementById('detail-panel').classList.add('open');
  document.querySelector('.list-view').classList.add('panel-open');
  document.getElementById('review-banner').textContent = `Reviewing: ${MERCHANTS[tx.merchantId].name}`;
}

function closePanel() {
  document.getElementById('detail-panel').classList.remove('open');
  document.querySelector('.list-view').classList.remove('panel-open');
  document.getElementById('review-banner').textContent = 'Tap a transaction to review merchant logo placement';
}

function initMonths() {
  const tabs = document.getElementById('month-tabs');
  tabs.innerHTML = MONTHS.map(
    (m, i) => `<button type="button" class="month-tab${i === 5 ? ' active' : ''}">${m}</button>`
  ).join('');
}

function bindEvents() {
  document.getElementById('tx-scroll').addEventListener('click', (e) => {
    const row = e.target.closest('[data-tx]');
    if (row) openPanel(row.dataset.tx);
  });
}

renderList();
initMonths();
bindEvents();
closePanel();

export { MERCHANTS, TRANSACTIONS, openPanel, closePanel };
