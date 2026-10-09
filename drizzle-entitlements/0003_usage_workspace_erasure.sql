CREATE TABLE usage_workspace_erasure_tombstones (
 epoch TEXT NOT NULL CHECK(length(epoch)=8),
 workspace_id_hash TEXT NOT NULL CHECK(length(workspace_id_hash)=32),
 erased_at INTEGER NOT NULL,
 PRIMARY KEY(epoch,workspace_id_hash)
);
