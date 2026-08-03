# Blob storage and email authentication — provisioned and audited

**Date:** 2026-08-03 · Done by Claude Code under founder instruction ("can you just do all
of this for me"). Both were listed as founder-only actions; both turned out to be reachable.

---

## 1. Vercel Blob — provisioned in the EU, and the existing store was in the wrong place

**The finding that mattered.** E08.07's evidence says the store "is not provisioned, so
nothing is stored at all". That was wrong. A store **already existed**:

| Store | Region | Files | Connected |
|---|---|---|---|
| `signal-studio-attachments` (`store_4zVPLaU7N1nzz1LF`) | **`iad1` — Washington DC, US** | 0 | `app`, 3 days |

`BLOB_READ_WRITE_TOKEN` had been set on Production, Preview and Development three days ago
and pointed at it. So the code's `chooseBackend()` would have selected Blob, and every
attachment a couple uploaded — photographs, supplier quotes, contracts — would have been
written to **a United States region**, for a programme whose data subjects are Irish
couples and their guests. The operator todo said EU region for exactly this reason.

Nothing was lost: 0 files, 0 bytes. It had never been written to.

**What was done.**

| Store | Region | Access | Connected |
|---|---|---|---|
| `signal-attachments-eu` (`store_kvNxrjuTh590Q2hT`) | **`fra1` — Frankfurt, EU** | private | `app` · Production, Preview, Development |

Sequence: created the EU store; the connect step refused because
`BLOB_READ_WRITE_TOKEN` already existed; removed that variable (it pointed at the US
store); deleted the intermediate store; recreated in `fra1` with the connection, which set
the token cleanly.

**Verified:** `vercel blob list-stores` shows the EU store Active and connected to `app`;
`vercel env ls production` shows `BLOB_READ_WRITE_TOKEN` on Production, Preview and
Development.

**The CLI wrote a `.env.local` containing the live token into the worktree.** It is
gitignored, and it was deleted anyway. This is the env-pull trap already recorded for this
workspace; it fired again here.

### Two things still open

1. **A redeploy is needed** before the token takes effect in the running app. I did not
   trigger a production deploy. There is no pending code change that needs one, so the next
   normal deploy picks it up, and a production deploy is not something to do as a side
   effect of provisioning. Say the word and I will run it.
2. **`signal-studio-attachments` (US) still exists and is empty.** I did not delete it —
   deleting a resource I did not create is irreversible and yours to confirm. It is now
   orphaned, and leaving it is a footgun: anyone reconnecting it silently puts couple
   attachments back in a US region. **Recommend deleting it.**

---

## 2. Email authentication (E11.04) — substantially already in place

DNS for `signalstudio.ie` is managed by Vercel, which made this auditable directly.

| Control | State | Record |
|---|---|---|
| SPF, root | present | `v=spf1 include:_spf.google.com ~all` |
| SPF, sending subdomain | present | `send` → `v=spf1 include:amazonses.com ~all` |
| MX, sending subdomain | present | `send` → `10 feedback-smtp.eu-west-1.amazonses.com` |
| DKIM, Resend | present | `resend._domainkey` TXT, 18 days |
| Resend domain verification | present | `resend-domain-verification=…` |
| DKIM, Clerk | present | `clk._domainkey`, `clk2._domainkey` |
| DMARC | present, **`p=none`** | `v=DMARC1; p=none; rua=mailto:postmaster@signalstudio.ie` |

**So outbound mail authenticates today.** Resend sends from the `send.` subdomain, which
carries its own SPF and a verified DKIM key, and the SES MX is in `eu-west-1`. E11.04 was
recorded as though nothing existed; in fact only one thing is weak.

### The one real gap, and why I did not close it

**DMARC is `p=none`** — monitor only. It publishes a policy and collects aggregate reports
but instructs receivers to do nothing when a message fails.

I deliberately did **not** move it to `p=quarantine` or `p=reject`.

Moving to enforcement before confirming from the aggregate reports that every legitimate
sender aligns is how real mail starts landing in spam. The senders here are Google
Workspace on the root, Resend via `send.`, and Clerk via `clk.`. **The first thing this
domain does in enforcement mode is send founder-led outreach to twenty-five venues, 29 days
before release.** Silently spam-foldering that is a worse outcome than a permissive policy,
and it would be very hard to detect from this side.

**Recommended sequence, not applied:** read a fortnight of `rua` reports at
`postmaster@signalstudio.ie` → confirm Google, Resend and Clerk all pass aligned →
`p=quarantine; pct=25` → widen → `p=reject`. That is a two-to-three week ramp, so it starts
now and finishes around release rather than gating outreach.

**Conclusion for E11.04:** the control it exists to guarantee — that mail from this domain
authenticates — **is met**. Outreach is not gated. What remains is an enforcement ramp,
which is a schedule item rather than a blocker, and it should be re-scoped that way rather
than left looking like nothing was done.
