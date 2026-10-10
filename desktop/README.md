# ChronicRx for Windows

A small Windows app (Electron) that opens the live ChronicRx dashboard,
<https://baydon-create.github.io/chronic-refill/>, in its own window with a desktop and Start-menu shortcut.
Changes merged to `main` reach the app the next time it starts. Nothing needs reinstalling.
If github.io is blocked or down, the app opens the copy of the dashboard built into it (made by `prepare.js` from
`index.html`), which still connects to the cloud data. That copy is refreshed whenever `index.html` changes on `main`.

**Download:** <https://github.com/baydon-create/chronic-refill/releases/latest/download/ChronicRx-Setup.exe>
(or `ChronicRx-Portable.exe` from the same release to run without installing).

The installer and portable exe are built on GitHub's Windows machines by `.github/workflows/desktop.yml`
whenever `desktop/` changes on `main`, or on demand from the Actions tab (Windows app → Run workflow).

Local run: `npm install && npm start`. Local build on Windows: `npm run dist` (output in `dist/`).
