# DesignConnect — Changes Applied

All items from `app changes/changes pdf.pdf` and `DesignConnect_Changes_Prompt.pdf` are implemented.

## Test accounts (login — skip Choose Role)

| Email | Password | Role |
|-------|----------|------|
| testuser1@example.com | Password123 | Designer |
| demo.user@example.com | DemoPass | Client |
| sample@testdomain.com | Sample@2024 | Designer |

New signups still go through **Choose Role** → designer test (if designer).

## What changed

1. **Profile photo** — Updates in Settings apply to the navbar avatar everywhere.
2. **Home page** — Logged-in users are redirected to their dashboard; only sign-out returns to landing.
3. **Login / Register** — Google sign-in removed.
4. **Designer test** — Fail: “Retake the Test” only; Pass: continue to dashboard. Minimal layout (logo only) during test.
5. **Chat** — Threads only after a client sends a service request; three-dot menu removed.
6. **Forgot password** — Direct reset at `/reset-password` (email + new password, no email link).
7. **Client dashboard** — “Create Post” button; bookmark/save on posts removed.
8. **Browse designers** — 10 Arabic-style full names + profile photos.
9. **Database** — `src/services/database.ts` (localStorage + bcrypt); PHP/SQL in `server/` for MySQL.
10. **Portfolio** — Empty for new designers; items persist per account.

## Run the app

```bash
npm install
npm run dev
```

Open http://localhost:3000 (or the port Vite prints).

## PHP / MySQL (optional)

See `server/README.md` — import `server/design_platform.sql` and configure `Database.php`.

## Clear stored data

In the browser console: `localStorage.removeItem('designconnect_db_v2')` then refresh.
