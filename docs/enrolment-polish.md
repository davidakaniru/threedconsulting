# Enrolment workflow polish

## Duplicate prevention
A parent cannot submit another pending or under-review application for the same child when any selected programme overlaps an existing application.

## Transactional email notifications
Approval and rejection notifications are sent through the Resend HTTP API when these environment variables are configured:

```env
RESEND_API_KEY=
TRANSACTIONAL_EMAIL_FROM="ThreeD Consulting <noreply@example.com>"
```

Email delivery is non-blocking: application approval or rejection still succeeds if email is not configured or delivery fails.

## Audit events
- `enrolment.submitted`
- `enrolment.approved`
- `enrolment.rejected`
