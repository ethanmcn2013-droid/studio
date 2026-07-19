# Competitor review: how the best studios design email

Internal design research for the Signal Studio email system (Hairline direction).
Researched 2026-07-16. Companion to email-principles.md and design-exploration.md.

Hairline, for reference: engraved monochrome, one column max 520px, ink #111111 on paper #ffffff, one indigo #4F46E5 accent (wordmark dot and clickable links), Geist with Helvetica fallback, mono uppercase metadata labels, tabular figures, 1px ink-ruled buttons with no fills, exact facts in key-value rows, composed plain-text twins, no tracking pixels, no marketing in transactional mail.

---

## 1. Method and sources

Method: web search plus page fetches across email galleries (Really Good Emails, Page Flows, React Email template recreations), vendor documentation (Stripe, Vercel, Figma, Airbnb, Ghost, Postmark, Resend), first-party statements of philosophy (HEY, Basecamp, Fathom), and current deliverability standards (RFC 8058). Every claim below traces to one of these sources. Where a live specimen could not be inspected directly, the finding is marked "not verified against a live example" and treated as directional, not canon.

Sources used:

- Stripe receipt on Really Good Emails, with editor critique: https://reallygoodemails.com/emails/transactional-email-design-from-stripe/info
- Stripe email galleries: https://pageflows.com/emails/product/stripe/
- Stripe receipts and invoice email docs: https://stripe.com/docs/receipts and https://docs.stripe.com/invoicing/send-email
- Stripe failed-payment (dunning) emails: https://docs.stripe.com/billing/revenue-recovery/customer-emails and https://stripe.com/resources/more/dunning-emails-101-what-theyre-for-and-how-to-write-them
- Linear email gallery (onboarding, login verification, invites, issue reminders, 2020-2023): https://pageflows.com/emails/product/linear/
- Linear invite flow docs and changelog: https://linear.app/docs/invite-members and https://linear.app/changelog/2021-09-03-easier-invites-and-webhook-improvements
- Linear changelog as an email newsletter (Revue era): https://newsletter.linear.app/issues/linear-changelog-easier-invites-webhook-improvements-and-multi-team-boards-730162
- Vercel notification and alert docs: https://vercel.com/docs/notifications and https://vercel.com/docs/alerts
- Vercel usage notification thresholds: https://vercel.com/changelog/usage-notification-settings-is-now-generally-available and https://vercel.com/changelog/anomaly-alerts-now-available-via-email
- How Vercel builds email (React Email, Figma-designed, componentized headers and footers): https://resend.com/blog/how-vercel-uses-react-email-for-next-js-conf
- React Email community recreations (Vercel Invite User, Linear Login Code, Apple Receipt, Stripe Welcome, Notion Magic Link, Raycast Magic Link, Slack Confirm Email, Yelp Recent Login, GitHub Access Token): https://react.email/templates
- Slack invitation email specimen: https://reallygoodemails.com/emails/invitation-email-from-slack
- Figma notification preferences and digest behavior: https://help.figma.com/hc/en-us/articles/360039813234-Manage-your-notification-preferences and consolidated comment notifications: https://forum.figma.com/suggest-a-feature-11/launched-consolidated-comment-notification-emails-35367
- Apple sign-in alert contents, quoted verbatim in Apple Community threads: https://discussions.apple.com/thread/6522332 and https://discussions.apple.com/thread/255219469
- Superhuman onboarding playbook (First Round): https://review.firstround.com/superhuman-onboarding-playbook/
- Arc newsletter specimen: https://www.audienceful.com/example/arc-browser-newsletter and Arc release-notes culture: https://remi.space/blog/5-product-lessons-from-the-success-of-the-arc-browser
- Raycast newsletter and changelog: https://www.raycast.com/newsletter and review: https://hi.ducalis.io/changelog/examples/raycast-changelog
- Airbnb booking confirmation behavior: https://www.airbnb.com/help/article/1561 and confirmation-email information hierarchy guidance: https://www.roommaster.com/blog/booking-confirmation-email and https://bnbforms.com/blog/hotel-booking-confirmation-email-templates/
- HEY on spy pixels: https://www.hey.com/spy-trackers/ and https://www.hey.com/features/spy-pixel-blocker/
- Basecamp removing pixel trackers: https://signalvnoise.com/svn3/marking-the-end-of-pixel-trackers-in-basecamp-emails/
- Fathom on tracking: https://usefathom.com/blog/spy and the pledge list: https://notospypixels.com/
- Fathom and Tuple plain-text specimens with commentary: https://userlist.com/blog/saas-plain-text-emails/
- Ghost newsletter design settings, including "Simple emails ... look more like personal letters": https://ghost.org/help/email-design/ and https://ghost.org/changelog/newsletter-design/
- Postmark 15 transactional best practices (updated 2026): https://postmarkapp.com/guides/transactional-email-best-practices
- Postmark on sending calendar invites: https://postmarkapp.com/support/article/1101-how-do-i-send-calendar-invites-with-postmark
- Add-to-calendar links vs .ics attachments: https://www.litmus.com/blog/how-to-create-an-add-to-calendar-link-for-your-emails and https://add-to-calendar-pro.com/articles/ics-file-generation-for-email-marketing-453efa1d
- RFC 8058 one-click unsubscribe and the 2024 Gmail/Yahoo mandate: https://www.mailgun.com/blog/deliverability/what-is-rfc-8058/ and https://willitinbox.com/blog/list-unsubscribe-header-one-click
- Sign-in alert email anatomy: https://tabular.email/blog/sign-in-alert-email-templates
- Dark mode in email, gotchas and the plain-text escape hatch: https://www.litmus.com/blog/the-ultimate-guide-to-dark-mode-for-email-marketers and https://www.campaignmonitor.com/resources/guides/dark-mode-in-email/ and a typographic light/dark template walkthrough: https://frontendmasters.com/blog/simple-typographic-email-template/

Verification limits, stated plainly:

- Notion invite emails: behavior confirmed in Notion's help docs (https://www.notion.com/help/add-members-admins-guests-and-groups) but no inspectable live specimen was found. Findings for Notion are thin and marked as such.
- The Slack invitation specimen on Really Good Emails is an image; the page text did not transcribe its copy, so layout observations for Slack lean on the React Email "Slack Confirm Email" recreation and the RGE listing rather than a full teardown.
- Apple does not publish its email templates. The security-alert anatomy is reconstructed from users quoting the emails verbatim in Apple Community threads plus the React Email "Apple Receipt" recreation. Treat exact Apple layout claims as approximate.
- Booking.com: no inspectable specimen found in this pass; the confirmation-email findings below draw on Airbnb documentation and hospitality-sector information-hierarchy guidance instead.

---

## 2. Per-company findings

### Stripe

What it does well. The canonical receipt: a short declarative headline, the amount as the largest object on the page, then a small table of exact facts (date, payment method, receipt number), rendered cleanly on desktop and mobile (https://reallygoodemails.com/emails/transactional-email-design-from-stripe/info). The RGE editors' only criticism is the lack of a printer-friendly version, which is telling: the design itself is treated as settled law. Stripe's failed-payment emails carry one job and one link, to a hosted page where the customer fixes the card (https://docs.stripe.com/billing/revenue-recovery/customer-emails). Stripe's own dunning guidance says open calmly, state the fact, offer the fix, no blame (https://stripe.com/resources/more/dunning-emails-101-what-theyre-for-and-how-to-write-them). Receipts also exist as hosted, linkable artifacts, not just email bodies (https://stripe.com/docs/receipts).

What Signal Studio refuses from Stripe. Stripe's receipts are merchant-branded with color fills and logo headers because Stripe is infrastructure wearing someone else's clothes. Hairline keeps the ruled monochrome page and lets the facts carry the brand. Also refused: Stripe's habit of letting the merchant inject upsell modules into billing mail.

### Linear

What it does well. Restraint across an entire system. The Page Flows archive (2020-2023) shows login codes, invite emails, issue-due reminders and workspace notices that are near-identical in register: minimal layout, one action, contextual subject lines like "Issue due today" (https://pageflows.com/emails/product/linear/). The changelog was literally a newsletter: Linear shipped its changelog as an email issue with the same section order as the web page, changes first, commentary second (https://newsletter.linear.app/issues/linear-changelog-easier-invites-webhook-improvements-and-multi-team-boards-730162). Invite emails are engineered for the failure cases: the link works even if you are signed into the wrong account (https://linear.app/changelog/2021-09-03-easier-invites-and-webhook-improvements). The React Email community keeps a "Linear Login Code" recreation, a sign that its verification email is considered a reference design (https://react.email/templates).

What Signal Studio refuses from Linear. Linear's dark-first gradient aesthetic. Signal Studio is light-locked and Hairline is paper and ink; the discipline transfers, the palette does not.

### Vercel

What it does well. Emails as typed events. Deploy failures notify the deploy creator specifically, not the whole team (https://vercel.com/docs/notifications). Usage mail fires at declared thresholds the customer can configure, percentage or absolute dollar values, so an alert is a contract being honored rather than a surprise (https://vercel.com/changelog/usage-notification-settings-is-now-generally-available). Structurally, Vercel designs email in Figma and builds it from React Email components, reusing header and footer primitives across every template (https://resend.com/blog/how-vercel-uses-react-email-for-next-js-conf). The community recreation of "Vercel Invite User" is a single column, avatar-free facts, one button (https://react.email/templates).

What Signal Studio refuses from Vercel. Volume. Vercel's notification surface is wide because its audience is on-call engineers. Signal Studio's audience is the 80 percent; fewer, better emails, and Postmark's rule applies: know when not to send at all (https://postmarkapp.com/guides/transactional-email-best-practices).

### Notion, Figma, Slack

What they do well. Figma's lesson is consolidation and control: comment notifications were consolidated into fewer emails after user pressure (https://forum.figma.com/suggest-a-feature-11/launched-consolidated-comment-notification-emails-35367), and its preference model is a clean three-position switch, everything, just mentions and replies, nothing (https://help.figma.com/hc/en-us/articles/360039813234-Manage-your-notification-preferences). Slack's invitation email is a long-standing gallery staple built around one sentence of context, who invited you and to what, and one button (https://reallygoodemails.com/emails/invitation-email-from-slack; full copy not transcribable from the listing, see method notes). Notion's invite behavior is documented (email with a join link, member shows as Invited until accepted, https://www.notion.com/help/add-members-admins-guests-and-groups) but no live specimen was verified; the React Email "Notion Magic Link" recreation suggests the same minimal one-link register (https://react.email/templates).

What Signal Studio refuses from them. Slack's illustrated brand headers and playful color blocks, Notion's emoji-forward tone. Also refused: the default-on notification firehose that Figma had to walk back; Signal Studio starts consolidated instead of retrofitting it.

### Superhuman, Arc, Raycast

What they do well. Personality without noise, each differently. Superhuman's famous onboarding was not an email sequence at all, it was a human: concierge calls, personalization to the user's actual workflow (https://review.firstround.com/superhuman-onboarding-playbook/). The portable lesson is that the highest-status onboarding move is a human who answers. Arc's newsletter is repeatedly cited as unusually clean and personal, release notes with an authored voice and non-product milestones woven in (https://www.audienceful.com/example/arc-browser-newsletter, https://remi.space/blog/5-product-lessons-from-the-success-of-the-arc-browser). Raycast's monthly email pairs a disciplined changelog with small human sections, new teammates, team picks, and reads cleanly on any device (https://www.raycast.com/newsletter, https://hi.ducalis.io/changelog/examples/raycast-changelog). Raycast's magic-link email is another React Email community reference (https://react.email/templates).

What Signal Studio refuses from them. Arc's video-creator register and meme energy, Raycast's emoji headers. Hairline's personality budget is spent on precision of voice and one indigo dot, not on decoration.

### Apple

What it does well. The reference register for quiet trust. The sign-in alert, as quoted verbatim by recipients, states the exact fact: your Apple ID was used to sign in to iCloud via a web browser, with date and time, and on device alerts the device type and name (https://discussions.apple.com/thread/6522332, https://discussions.apple.com/thread/255219469). Then the two-path close: "If the information above looks familiar, you can ignore this message." If not, go to appleid.apple.com and change your password. No red banners, no countdowns, no fear. The absence of urgency theatre is itself the security signal, and the community threads show users have learned to identify phishing partly by its excess. Apple's receipts are dense line-item tables under a small grey wordmark, familiar enough that React Email keeps a recreation (https://react.email/templates); exact layout not verified against a live specimen.

What Signal Studio refuses from Apple. Nothing in register. Refused only in mechanics: Apple's receipts bury the unsubscribe-adjacent preferences in tiny grey type across multiple legal lines; Hairline's footer states plainly why you received the mail and what each link does.

### Airbnb and the booking-confirmation genre

What they do well. Information architecture under stress. A confirmation is read at a gate, in a taxi, on hotel wifi. Airbnb sends a confirmation to the account email on every booking, and the artifact is retrievable later from the account (https://www.airbnb.com/help/article/1561). The genre's settled hierarchy: confirmation statement first, key details second (dates, times, address, confirmation number, payment status), action third, support contact fourth, everything else cut, because most readers give the email 3 to 5 seconds and roughly 60 percent open on a phone (https://www.roommaster.com/blog/booking-confirmation-email, https://bnbforms.com/blog/hotel-booking-confirmation-email-templates/). No Booking.com specimen was verified in this pass; the sector guidance stands in for it.

What Signal Studio refuses from them. Everything after the facts: the map images, the cross-sell carousels ("book a car, book an experience"), the loyalty-program nudges. A Hairline confirmation ends where the facts end.

### Indie and premium: HEY, Basecamp, Fathom, Tuple, Ghost

What they do well. The ethics layer, stated in public. HEY blocks and names spy pixels and never embeds trackers in outbound mail (https://www.hey.com/spy-trackers/). Basecamp removed pixel trackers from its own email because no internal use case justified surveilling every reader (https://signalvnoise.com/svn3/marking-the-end-of-pixel-trackers-in-basecamp-emails/). Fathom did the same and signed the public pledge (https://usefathom.com/blog/spy, https://notospypixels.com/). Signal Studio's no-tracking rule has company, and that company says it out loud, which is the part worth copying. Fathom and Tuple both send composed plain-text mail: Fathom's trial email is plain text with everything needed to start, Tuple's is a well-formatted plain-text letter with a personalized greeting, a named human sender, a single CTA near the end and a postscript (https://userlist.com/blog/saas-plain-text-emails/). Ghost productized the letter register: its "Simple emails" setting sends member mail that looks like a personal note rather than a template (https://ghost.org/help/email-design/).

What Signal Studio refuses from them. Basecamp's occasional combative editorializing inside product mail. The ethics are stated once, in the footer and on a policy page, not performed in every message.

### Cross-cutting craft standards

Postmark's guide, updated for 2026, is the closest thing to a professional code: absolute dates and times rather than "today", accept replies and route them to humans, state why the recipient is receiving the message, strip heavy branding from frequent notifications, never send an empty digest, ship a well-formatted plain-text version with links on their own lines (https://postmarkapp.com/guides/transactional-email-best-practices). On dark mode, the industry consensus is that clients invert unpredictably, images and fills break first, text survives best, and plain or near-plain typographic email inherits the reader's theme gracefully (https://www.litmus.com/blog/the-ultimate-guide-to-dark-mode-for-email-marketers, https://frontendmasters.com/blog/simple-typographic-email-template/). Hairline's ink-on-paper with no fills is close to the safest possible dark-mode posture; the one watch item is the indigo link color, which must keep contrast when Apple Mail or Gmail inverts the background. On unsubscribe, RFC 8058 one-click headers have been mandatory for bulk senders at Gmail and Yahoo since 2024; transactional mail is exempt, but digests and changelogs are not (https://www.mailgun.com/blog/deliverability/what-is-rfc-8058/, https://willitinbox.com/blog/list-unsubscribe-header-one-click).

---

## 3. Worth stealing: ranked patterns

Each entry: the pattern, who does it, why it delights, how it maps into Hairline, effort.

1. The amount is the headline; the facts are a table.
   Who: Stripe receipts (https://reallygoodemails.com/emails/transactional-email-design-from-stripe/info); Apple's dense receipt tables (https://react.email/templates).
   Why: a receipt answers one question, how much, then survives scrutiny on every other field. The big-number-plus-ledger shape reads in one second and files well forever.
   Hairline mapping: amount set large in Geist with tabular figures, then key-value rows under mono uppercase labels (DATE, METHOD, RECEIPT Nº, VAT), hairline rules between rows. No logo header needed; the wordmark dot is the only color.
   Effort: small.

2. Every receipt has a hosted twin.
   Who: Stripe, whose receipts and invoices exist as linkable hosted pages and PDFs (https://stripe.com/docs/receipts); RGE's one critique of the Stripe email was the missing print path.
   Why: email clients mangle; a canonical URL never does. Accountants, expense tools and future selves all want the durable copy.
   Hairline mapping: one indigo link in the receipt, "View this receipt", pointing to a print-clean hosted page in the same engraved register. Solves printing without adding an email variant.
   Effort: medium.

3. Security mail states device, location, time, exactly, then offers the calm two-path close.
   Who: Apple ("Your Apple ID was used to sign in to iCloud via a web browser", date and time, device name, then "If the information above looks familiar, you can ignore this message", https://discussions.apple.com/thread/6522332); the genre anatomy at https://tabular.email/blog/sign-in-alert-email-templates.
   Why: exactness is the trust signal. Users now read urgency theatre as phishing; the calm register is both safer and higher status.
   Hairline mapping: key-value rows, DEVICE, LOCATION, TIME (absolute, with timezone per Postmark), then two sentences: this was probably you, here is what to do if it was not. One ruled button. Voice already matches.
   Effort: small.

4. One email, one action, and the link engineered for the messy case.
   Who: Linear, whose invite links work even when the recipient is signed into the wrong account (https://linear.app/changelog/2021-09-03-easier-invites-and-webhook-improvements); Stripe's failed-payment mail with a single hosted fix-it link (https://docs.stripe.com/billing/revenue-recovery/customer-emails).
   Why: the email is only as good as what happens after the click. Perceived quality dies on a "wrong account" error page, not in the layout.
   Hairline mapping: one 1px ruled button per email, maximum; invite and verification links must survive wrong-account, already-accepted and expired states with a decent hosted page for each.
   Effort: medium (the work is in the link handling, not the template).

5. Reply and a human answers.
   Who: Postmark's explicit best practice, accept replies and process them (https://postmarkapp.com/guides/transactional-email-best-practices); Tuple's plain-text letters from a named human (https://userlist.com/blog/saas-plain-text-emails/); the spirit of Superhuman's concierge onboarding (https://review.firstround.com/superhuman-onboarding-playbook/).
   Why: no-reply@ is the single loudest "we do not want to hear from you" a product can send. A monitored reply path is cheap and reads as premium confidence.
   Hairline mapping: send from a real address, put one footer line in ink: "Reply to this email and a person answers." That sentence is on voice already.
   Effort: small to start, medium to staff honestly.

6. The composed plain-text twin as a first-class artifact.
   Who: Fathom and Tuple, whose plain-text mail is deliberately typeset with spacing, dividers and links on their own lines (https://userlist.com/blog/saas-plain-text-emails/); Postmark codifies the formatting rules (https://postmarkapp.com/guides/transactional-email-best-practices); Ghost productized the letter register (https://ghost.org/help/email-design/).
   Why: the plain-text part is what screen readers, watches, terminals and strict clients show. A composed twin also inherits dark mode perfectly, which Litmus identifies as the failure-free path (https://www.litmus.com/blog/the-ultimate-guide-to-dark-mode-for-email-marketers).
   Hairline mapping: already a locked rule; steal the craft details, mono-style label lines, hairline dividers as rows of hyphens at consistent width, one blank line before any URL, URL always bare on its own line.
   Effort: small.

7. Absolute time, always, with timezone.
   Who: Postmark, verbatim best practice: absolute dates and times, never "today", because email is read late (https://postmarkapp.com/guides/transactional-email-best-practices).
   Why: "in 2 hours" is false by the time it is read. Exactness is Hairline's whole game; relative time is a small lie the system cannot afford.
   Hairline mapping: every timestamp as a key-value row, e.g. EXPIRES · 18 Jul 2026, 14:00 IST. For expiring links, state the fixed expiry moment rather than a countdown; this is the honest version of urgency.
   Effort: small.

8. Deadlines ship with a calendar artifact.
   Who: pattern from the events world, supported natively by Postmark (https://postmarkapp.com/support/article/1101-how-do-i-send-calendar-invites-with-postmark); Litmus recommends per-client add-to-calendar links alongside the .ics (https://www.litmus.com/blog/how-to-create-an-add-to-calendar-link-for-your-emails); Add to Calendar PRO documents why hosted links beat static attachments on timezone correctness and deliverability (https://add-to-calendar-pro.com/articles/ics-file-generation-for-email-marketing-453efa1d).
   Why: for a Tasks and Timeline product, a due date that lands in the reader's own calendar is the email doing real work. Almost no competitor in this set does it; it is an open lane.
   Hairline mapping: an indigo text link, "Add to calendar", pointing to a hosted per-client chooser, with a generated .ics behind it. No button chrome needed, it is a secondary action.
   Effort: medium.

9. Notifications strip branding; account mail keeps it.
   Who: Postmark's design-by-context rule, heavy branding for account messages, near-none for frequent notifications (https://postmarkapp.com/guides/transactional-email-best-practices); visible in Linear's uniform minimal notices (https://pageflows.com/emails/product/linear/).
   Why: the fifth notification of the week should cost the reader almost nothing. Repetitive chrome trains people to skim past everything, including the content.
   Hairline mapping: define two weights of the same template, Letter (wordmark, full footer) for receipts, security and onboarding, and Slip (no wordmark, one-line footer) for notifications and digests. Same rules, same type, less furniture.
   Effort: small.

10. The digest that refuses to send when empty, and batches when busy.
    Who: Postmark, know when not to send (https://postmarkapp.com/guides/transactional-email-best-practices); Figma's consolidation of comment notifications after the firehose failed (https://forum.figma.com/suggest-a-feature-11/launched-consolidated-comment-notification-emails-35367).
    Why: every skipped empty email raises the open rate and the trust of the ones that do send. Density is a feature: a digest should be a ledger, not a feed.
    Hairline mapping: digests render as ruled key-value ledgers, n items or nothing; below a threshold of activity the digest silently does not go out. Preference model copied from Figma's three positions: everything, mentions only, nothing.
    Effort: medium.

11. Changelog restraint: changes first, in the product's own order, commentary after.
    Who: Linear's changelog-as-newsletter mirroring the web changelog (https://newsletter.linear.app/issues/linear-changelog-easier-invites-webhook-improvements-and-multi-team-boards-730162); Raycast's monthly, feature list first, human notes after (https://www.raycast.com/newsletter, https://hi.ducalis.io/changelog/examples/raycast-changelog); Arc's authored voice as the seasoning, not the meal (https://www.audienceful.com/example/arc-browser-newsletter).
    Why: readers open a changelog to learn what changed. Respecting that first buys permission for one short human paragraph at the end, which is where personality belongs.
    Hairline mapping: dated mono label per entry (2026-07-16 · TIMELINE), one-line change statements, hairline rules between products, an optional closing note in first person. One image only if a change is genuinely visual, per the load-bearing rule.
    Effort: small.

12. The honest footer: why you got this, what each link does.
    Who: Postmark, clearly identify the source and reason (https://postmarkapp.com/guides/transactional-email-best-practices); the anti-tracking cohort states its ethics in public (https://www.hey.com/spy-trackers/, https://signalvnoise.com/svn3/marking-the-end-of-pixel-trackers-in-basecamp-emails/, https://usefathom.com/blog/spy).
    Why: the footer is where most senders hide; stating plainly "You received this because you created a Signal account" plus "This email contains no tracking" converts a legal zone into a brand zone.
    Hairline mapping: two to three short ink lines under a hairline rule, no grey mouse-type. One line for reason, one for the no-tracking fact linking to the policy page, one for preferences where applicable.
    Effort: small.

13. One-click unsubscribe done at the header level, and instantly.
    Who: RFC 8058, mandatory for Gmail and Yahoo bulk mail since 2024 (https://www.mailgun.com/blog/deliverability/what-is-rfc-8058/, https://willitinbox.com/blog/list-unsubscribe-header-one-click).
    Why: for digests and changelogs the client-level unsubscribe is now table stakes; honoring it instantly rather than in the allowed 48 hours is the premium version. Transactional mail is exempt and should carry no unsubscribe at all, which quietly signals the separation of registers.
    Hairline mapping: List-Unsubscribe and List-Unsubscribe-Post headers on every non-transactional stream, immediate effect, confirmation page in the engraved register, no guilt copy.
    Effort: small.

14. Confirmation hierarchy built for the 3-second phone read.
    Who: the booking genre, statement, key details, action, support, cut everything else (https://www.roommaster.com/blog/booking-confirmation-email); Airbnb's retrievable confirmation record (https://www.airbnb.com/help/article/1561).
    Why: confirmations are read under stress and re-read weeks later. Both reads want the same thing: the facts, findable in one glance.
    Hairline mapping: the first line states what happened in past tense ("Your workspace is ready."), key-value rows carry the exact facts, the single button carries the next step, the footer carries support. Already Hairline's shape; the steal is the discipline to cut everything after the facts.
    Effort: small.

15. A componentized email system, designed once, reused everywhere.
    Who: Vercel, Figma-designed templates built from shared React Email header and footer components (https://resend.com/blog/how-vercel-uses-react-email-for-next-js-conf); React Email's gallery proves the ecosystem treats minimal transactional layouts as reusable primitives (https://react.email/templates).
    Why: consistency at Linear's level is a build-system property, not a willpower property. One set of Hairline primitives makes every future email correct by default.
    Hairline mapping: a small internal kit, Rule, Row (label, value), Button (1px ink), Wordmark (with the indigo dot), FooterHonest, plus the plain-text renderer, shared across all four products.
    Effort: large (one-time), then every subsequent email becomes small.

---

## 4. Explicit refusals

Patterns observed in this research that Signal Studio must never adopt, tied to the locked rules.

- Tracking pixels and open tracking, in any mail, ever. The best independent senders removed them and said why (https://signalvnoise.com/svn3/marking-the-end-of-pixel-trackers-in-basecamp-emails/, https://www.hey.com/spy-trackers/, https://usefathom.com/blog/spy). Hairline rule: no tracking pixels. Measurement comes from delivery metrics and click-throughs to owned pages, nothing per-reader in the body.
- Marketing inside transactional mail. Stripe's ecosystem lets merchants bolt upsells onto receipts, booking confirmations carry cross-sell carousels. Refused: a receipt is a legal document, not a billboard. Locked rule already; this research confirms it is also a deliverability rule, since mixing registers pollutes sender reputation (https://postmarkapp.com/guides/transactional-email-best-practices).
- Urgency theatre: countdown timers, red banners, "act now" security copy. The Apple Community threads show users treat excess urgency as the phishing tell (https://discussions.apple.com/thread/255219469). Hairline states the fixed expiry time instead.
- Gradient or image headers and color-block heroes. Slack, Airbnb and most of the RGE gallery lead with brand furniture. Refused: one column of ink on paper, the wordmark dot is the only color. Bonus: no-fill typographic email is also the layout that survives dark-mode inversion (https://www.litmus.com/blog/the-ultimate-guide-to-dark-mode-for-email-marketers).
- Emoji in subject lines and rocket-ship changelog headers (common in the Raycast and Arc register). Refused by voice: calm, declarative, no exclamation marks.
- No-reply sender addresses. Refused per pattern 5; Postmark treats accepting replies as baseline craft.
- Empty or padding digests, "here's what you missed" mail with nothing in it. Refused per Postmark's know-when-not-to-send.
- Relative timestamps ("today", "in 2 hours"). Refused; absolute time with timezone, always.
- Guilt-trip unsubscribe flows and buried grey mouse-type footers. Refused; the footer is set in ink and the unsubscribe is one click and instant.
- Fake personalization ("We picked these just for you") and merge-field theatre. Personalization in Hairline is exact facts about the reader's own account, nothing more.

---

## 5. Verdict

Three moves would raise perceived quality most. First, ship the hosted-receipt twin and the Apple-register security email together: exact key-value facts (amount as headline; device, location, time) plus the calm two-path close, because these two messages are where trust is actually priced and where the Hairline register is already the strongest answer in the field rather than a compromise. Second, put "Reply to this email and a person answers" in the footer and mean it: no competitor in this set except the indie cohort does it, it costs one sentence, and it converts every transactional email into proof that a studio, not a system, is on the other end. Third, build the small component kit (Rule, Row, Button, Wordmark, FooterHonest, plain-text renderer) before writing the second email, because Linear-grade consistency is what separates a designed email system from a stack of nice emails, and it makes every future message correct by default.
