## 2026-05-19 · ships · Analytics stops looking broken on the way in

**Navigating into Analytics no longer shows a naked indigo dot on
white for three-and-a-half seconds — it now streams the chrome
instantly and the quiet day gives you somewhere to go. A recording
walkthrough caught it: there was no loading state anywhere under
Analytics, so the authed route blocked with zero streaming and a
stray dot read as a bug, not a load.**

Two byte-identical loading boundaries now paint the static dot and
stream the header immediately. The quiet-day empty state was a dead
end — "the board is clear" and nothing to do; it now carries one
calm line, a time anchor and a link back to the Tasks workspace,
without breaking the spare register.
