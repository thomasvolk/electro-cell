/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';
import 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import $ from "jquery";
import {
    CellularAutomat2DPresenter
} from "./CellularAutomat2DPresenter";


const ca = new CellularAutomat2DPresenter(300, 300, 1)

$('#start-stop-button').on("click", () => {
    if(ca.isRunning()) {
        ca.stop()
        $('#start-stop-button').text("Start")
    }
    else {
        ca.start()
        $('#start-stop-button').text("Stop")
    }
})

$('#shuffle-button').on("click", () => {
    ca.random()
    ca.draw()
})


$('#open-file').on("click", () => {
    console.log("open file")
})

$('#save-file').on("click", () => {
    console.log("save file")
})

$('#save-as-file').on("click", () => {
    console.log("save as file")
})

ca.random()
ca.draw()