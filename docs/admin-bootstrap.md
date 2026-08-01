# One-time admin bootstrap

Do not commit the demo admin password to source control. Set it only temporarily in `.env.local` for the one-time bootstrap command.

For the agreed demo account, temporarily add these two variables to `.env.local`: 

```env
ADMIN_BOOTSTRAP_EMAIL=admin@threedconsulting.org
ADMIN_BOOTSTRAP_PASSWORD=<the agreed demo password>
```

Then run:

```bash
npm run bootstrap:admin
```

The script creates a confirmed Supabase Auth user and promotes only that newly-created profile to the `admin` role. Remove both `ADMIN_BOOTSTRAP_*` values from `.env.local` afterwards and change the demo password before any production deployment.
