const {Menu, Tray } = require('electron');


let tray = null;


export const createTray = (canvas) => {

  console.log("createTray#");

// as a buffer
// var buffer = canvasBuffer(canvas, 'image/png')

  
  tray = new Tray('assets/sunTemplate.png')
  tray.setTitle("15");
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' }
  ])

  console.log("creatTray 2#");
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)
  console.log("creatTray#");
}