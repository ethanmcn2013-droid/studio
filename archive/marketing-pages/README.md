# Archived marketing pages

Twelve route directories pulled out of `src/app` on 2026-09-11 to take the
public estate down to its launch-ready core. The code is unchanged; it is
simply no longer a route.

Nothing here is built, typechecked, or linted — `tsconfig.json` and
`eslint.config.js` both exclude `archive/`.

| Directory | Was | Coming back |
| --- | --- | --- |
| `notes/` `tasks/` `timeline/` | The three product pages | At launch |
| `venues/` | The Founding 25 wedge | When the founding-venue campaign runs |
| `students/` | Student programme | When the student-projects campaign runs |
| `dispatch/` `changelog.rss/` | The dispatch and its feed | Operator's call |
| `features/` | The daily-briefing page | Folded into the launch story |
| `security/` `accessibility/` | Trust pages | Operator's call |
| `changelog/` `signal/` | Redirect stubs | No — their redirects moved to `next.config.ts` |

## Putting one back

```bash
git mv archive/marketing-pages/<name> src/app/<name>
```

Then re-add it to `src/app/sitemap.ts`, drop its rule from the `redirects()`
block in `next.config.ts`, and link it from the nav or footer. A page that is
not linked from either does not belong in the sitemap.
