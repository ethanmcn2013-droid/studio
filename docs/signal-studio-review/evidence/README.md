# Remediation evidence

This directory stores compact, non-secret evidence receipts for the remediation
program. Keep credentials, tokens, personal data, and raw production dumps out
of this tree.

Each receipt should name the ledger item, date, branch/commit, command or URL,
result, and the next action when the result is not a pass. The validator reads
only the ledger; this directory is the durable audit trail linked from it.
