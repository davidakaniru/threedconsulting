# Parent session join window

The Parent Portal exposes **Join meeting** only during the allowed window: from 5 minutes before the scheduled start until the scheduled end. The UI reevaluates the window every second.

The visible button points to an authenticated parent join endpoint rather than exposing the external meeting URL. The endpoint verifies parent ownership, scheduled session status, and the same time window before redirecting to the meeting link. Session times are interpreted in the product timezone (`Africa/Lagos`, UTC+01:00).
