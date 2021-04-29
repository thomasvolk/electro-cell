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
import { ipcRenderer } from "electron";
import { CellularAutomat, Configuration, EEFFRule, Universe } from 'cellular-automat';

const canvas = document.getElementById('canvas') as HTMLCanvasElement
var config = new Configuration(new Universe(300, 300), new EEFFRule(2, 3, 3, 3), 1)
var ca = new CellularAutomat(canvas, config)

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

class StatusBar {
    private id: string
    constructor(id: string) {
        this.id = id
    }

    reset() {
        const status = $(this.id)
        status.removeClass()
        status.addClass('alert')
        status.text('')
    }

    private show(message: string, cssClass: string) {
        this.reset()
        const status = $(this.id)
        status.addClass(cssClass)
        status.text(message)
    }

    danger(message: string) {
        this.show(message, 'alert-danger')
    }

    success(message: string) {
        this.show(message, 'alert-success')
    }
}

const statusBar = new StatusBar('#status-bar')

async function saveFile(type: string) {
    const result = await ipcRenderer.invoke('save-file', type, JSON.stringify(config.toObject()))
    if(result.error) {
        statusBar.danger(result.message)
    }
    else {
        statusBar.success(result.message)
    }
}

async function openFile() {
    const result = await ipcRenderer.invoke('open-file')
    if(result.error) {
        statusBar.danger(result.message)
    }
    else {
        try {
            ca.stop()
            config = Configuration.fromObject(JSON.parse(result.content))
            ca = new CellularAutomat(canvas, config)
            ca.draw()
            statusBar.success(result.message)
            $('#start-stop-button').text("Start")
        }
        catch(err) {
            statusBar.danger(`ERROR parsing config: ${err}`)
        }
    }
}

$('#open-file').on("click", () => {
    openFile()
})

$('#save-file').on("click", () => {
    saveFile('save')
})

$('#save-as-file').on("click", () => {
    saveFile('save-as')
})

ca.random()
ca.draw()