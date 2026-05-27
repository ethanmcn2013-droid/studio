# Venue Link Dry Run - 2026-05-27

Status: passed route check
Owner: operator
Boundary: this was a technical link check only. No emails were sent and no venue contact forms were submitted.

---

## Result

| Check | Result |
| --- | --- |
| Wave 1 venues checked | 12 |
| Links checked per venue | 3 |
| Total links checked | 36 |
| Passing links | 36 |
| Failed links | 0 |
| Method | `HEAD`, no form submission |
| Live domain | `https://signalstudio.ie` |

---

## Route Summary

| Route type | Expected | Result |
| --- | --- | --- |
| Venue page | `/venues` with campaign, audience, touch, and venue query fields. | 12/12 returned 200. |
| Venue demo | `/venues/demo` with campaign, audience, touch, and venue query fields. | 12/12 returned 200. |
| Contact path | `/contact?subject=founding-venue` with campaign, audience, touch, and venue query fields. | 12/12 returned 200. |

---

## Per-Venue Result

| Venue slug | Venue page | Demo | Contact |
| --- | --- | --- | --- |
| `tankardstown` | 200 | 200 | 200 |
| `ballymagarvey` | 200 | 200 | 200 |
| `clonabreany` | 200 | 200 | 200 |
| `boyne-hill` | 200 | 200 | 200 |
| `the-millhouse` | 200 | 200 | 200 |
| `rathsallagh` | 200 | 200 | 200 |
| `bellingham-castle` | 200 | 200 | 200 |
| `darver-castle` | 200 | 200 | 200 |
| `markree-castle` | 200 | 200 | 200 |
| `castle-leslie` | 200 | 200 | 200 |
| `cliff-at-lyons` | 200 | 200 | 200 |
| `kilkea-castle` | 200 | 200 | 200 |

---

## Remaining Before Send

| Item | Reason |
| --- | --- |
| Verify the official venue contact path on send day. | Venue websites change and this dry run only covers Signal-owned links. |
| Replace `[video_30s_link]` and `[pdf_link]` with approved live assets. | Draft emails currently contain placeholders. |
| Confirm contact attribution capture after form submission if a form is used. | This dry run did not submit any contact forms. |

