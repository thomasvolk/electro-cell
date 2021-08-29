import { app, BrowserWindow } from 'electron';
import { ipcMain, dialog } from "electron";
import fs from 'fs';

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


class FileService {
  private dialogFiters = [
    { name: 'rle', extensions: ['rle', 'RLE'] },
    { name: 'All Files', extensions: ['*'] }
  ] 
  private path: string
  
  constructor() {
    this.path = null
  }
  
  open() {
    try {
      const result = dialog.showOpenDialogSync({ 
        properties: ['openFile'],
        filters: this.dialogFiters
      })
      if(result !== undefined) {
        this.path = result[0]
      }
    } catch(err) {
      return { "message": `ERROR open file: ${this.path} - ${err}`, error: true}
    }
    if(this.path != null) {
      try {
        const content = fs.readFileSync(this.path, 'utf-8')
        return { "message": `opened file: ${this.path}`, error: false, content: content}
      } catch(err) {
        return { "message": `ERROR reading file: ${this.path} - ${err}`, error: true}
      }
    }
  }

  private write(content: string) {
    try {
      fs.writeFileSync(this.path, content)
      return { "message": `file saved: ${this.path}`, error: false}
    } catch(err) {
      return { "message": `ERROR saving file: ${this.path} - ${err}`, error: true}
    }
  }

  save(content: string) {
    if(this.path == null) {
      try {
        this.path = dialog.showSaveDialogSync({ 
          properties: ['createDirectory'],
          filters: this.dialogFiters
        })
      } catch(err) {
        return { "message": `ERROR saving file: ${this.path} - ${err}`, error: true}
      }
    }
    return this.write(content)
  }
  
  saveAs(content: string) {
    this.path = null
    return this.save(content)
  }
}

const fileSystem = new FileService()

ipcMain.handle('open-file', async (event, arg) => {
  return fileSystem.open()
})

ipcMain.handle('save-file', async (event, type, content) => {
  if(type == 'save') {
    return fileSystem.save(content)
  }
  else if(type == 'save-as') {
    return fileSystem.saveAs(content)
  }
})