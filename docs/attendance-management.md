# Attendance Management

Phase 8.1 adds teacher-managed attendance sheets on top of the automatically generated `session_attendance` records.

- Attendance can be edited only for scheduled or completed sessions.
- The teacher must own the session's active teaching assignment.
- The complete sheet is saved atomically through `update_session_attendance`.
- Teachers can mark everyone present and then adjust exceptions.
- Session summaries update immediately after saving.
