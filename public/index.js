const path = require('path');
const assetsDirectory = path.join(__dirname, 'assets')
const { app, BrowserWindow, Menu, Tray, ipcMain, nativeImage, Rectangle, nativeTheme } = require('electron');
const isDev = require('electron-is-dev');
const si = require('systeminformation');

const { createTray, setTrayImage, refreshMenu, setWindow, getChooseItem, setHardwareState } = require("./CPSensorTray");
const { CPU, MEM, BATTERY, CPU_TEMP, SWAP } = require("./Sensor");


function getDefaultTxtColor(){
  if(nativeTheme.shouldUseDarkColors){
    return 'white';
  }
  else{
    return 'black';
  }
}
let win = null;

//--------------force showing something---------------
let forceShowingTpt = false;
let forceShowingBattery = false;


function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js")
    },
  });
  setWindow(win);
  createTray();
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
  let cropped = nativeImage.createFromDataURL(message).crop({ width: 30, height: 20, x: 0, y: 0 });

  setTrayImage(cropped);
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

//note: -------------it works on some conditions. ------
function tellCanvas2Render(item, textV, textColor) {
  // console.log('chooseHardware : ' + getChooseItem());
  let innerChooseItem = getChooseItem() || CPU;
  let innerColor = textColor || getDefaultTxtColor();

  if (forceShowingTpt || forceShowingBattery) {
    if (item == CPU_TEMP || item == BATTERY) {
      win.webContents.send("toGenerateImg", { text: textV, color: innerColor });
    }
    return
  }
  else {
    if (item == innerChooseItem) {
      win.webContents.send("toGenerateImg", { text: textV, color: innerColor });
    }
  }
}

setInterval(() => {

  si.currentLoad()
    .then(data => {
      let usage = Math.round(data.currentLoad);


      let textV = '' + usage + '%';
      let textC = getDefaultTxtColor();
      if (usage > 85) {
        textC = 'red'
      }

      tellCanvas2Render(CPU, textV, textC);

      setHardwareState(CPU, textV);
    })
    .catch(error => console.error(error));

  si.cpuTemperature()
    .then(data => {
      //console.log(data.main);
      let cpuTpt = Math.round(data.main);
      forceShowingTpt = cpuTpt > 85.0;
      let textV = cpuTpt + '℃';

      setHardwareState(CPU_TEMP, textV);
      tellCanvas2Render(CPU_TEMP, textV)
    })
    .catch(error => console.error(error));

  // si.mem()
  //   .then(data => {

  //     //   console.log(
  //     //   'RAM: '
  //     // + ramText
  //     // + '  SWAP: ' 
  //     // + swapText;

  //     let usage = (data.used * 100 / data.total).toFixed(2);
  //     let ramText = usage + '';
  //     setHardwareState(MEM, ramText);


  //     tellCanvas2Render(MEM, ramText)

  //     usage = (data.swapused * 100 / data.swaptotal).toFixed(2);
  //     let swapText = usage + '';
  //     setHardwareState(SWAP, swapText);
  //     let textC = usage > 85 ? 'red' : getDefaultTxtColor()
  //     tellCanvas2Render(SWAP, ramText, textC)
  //   }
  //   )
  //   .catch(error => console.error(error));



  si.battery()
    .then(data => {
      // if (data.percent < 1) {
      //   return;
      // }
      let value = data.percent;
      let valueWithUnit = value + '%';

      let textV = (data.acConnected ? '⚡' : '') + ((value && value > 0) ? valueWithUnit : 'none');

      forceShowingBattery = value > 0 && value <= 20 && false == data.acConnected;

      setHardwareState(BATTERY, textV);
      if (value > 0 && value <= 20) {
        tellCanvas2Render(BATTERY, textV, 'red')
      }
      else {
        tellCanvas2Render(BATTERY, textV)
      }

    })
    .catch(error => console.error(error));

  refreshMenu();
}, 2000);