// ChronicRx for Windows: opens the live dashboard (GitHub Pages) in its own window, so every update
// merged to main reaches the desktop app on the next start — no reinstall needed. Where github.io is blocked
// or down, it opens the copy of the dashboard built into the app (app/, made by prepare.js) instead.
const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

const APP_URL = 'https://baydon-create.github.io/chronic-refill/';
const APP_ORIGIN = new URL(APP_URL).origin;
// Patient documents open from Supabase storage in an app window; every other web link opens in the browser.
const IN_APP = u => u === 'about:blank' || u.startsWith('blob:') || u.startsWith(APP_URL) || /^https:\/\/[a-z0-9]+\.supabase\.co\//.test(u);

let win;
if (!app.requestSingleInstanceLock()) app.quit();
app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });

function guard(contents) {
  contents.setWindowOpenHandler(({ url }) => {
    if (IN_APP(url)) return { action: 'allow', overrideBrowserWindowOptions: { autoHideMenuBar: true, icon: path.join(__dirname, 'build/icon.png') } };
    shell.openExternal(url); // tel:, mailto:, other websites
    return { action: 'deny' };
  });
  contents.on('will-navigate', (e, url) => {
    if (url.startsWith('file:') || IN_APP(url)) return;
    e.preventDefault(); shell.openExternal(url);
  });
  // Right-click copy / paste in text fields
  contents.on('context-menu', (_e, p) => {
    const items = p.isEditable ? [{ role: 'undo' }, { role: 'redo' }, { type: 'separator' }, { role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' }]
      : p.selectionText ? [{ role: 'copy' }] : [];
    if (items.length) Menu.buildFromTemplate(items).popup();
  });
}
app.on('web-contents-created', (_e, contents) => guard(contents));

function createWindow() {
  win = new BrowserWindow({
    width: 1400, height: 900, minWidth: 380, minHeight: 600, show: false,
    title: 'ChronicRx', backgroundColor: '#0B1220', autoHideMenuBar: true,
    icon: path.join(__dirname, 'build/icon.png'),
    webPreferences: { contextIsolation: true, sandbox: true, spellcheck: true },
  });
  win.once('ready-to-show', () => { win.maximize(); win.show(); });
  win.webContents.on('did-fail-load', (_e, code, _desc, url, isMain) => {
    if (isMain && code !== -3 && url.startsWith(APP_ORIGIN)) win.loadFile(path.join(__dirname, 'app', 'index.html'));
  });
  win.loadURL(APP_URL);
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    { label: 'ChronicRx', submenu: [
      { label: 'Reload', accelerator: 'F5', click: () => win && win.loadURL(APP_URL) },
      { role: 'forceReload' }, { type: 'separator' }, { role: 'quit' },
    ] },
    { role: 'editMenu' },
    { label: 'View', submenu: [{ role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' }, { type: 'separator' }, { role: 'togglefullscreen' }, { role: 'toggleDevTools' }] },
  ]));
  createWindow();
});
app.on('window-all-closed', () => app.quit());
