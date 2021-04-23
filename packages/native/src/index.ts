// eslint-disable-next-line import/no-extraneous-dependencies
import { app, BrowserWindow, Menu, MenuItemConstructorOptions } from 'electron';
// eslint-disable-next-line import/no-extraneous-dependencies
import electronDebug from 'electron-debug';
import os from 'os';
import path from 'path';

electronDebug();
// include port-checker and start on free port
// also think of error-cases when child-process can't start
const backendProcess = require('child_process').fork(`${app.getAppPath()}/api/main.js`, [], {
  env: {
    ...process.env,
    PORT: 8083,
    HOSTNAME: 'localhost',
    LOGDIR_PATH: path.join(os.tmpdir(), 'validator'),
    USERDATA_PATH: app.getPath('userData'),
  },
  cwd: `${app.getAppPath()}/api`,
});

// Global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | undefined;

const createMainWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow();

  const isMac = process.platform === 'darwin';
  const template = [
    ...(isMac
      ? [
          {
            label: 'checkCMR',
            submenu: [
              { role: 'hide' },
              { role: 'hideothers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' },
            ],
          },
        ]
      : []),
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [{ type: 'separator' }, { role: 'front' }, { type: 'separator' }] : [{ role: 'close' }]),
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(template as Array<MenuItemConstructorOptions>);
  Menu.setApplicationMenu(menu);

  mainWindow.maximize();
  mainWindow.setKiosk(false);
  mainWindow.setMenu(null);
  mainWindow.setClosable(true);
  mainWindow.setMinimizable(true);
  mainWindow.setMaximizable(true);
  mainWindow.setResizable(true);

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });

  mainWindow.loadURL(`file://${app.getAppPath()}/web/index.html`);
};

// Quit application when all windows are closed
app.on('window-all-closed', () => {
  // On macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it is common to re-create a window even after all windows have been closed
  if (!mainWindow) {
    createMainWindow();
  }
});

// Create main BrowserWindow when electron is ready
app.on('ready', () => {
  createMainWindow();
});

app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});
