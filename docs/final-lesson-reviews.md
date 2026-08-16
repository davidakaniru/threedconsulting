# Final feature — Parent lesson reviews

## Scope

- Parent can review a lesson assignment after at least one completed session.
- One review exists per lesson assignment.
- Parent can return later and edit the same review.
- Review captures:
  - overall rating (1–5);
  - lesson outcome / child's progress;
  - feedback about the teacher;
  - whether the parent would recommend the teacher;
  - optional additional comments.
- Admin can read all reviews and filter by teacher, programme, rating and submission date.
- Teacher has no review navigation, page or API access.
- Reviews are not exposed on the public website.

## Security

`lesson_reviews` has RLS enabled and no direct browser policy. Parent review reads/writes go through authenticated server routes which verify that the lesson assignment belongs to the signed-in parent. Admin review pages use authenticated Admin portal server rendering.

## Handoff cleanup

If the production test data is cleared before handoff, delete `public.lesson_reviews` before deleting `public.lesson_assignments`:

```sql
delete from public.lesson_reviews;
delete from public.lesson_assignments;
```

The foreign key also uses `ON DELETE CASCADE`, but explicit deletion keeps the handoff reset intention clear.
