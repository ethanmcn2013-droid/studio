# Data classification and retention register

| Class | Examples | Default handling to ratify | Evidence required |
|---|---|---|---|
| Public projection | marketing content, explicitly shared view | retain while published; revoke immediately on request | projection schema and revocation test |
| Customer content | notes, tasks, timelines, briefings, templates | retain for account term plus documented deletion window | product deletion/export tests |
| Identity and membership | Clerk subject, email, roles, workspace membership | retain while account/contract exists; revoke on removal | Clerk + DB reconciliation |
| Secrets | DB/provider/OAuth tokens | encrypted, least privilege, rotate on schedule, never log | secret inventory and rotation receipt |
| Security events | actor/action/workspace/outcome/event ID | short operational retention with legal hold procedure | event schema, access and purge proof |
| Backups | encrypted database/export copies | documented retention and destruction schedule | restore and deletion evidence |

All free text is potentially personal data. School workspaces default to no public sharing and staff-focused use only; no pupil accounts, grading, attendance or student-record features are in scope for the school offering.

