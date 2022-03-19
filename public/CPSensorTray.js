const {app, Menu, Tray, nativeTheme, nativeImage } = require('electron');
const { CPU, MEM, BATTERY, CPU_TEMP, SWAP } = require("./Sensor");


let tray = null;
//a window used to get canvas. If it is null, the tray can not get image by canvas.
var createWindow = null;


const DEFAULT_LABEL = 'none'
const SPLIT = ': '

const handleMenItemClick = (menuItem, browserWindow, event) => {
  if (menuItem.innerType == undefined) return;
  chooseHardware = menuItem.innerType;

  menus.map((item) => {
    if (menuItem.checked) {
      menuItem.checked = false;
    }
  });
  menuItem.checked = true;
  console.log(menuItem.innerType + " choose.");
}
const menus = [{
  label: 'CPU' + SPLIT + DEFAULT_LABEL, type: 'radio', click: handleMenItemClick, innerType: CPU, checked: true, visible: true
}, {
  label: 'CPU_TEMP' + SPLIT + DEFAULT_LABEL, type: 'radio', click: handleMenItemClick, innerType: CPU_TEMP, checked: false, visible: true
},
{
  label: 'Mem' + SPLIT + DEFAULT_LABEL, type: 'radio', click: handleMenItemClick, innerType: MEM, checked: false, visible: true
},
{
  label: 'Swap' + SPLIT + DEFAULT_LABEL, type: 'radio', click: handleMenItemClick, innerType: SWAP, checked: false, visible: true
},
{
  label: 'Battery' + SPLIT + DEFAULT_LABEL, type: 'radio', click: handleMenItemClick, innerType: BATTERY, checked: false, visible: true
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
];

///-------------------------------chooseHardware-----------------------------------------------
const setMenus = () => {
  if (tray) {
    var newArray = menus.filter(function (el) {
      return el.visible == undefined || el.visible == true;
    });
    const contextMenu = Menu.buildFromTemplate(newArray);

    tray.setContextMenu(contextMenu);
  }
  else {
    console.error('setMenus in case of tray being null.');
  }
}

exports.refreshMenu = setMenus;

///-------------------------------chooseHardware-----------------------------------------------
//choose a hardware for render in tray. it expose to index.js
let chooseHardware = null;
const getChooseItem = () => { return chooseHardware; }
exports.getChooseItem = getChooseItem;

///-------------------------------createTray-----------------------------------------------
const createTray = (image) => {
  if (image) {
    tray = new Tray(image)
  }
  else {
    let localLogo = nativeImage.createFromPath('assets/logo.png')
    localLogo.resize({ width: 16, height: 16 });
    tray = new Tray(localLogo)
    setMenus();
  }

  console.log('=================nativeTheme.shouldUseDarkColors: ' + nativeTheme.shouldUseDarkColors);

};
exports.createTray = createTray;

///-------------------------------setTrayImage-----------------------------------------------
const setTrayImage = (image) => {
  if (tray) {
    tray.setImage(image);
    // createWindow && createWindow.hide();
  }
  else {
    createTray(image)
  }
};
exports.setTrayImage = setTrayImage;



///--------------------------------------setWindow--------------------------------------------------
// just bind window.
const setWindow = (win) => {
  createWindow = win;
}
exports.setWindow = setWindow;



///--------------------------------------setItemVisible--------------------------------------------------
const setItemVisible = (hardware, visible) => {
  menus.map((item) => {
    if (item.visible && item.innerType == hardware) {
      item.visible = visible;
    }
  });
  setMenus();
}
exports.setItemVisible = setItemVisible;



///--------------------------------------setItemVisible--------------------------------------------------
const setHardwareState = (hardware, state) => {
  menus.map((item) => {
    if (item.innerType == hardware) {
      let prevLabel = item.label;
      // console.warn('prevLabel: ' + prevLabel);
      let strs = prevLabel.split(':');
      item.label = strs[0] + SPLIT + state;
    }
  });
}
exports.setHardwareState = setHardwareState;