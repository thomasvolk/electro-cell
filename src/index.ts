import { app, BrowserWindow } from 'electron';
import { ipcMain, dialog } from "electron";

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 800,
    width: 1000,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    } 
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  if (process.env.ELECTRO_CELL_DEV_TOOLS) {
    mainWindow.webContents.openDevTools();
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


class File {
  private dialogFiters = [
    { name: 'pattern', extensions: ['json'] },
    { name: 'All Files', extensions: ['*'] }
  ] 
  private path: string
  
  constructor() {
    this.path = null
  }
  
  open() {
    dialog.showOpenDialog({ 
      properties: ['openFile'],
      filters: this.dialogFiters
    }).then(result => {
      if(!result.canceled) {
        this.path = result.filePaths[0]
      }
    }).catch(err => {
      console.log(err)
    })
  }
  
  save() {
    if(this.path == null) {
      dialog.showSaveDialog({ 
        properties: ['createDirectory'],
        filters: this.dialogFiters
      })
    }
  }
  
  saveAs() {
    this.path = null
    this.save()
  }
}

const fs = new File()

ipcMain.on('file-operation', (event, arg) => {
  if(arg == 'open') {
    fs.open()
  }
  else if(arg == 'save') {
    fs.save()
  }
  else if(arg == 'save-as') {
    fs.saveAs()
  }
})
