const electron = require('electron');
const {ipcMain} = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const {autoUpdater} = require("electron-updater");
const windowStateKeeper = require('electron-window-state');
const openAboutWindow = require('about-window').default;

const i18n = new(require(__dirname + '/locales/i18n'));

let mainWindow;

const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus();
  }
});

if (isSecondInstance) { app.quit(); }

function createWindow () {

  let mainWindowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 600
  });

  mainWindow = new BrowserWindow({
    'x': mainWindowState.x,
    'y': mainWindowState.y,
    'width': mainWindowState.width,
    'height': mainWindowState.height,
    title: 'PhreshPlayer', 
    icon: __dirname + '/app/img/phreshplayer-icon.png',
    frame: true
  });

  mainWindow.setMenu(null);

  mainWindowState.manage(mainWindow);

  mainWindow.loadURL('file://' + __dirname + '/app/index.html');

  mainWindow.on('closed', function () {
    mainWindowState.saveState(mainWindow);
    mainWindow = null;
  });

  require('electron-context-menu')({
    prepend: (params, browserWindow) => [
      {
        label: i18n.__('fullscreen'),
        click () { mainWindow.webContents.send('callFunction', 'toggleFullScreen', ''); }
      },
      {
        label: i18n.__('alwaysontop') + ' ' + i18n.__('on') + '/' + i18n.__('off'),
        click () { mainWindow.webContents.send('callFunction', 'toggleAllwaysOnTop', ''); }
      },
      {
        label: i18n.__('subtitle') + ' ' + i18n.__('on') + '/' + i18n.__('off'),
        click () { mainWindow.webContents.send('callFunction', 'toggleShowSubtitle', ''); }
      },
      {
        type: 'separator'
      },
      {
        label: i18n.__('loop') + ' ' + i18n.__('on') + '/' + i18n.__('off'),
        click () { mainWindow.webContents.send('callFunction', 'loopVideo', ''); }
      },
      {
        label: i18n.__('mute') + ' ' + i18n.__('on') + '/' + i18n.__('off'),
        click () { mainWindow.webContents.send('callFunction', 'volumeMute', ''); }
      },
      {
        type: 'separator'
      },
      {
        label: i18n.__('playlist') + ' ' + i18n.__('on') + '/' + i18n.__('off'),
        click () { mainWindow.webContents.send('callFunction', 'toggleShowPlaylist', ''); }
      },
      {
        label: i18n.__('playlist') + ' ' + i18n.__('save'),
        click () { mainWindow.webContents.send('callFunction', 'savePlaylist', ''); }
      },
      {
        type: 'separator'
      },
      {
        label: i18n.__('language'),
        submenu: [
          {
            label: "English",
            click () { mainWindow.webContents.send('callFunction', 'setLanguage', 'en'); }
          },
          {
            label: "Magyar",
            click () { mainWindow.webContents.send('callFunction', 'setLanguage', 'hu'); }
          },
          {
            label: "German",
            click () { mainWindow.webContents.send('callFunction', 'setLanguage', 'de'); }
          },
          {
            label: "Français",
            click () { mainWindow.webContents.send('callFunction', 'setLanguage', 'fr'); }
          }
        ]
      },
      {
        label: i18n.__('subtitle') + ' ' + i18n.__('language'),
        submenu: [
          {
            label: "English",
            click () { mainWindow.webContents.send('callFunction', 'setSubtitleLanguage', 'en'); }
          },
          {
            label: "Magyar",
            click () { mainWindow.webContents.send('callFunction', 'setSubtitleLanguage', 'hu'); }
          },
          {
            label: "German",
            click () { mainWindow.webContents.send('callFunction', 'setSubtitleLanguage', 'de'); }
          },
          {
            label: "Français",
            click () { mainWindow.webContents.send('callFunction', 'setSubtitleLanguage', 'fr'); }
          }
        ]
      },
      {
        type: 'separator'
      },
      {
        label: i18n.__('theme'),
        submenu: [
          {
            label: "Phresh (default)",
            click () { mainWindow.webContents.send('callFunction', 'setTheme', 'phresh'); }
          },
          {
            label: "Cobalt",
            click () { mainWindow.webContents.send('callFunction', 'setTheme', 'cobalt'); }
          },
          {
            label: "Full Metal",
            click () { mainWindow.webContents.send('callFunction', 'setTheme', 'fullmetal'); }
          },
          {
            label: "Hello Kitty",
            click () { mainWindow.webContents.send('callFunction', 'setTheme', 'hellokitty'); }
          }
        ]
      },
      {
        type: 'separator'
      },
      {
        label: i18n.__('quit'),
        click () { mainWindow.close(); }
      },
      {
        type: 'separator'
      },
      {
        role: 'about',
        label: i18n.__('about'),
        submenu: [
          {
            label: 'PhreshPlayer',
            click () { 
              openAboutWindow({
                icon_path: __dirname + '/app/img/phreshplayer-icon.png',
                copyright: 'Copyright (c) 2018, Krisztián Kis - Phresh-IT. All rights reserved.',
                package_json_dir: __dirname,
                homepage: 'https://phresh-it.hu/apps/phreshplayer/',
                bug_report_url: 'https://github.com/Phreshhh',
                license: 'MIT'
              });
             }
          },
          {
            label: 'PhreshPlayer website',
            click () { require('electron').shell.openExternal('https://phresh-it.hu/apps/phreshplayer/'); }
          },
          {
            label: 'Phresh-IT',
            click () { require('electron').shell.openExternal('https://phresh-it.hu/'); }
          },
          {
            label: 'Electron',
            click () { require('electron').shell.openExternal('https://electronjs.org/'); }
          }
        ]
      }
    ],
    showInspectElement: false
  });

  if ( process.argv[1] !== '.') {
    autoUpdater.checkForUpdates();
  }

}

app.on('ready', createWindow);

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

autoUpdater.on('update-downloaded', (ev, info) => {
  autoUpdater.quitAndInstall(); 
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

let openedFile = null;

if (process.argv.length > 1) {
  openedFile = process.argv[1].toString();
}

ipcMain.on('gimme-openedfile', (event) => {
  event.sender.send('openedfile', openedFile);
});
