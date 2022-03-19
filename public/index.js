const path = require('path');
const assetsDirectory = path.join(__dirname, 'assets')
const { app, BrowserWindow, Menu, Tray, ipcMain, nativeImage, Rectangle } = require('electron');
const isDev = require('electron-is-dev');
const si = require('systeminformation');

let win = null;
let tray = null;


const createTray = (image) => {
  if (image) {
    let croped = image.crop({ width: 30, height: 20, x: 0, y: 0 })
    tray = new Tray(croped)
  }
  else {
    tray = new Tray('assets/sunTemplate.png')
  }
  tray.setTitle("15");
  const contextMenu = Menu.buildFromTemplate([{
    label: '20C'
  },
  {
    label: 'Show App', click: function () {
      if (!app.isQuiting) {
        win && win.show();
      }
    }
  },
  {
    label: 'Quit', click: function () {
      if (!app.isQuiting) {
        app.isQuiting = true;
        app.quit();
      }
    }
  }
  ]);

  tray.setContextMenu(contextMenu);

  win && win.hide();
}

function createWindow() {
  // createTray();
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js")
    },
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }

}


ipcMain.on('toMain', function () {
  createTray();
  win.webContents.send("fromMain", "test123");
});

ipcMain.on('onGeneratedTrayIcon', function (event, message) {
  console.log('-----------event: ' + event);
  console.log('-----------message: ' + message);
  createTray(nativeImage.createFromDataURL(message));//
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

setInterval(() => {
  // promises style - new since version 3
  // si.currentLoad()
  //   .then(data => console.log(Math.round(data.currentLoad)))
  //   .catch(error => console.error(error));

  // si.cpuTemperature()
  //   .then(data => console.log(data.main))
  //   .catch(error => console.error(error));

  // si.mem()
  //   .then(data => console.log(
  //     'RAM: '
  //   + (data.used*100/data.total).toFixed(2) 
  //   + '  SWAP: ' 
  //   + (data.swapused*100/data.swaptotal).toFixed(2))
  //   )
  //   .catch(error => console.error(error));



  si.battery()
    .then(data => {
      if(data.percent<1) return;

      if(data.acConnected){
        console.log('(in)' + data.percent);
      }
      else{
        console.log('(in)' + data.percent);
      }
    })
    .catch(error => console.error(error));


}, 2000);