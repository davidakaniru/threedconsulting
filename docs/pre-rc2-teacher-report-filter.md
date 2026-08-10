# Pre-RC2 — Teacher report filtering

The admin teacher activity report now requires a teacher selection and month. The teacher field reuses the existing searchable `ComboboxField`, with labels containing teacher name and generated teacher ID. Report queries are filtered by `lesson_assignments.teacher_id`, so only the selected teacher's sessions are loaded and displayed.
