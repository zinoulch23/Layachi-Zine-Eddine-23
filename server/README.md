# DesignConnect PHP / MySQL backend

Copy of the database layer from `app changes/data bases/`. Use with XAMPP, WAMP, or `php -S localhost:8080` in this folder.

## Setup

1. Import `design_platform.sql` into MySQL (includes seed test accounts).
2. Edit `Database.php` if your MySQL user/password differ from `root` / empty.
3. Run `php setup.php` or import SQL manually.
4. Point the React app API base URL to `http://localhost:8080/api.php` when wiring production API calls.

## Seed logins (also work in the app’s local database)

| Email | Password | Role |
|-------|----------|------|
| testuser1@example.com | Password123 | Designer |
| demo.user@example.com | DemoPass | Client |
| sample@testdomain.com | Sample@2024 | Designer |

The Vite app uses **browser localStorage** (`src/services/database.ts`) by default so it runs without PHP. PHP files are for full MySQL deployment.
