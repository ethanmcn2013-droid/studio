# Initial performance baseline · 2026-07-11

This is an artifact baseline, not a Core Web Vitals result. It must not be
used as a client-download budget until route-level gzip and browser measurements
are captured.

| App | Next version | Static JS files | Static JS raw total | Largest static JS file |
|---|---:|---:|---:|---:|
| Studio | 16.2.5 | 106 | 4,395.2 KB | 571.6 KB |
| Notes | 16.2.5 | 29 | 1,370.3 KB | 239.7 KB |
| Tasks | 16.2.4 | 61 | 2,361.8 KB | 202.5 KB |
| Timeline | 16.2.4 | 35 | 1,291.4 KB | 198.6 KB |
| Signal | 16.2.4 | 30 | 1,385.0 KB | 240.0 KB |

The totals include every built static JavaScript artifact under `.next/static`,
not one route’s initial payload. They establish a repeatable comparison point.

Observed production builds passed for all five apps. Timeline’s measured local
wall-clock build was 22.2 seconds on this Windows machine. Prior parallel build
observations were approximately Studio 63.4s, Notes 31.1s, Tasks 72.1s, and
Signal 38.6s; rerun with one standardized harness before using them as a trend.

Still required: browser Web Vitals, route-level gzip, font transfer, auth
redirect timing, database query timing/counts, cross-product latency, and
cold-start measurements.
