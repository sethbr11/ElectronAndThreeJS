/*
  To implement:
  - Automatic updates: https://www.electronjs.org/docs/latest/tutorial/updates
    - Before automatic updates can happen, we need to sign our code: https://www.electronjs.org/docs/latest/tutorial/code-signing
  - Crash reporting: https://www.electronjs.org/docs/latest/api/crash-reporter
  - Logging: https://www.electronjs.org/docs/latest/api/net-log
  - Security: https://www.electronjs.org/docs/latest/tutorial/security
  - Work with Apple dock: https://www.electronjs.org/docs/latest/tutorial/macos-dock
  - Package the application
*/

const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');

const isMac = process.platform === 'darwin'

// Create the Menu
const menuTemplate = [
  ...(isMac
    ? [{
        label: app.name,
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      }]
    : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac
        ? [
            { role: 'pasteAndMatchStyle' },
            { role: 'delete' },
            { role: 'selectAll' },
            { type: 'separator' },
            {
              label: 'Speech',
              submenu: [
                { role: 'startSpeaking' },
                { role: 'stopSpeaking' }
              ]
            }
          ]
        : [
            { role: 'delete' },
            { type: 'separator' },
            { role: 'selectAll' }
          ])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac
        ? [
            { type: 'separator' },
            { role: 'front' },
            { type: 'separator' },
            { role: 'window' }
          ]
        : [
            { role: 'close' }
          ])
    ]
  },
  {
    label: 'Test',
    submenu: [
      {
        label: 'Test Item',
        click: async () => {
          // Show a dialog box
          const result = await dialog.showMessageBox({
            message: 'Hello from Electron!',
            buttons: ['OK']
          });
          console.log(result);
        }
      }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          await shell.openExternal('https://electronjs.org')
        }
      }
    ]
  },
];
const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

// Create the Browser Window
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: './resources/WindowsLogo.png',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true, // This allows us to use Node.js modules in the renderer process
      contextIsolation: true,
      enableRemoteModule: false
    }
  });

  mainWindow.loadFile('./app/index.html');
}

/**APP EVENTS**/
app.whenReady().then(() => {
  createWindow();
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});

// On macOS, re-create a window in the app when the dock icon is clicked and there are no other windows open
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
