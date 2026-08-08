# Merge-based checkpoint note

RC-1 includes tombstone files for retired cohort and pre-pivot enrolment modules. This is intentional: when a checkpoint ZIP is extracted over an existing project, ZIP omission does not delete old files. The tombstones overwrite those stale TypeScript files so they cannot remain in the compiler graph.
