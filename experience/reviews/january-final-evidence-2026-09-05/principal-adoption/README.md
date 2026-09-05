# Principal composition receipt

At candidate `50908e0620b3664eb23420919e1540cb98067235`, full Studio typecheck
and test pass through all14 declared commands, paired with App candidate
`313fbc560d28e1833e7803992624f7d868d0a421`. The five direct evidence-adoption
commands pass: focused receipt tests,188 January attestation,20 Venue Kit
attestation,328 portable extension verification and scoped Studio registry.
Exact commands, times, exit codes and logs are in the two adjacent folders.

Runtime/config source has no diff from `ee0fb632` and retains digest
`38ec727e72c0182f8d31c586ee11ad930e01893ec8eb0f50f54649019c63de1c`.
The earlier normal builds and captured screenshots therefore remain attached to
the same product inputs. The production audit is the unchanged candidate
lockfile audit atfcb528f1: zero reported advisories, no package changes afterward.

The Atlas16/36 current-source gate is incomplete, as described in
`atlas-renewal-block.md`. No rejected server start is retried. Its CI step remains
intact. This receipt does not claim a green full Design workflow, independent
review closure, actual provider/human acceptance or production readiness.
