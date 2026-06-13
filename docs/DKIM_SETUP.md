# DKIM setup · `hello@signalstudio.ie`

**Status:** Final outstanding email-deliverability task. SPF + DMARC + MX
are already live on `signalstudio.ie` (verified 2026-05-09). DKIM is
the one record missing.

**Time:** ~10 minutes of your time + 10 minutes of propagation +
~5 minutes of mine.

**Why it matters:** Without DKIM, `hello@signalstudio.ie` is SPF-only-
signed. Functional, but Outlook / corporate filters may flag it as
suspicious. The Sinéad email at Lamb's Hill and the signal daily
briefing emails both ship from `hello@`; both need DKIM-pass to stay
out of spam folders.

---

## Your part (~10 minutes)

### 1 · Open Google Workspace admin

Go to **admin.google.com** and sign in as `ethan@signalstudio.ie`.

### 2 · Navigate to Gmail authentication

Click through the menu:

`Menu (top-left burger) → Apps → Google Workspace → Gmail`

Then on the Gmail settings page, click **Authenticate email**.

> If you can't find Authenticate email, the direct URL is:
> `admin.google.com/ac/apps/gmail/authenticateemail`

### 3 · Generate the record

- In the **Selected domain** dropdown, choose `signalstudio.ie`.
- Click **Generate new record**.
- In the dialog:
  - **DKIM key bit length:** select `2048` (longer = more secure;
    Google supports it; some legacy DNS providers don't, but Vercel
    does).
  - **Prefix selector:** leave as `google` (the default — easier to
    remember, and Google's docs assume it).
- Click **Generate**.

You'll see a message: *"DKIM authentication settings updated"*. The
**TXT record name** and **TXT record value** are now visible on the
page. **Do not click "Start authentication" yet** — that step comes
after the DNS record is live.

### 4 · Send me the record

Paste the **TXT record name** (looks like
`google._domainkey.signalstudio.ie` or just `google._domainkey`
depending on what Google shows) and the **TXT record value** (a long
string starting with `v=DKIM1; k=rsa; p=...`) into chat.

That's the handoff. Stop there.

---

## My part (~5 minutes)

I'll add the TXT record to `signalstudio.ie` via the Vercel DNS API
using the token at `~/Library/Application Support/com.vercel.cli/auth.json`.
Direct API call:

```
POST https://api.vercel.com/v2/domains/signalstudio.ie/records
  ?teamId=team_veMY72ml10cAawsR0CjN9k5y
Authorization: Bearer <token>
{
  "name": "google._domainkey",
  "type": "TXT",
  "value": "<paste the long DKIM value here>"
}
```

I'll confirm the record was created and report back with the record ID
and a `dig` verification.

---

## Your part again (~2 minutes, after ~10 min DNS propagation)

### 5 · Verify DNS propagation

Run from a terminal:

```sh
dig +short TXT google._domainkey.signalstudio.ie
```

You should see the DKIM value echoed back. If it returns nothing, wait
another 5 minutes and retry. (Vercel DNS is usually faster than
Google's stated 48-hour propagation window — typically 10–30 minutes.)

### 6 · Activate in Google admin

Return to `admin.google.com/ac/apps/gmail/authenticateemail`. Click
**Start authentication**.

The status should flip from *"Not authenticating email"* to
*"Authenticating email"* within ~1 minute.

### 7 · Confirm it works

Send a test email from `hello@signalstudio.ie` (or from `ethan@`
with the alias) to your own Gmail inbox. Open the message, click the
three-dot menu, choose **Show original**. In the headers, look for:

```
Authentication-Results: ...
  spf=pass ...
  dkim=pass header.i=@signalstudio.ie ...
  dmarc=pass ...
```

All three `pass`. That's the goal. If `dkim=fail` or `dkim=none`,
wait 15 more minutes and retry — DKIM lookup is sometimes cached and
flips after the next message.

---

## Optional follow-up (~2 minutes)

If you haven't already, set up Gmail's **Send mail as** so outbound
mail visibly comes from `hello@` rather than `ethan@`:

`Gmail → Settings (gear) → See all settings → Accounts → Send mail as
→ Add another email address`

Add `hello@signalstudio.ie`, choose **Treat as an alias**, send the
verification, click the link. Done.

---

## What this unblocks

- **Sinéad email at Lamb's Hill** — DKIM-pass means the email lands
  in Sinéad's primary inbox and not Promotions. Runbook gate #3 in
  `signal-growth/outbound/lambs-hill-pilot-send.md` closes.
- **Signal daily briefing emails** — the briefing engine sends
  from `hello@`. DKIM-pass measurably improves inbox placement vs
  SPF-only-signed mail. Recipients with strict filters (Outlook,
  most corporate Gmail with `dmarc=p=quarantine`) currently get the
  briefing into spam.
- **DMARC tightening** — once DKIM is live and stable for 2 weeks,
  the DMARC policy can move from `p=none` (monitoring) to
  `p=quarantine`. Not in scope here; flagged as the natural follow-up.

---

## If it doesn't work

The most common failure modes:

| Symptom | Likely cause | Fix |
|---|---|---|
| `dig` returns nothing after 30 min | TXT record not propagated, or wrong name | Re-check the record name. The Google admin sometimes shows `google._domainkey` and sometimes the full `google._domainkey.signalstudio.ie` — Vercel needs the short form (`google._domainkey`). |
| `dkim=none` in headers | Google admin hasn't been told to start authenticating | Click **Start authentication** in admin (step 6). |
| `dkim=fail` in headers | TXT value has wrong content — possibly a quote-escaping issue | Compare the Vercel record value with the Google admin value byte-for-byte. Google's value sometimes wraps to multiple lines in the admin UI — Vercel needs it as one continuous string with no line breaks. |
| `dkim=pass` but mail still in spam | DKIM is fine; the issue is sender reputation / no warmup | Send 5–10 messages over 3–4 days to mark-as-not-spam in your own Gmail; the reputation builds. |

If anything else fails, paste the **Authentication-Results** header
back to me and I'll diagnose.

---

## Sources

- [Set up DKIM — Google Workspace Admin Help](https://support.google.com/a/answer/174124)
- [Turn on DKIM for your domain — Google Workspace Admin Help](https://support.google.com/a/answer/180504)
