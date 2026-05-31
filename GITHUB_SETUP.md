# Share this app on GitHub

Follow these steps once. After that, send your friend the **repository link** (and optionally the **live demo link**).

## 1. Create a GitHub account

If you do not have one: [https://github.com/signup](https://github.com/signup)

## 2. Install GitHub CLI (optional but easiest)

Download: [https://cli.github.com/](https://cli.github.com/)

Or use Git from: [https://git-scm.com/download/win](https://git-scm.com/download/win)

## 3. Open terminal in this folder

In Cursor: **Terminal → New Terminal** (it should already be in this project).

Or in File Explorer, open `zinou's app`, type `cmd` in the address bar, press Enter.

## 4. Push to GitHub

Run these commands **one at a time** (replace `YOUR_USERNAME` with your GitHub username):

```bash
git branch -M main
gh auth login
gh repo create zinou-app --public --source=. --remote=origin --push
```

(If you already ran `git init` and committed, skip those steps and only run the three lines above.)

If you do not use `gh`, create a new empty repo named `zinou-app` on [github.com/new](https://github.com/new), then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/zinou-app.git
git branch -M main
git push -u origin main
```

## 5. Links to send your friend

| What | Link |
|------|------|
| **Code (GitHub)** | `https://github.com/YOUR_USERNAME/zinou-app` |
| **Live demo** (after enabling Pages, see below) | `https://YOUR_USERNAME.github.io/zinou-app/` |

## 6. Turn on live demo (GitHub Pages) — optional

1. On GitHub, open your repo → **Settings** → **Pages**
2. Under **Build and deployment**, set **Source** to **GitHub Actions**
3. Push any commit to `main` — the workflow in `.github/workflows/deploy.yml` will publish the site

First deploy may take 2–5 minutes. Then share the Pages URL above.

## 7. Friend runs it locally

They clone and run:

```bash
git clone https://github.com/YOUR_USERNAME/zinou-app.git
cd zinou-app
npm install
npm run dev
```

---

**Tip:** If terminal commands fail because of the apostrophe in `zinou's app`, rename the folder to `zinou-app` (no apostrophe) and run the commands again.
