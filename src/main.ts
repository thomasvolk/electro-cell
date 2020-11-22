import { app, BrowserWindow } from "electron";
import * as path from "path";

// copied from https://github.com/electron/electron-quick-start-typescript

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    width: 800,
  });

  if (app.commandLine.hasSwitch('dev-tools')) {
    mainWindow.webContents.openDevTools();
  }
  
  var index = "../index.html"
  if (app.commandLine.hasSwitch('test')) {
    index = "../tests/tests.html"
  }

  mainWindow.loadFile(path.join(__dirname, index));
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
