CREATE TABLE usage_subject_workspaces (
 epoch TEXT NOT NULL CHECK(length(epoch)=8),
 subject_id_hash TEXT NOT NULL CHECK(length(subject_id_hash)=32),
 workspace_id_hash TEXT NOT NULL CHECK(length(workspace_id_hash)=32),
 sponsor_id TEXT NOT NULL REFERENCES sponsors(id),
 updated_at INTEGER NOT NULL,
 PRIMARY KEY(epoch,subject_id_hash,workspace_id_hash,sponsor_id)
);
--> statement-breakpoint
CREATE INDEX usage_subject_retention_idx ON usage_subject_workspaces(updated_at);
--> statement-breakpoint
CREATE TABLE usage_erasure_tombstones (
 epoch TEXT NOT NULL CHECK(length(epoch)=8),
 subject_id_hash TEXT NOT NULL CHECK(length(subject_id_hash)=32),
 erased_at INTEGER NOT NULL,
 PRIMARY KEY(epoch,subject_id_hash)
);
