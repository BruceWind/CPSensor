const { Menu, Tray, nativeTheme, nativeImage } = require('electron');


let tray = null;
//a window used to get canvas. If it is null, the tray can not get image by canvas.
var createWindow = null;


const DEFAULT_LABEL = 'none'

const handleMenItemClick = (menuItem, browserWindow, event) => {
  if (menuItem.innerType == undefined) return
  chooseHardware = menuItem.innerType
}
const menus = [{
  label: 'CPU:' + DEFAULT_LABEL, type: 'radio', click: handleMenItemClick, innerType: 'cpu', checked: false, visible: true
},
{
  label: 'Mem:' + DEFAULT_LABEL, type: 'radio', click: handleMenItemClick, innerType: 'mem', checked: true, visible: true
},
{
  label: 'Battery:' + DEFAULT_LABEL, type: 'radio', click: handleMenItemClick, innerType: 'battery', checked: false, visible: true
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

///-------------------------------chooseHardware-----------------------------------------------
//choose a hardware for render in tray. it expose to index.js
let chooseHardware = null;
exports.chooseHardware = chooseHardware;

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
