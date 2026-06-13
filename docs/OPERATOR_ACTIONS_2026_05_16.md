# Operator actions — what only you can do

Written 2026-05-16 after the program-health run. Everything that could
be fixed in code or config has been. This is the short list of things
that genuinely need you, written for a non-technical person. Do them in
order. Item 1 is the only true emergency.

---

## 1. Turn Signal Timeline's "save" back on (≈5 minutes, free) — URGENT

**What's wrong, in plain words:** Signal Timeline's website is live, but
its safety lock for spam is wired to a service that was never set up.
Because the safety lock can't reach that service, it fails shut — so
every attempt to *create a workspace, add a project, or save a source*
on the live site is rejected. The product looks fine but can't be used.
We deliberately did **not** disable the safety lock (that would remove
real spam protection). The fix is to give it the service it expects.

**Why only you can do this:** it needs a new account on a service
(Upstash), created through your Vercel account. An agent can't create
billing-bearing accounts on your behalf.

**Exact steps:**

1. Open **https://vercel.com** in your browser and sign in.
2. Top nav: click **Integrations** (or go to
   **https://vercel.com/marketplace**).
3. In the search box type **Upstash** and click the **Upstash** result
   (it says "Serverless Redis").
4. Click **Add Integration** (or **Install**).
5. When it asks which Vercel account/team: choose your account
   (**ethanmcn2013-1730s-projects**).
6. When it asks which projects to connect: choose **Specific Projects**
   and tick **timeline** only. Continue.
7. On the Upstash side, when prompted to create a database: pick the
   **Free** plan, any name (e.g. `signal-roadmap`), nearest region,
   and confirm. Approve the connection back to Vercel.
8. That's it — the integration automatically adds the two settings
   Timeline needs (`UPSTASH_REDIS_REST_URL` and
   `UPSTASH_REDIS_REST_TOKEN`) to the Timeline project.
9. **Tell me "Upstash is connected to timeline"** and I'll verify the
   two settings landed and trigger a fresh deploy so the fix goes live.
   (If you'd rather, in Vercel open the **timeline** project →
   **Deployments** → the latest one → the **⋯** menu → **Redeploy** —
   that also works.)

**How you'll know it worked:** after redeploy, creating a workspace on
the live Timeline site succeeds instead of saying "Too many requests".

---

## 2. Make the daily Signal email trustworthy (≈10 minutes) — IMPORTANT, not urgent

**Context:** the Signal morning-briefing cron is already configured
on Vercel (it has its run key and its email key). During this run I
wired the missing piece so Signal HQ can finally *see* it run — within
a day HQ will show it green automatically, no action from you. The two
items below don't block it running; they make the email actually
**arrive in inboxes and contain real data** instead of being empty or
landing in spam.

### 2a. Sign in to Signal Tasks once (2 minutes)

The briefing is built from a real person's Tasks data. Until at least
one person has signed into Tasks, the briefing has nobody to write
about.

1. Go to **https://tasks.signalstudio.ie**.
2. Sign in (create the account if needed — this is your own product).
3. Add one or two tasks so there's something to summarize.

That's all. The next morning's briefing will have real content.

### 2b. Turn on email signing (DKIM) in Google Workspace (≈8 minutes)

This stops the daily email being flagged as spam. It's a one-time
setting in your Google admin.

1. Go to **https://admin.google.com** and sign in as the admin.
2. Left menu: **Apps → Google Workspace → Gmail**.
3. Click **Authenticate email** (DKIM).
4. Select the domain **signalstudio.ie**.
5. Click **Generate new record**. Leave defaults, click **Generate**.
6. Google shows a **DNS record** (a name and a long text value).
   **Copy both** and paste them to me in chat — adding that record to
   the domain is the one DNS step I can do for you.
7. After I confirm the record is added, come back to this same screen
   and click **Start authentication**.

---

## 3. Optional, low priority — Preview deploys for Studio

Not broken, nothing depends on it. Studio's *Preview* deploys (the
test builds on each push) don't have a database by design, so they
can show a harmless red mark even though the live site is fine. If you
ever want preview builds to go green too, that's a separate small setup
— say the word and I'll lay out the options. Safe to ignore.

---

## What I already handled (no action needed)

- All Signal HQ atlas "drift" warnings — re-verified against live code
  and cleared (real corrections made, not rubber-stamped).
- "Tasks digest cron unmonitored" — replaced a permanent fake warning
  with real cross-repo monitoring; wired the secrets across all three
  projects. Goes green on its own within a day.
- "Signal daily cron never ran" — the missing heartbeat wiring is
  done; HQ will see it within a day.
- All 8 HQ risks — honestly re-graded against what actually shipped.
  The two genuinely-open ones (this document's items 1 and 2) are kept
  visible on purpose; nothing was hidden.
