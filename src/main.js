const { app, BrowserWindow } = require('electron');
const express = require('express');

const expressApp = express();

const port = process.env.PORT || 3000;

expressApp.use('/js', express.static(__dirname + '/../node_modules/jquery/dist'));
expressApp.use('/js', express.static(__dirname + '/../node_modules/socket.io-client/dist'));
expressApp.use('/js', express.static(__dirname + '/../node_modules/bootstrap/dist/js'));
expressApp.use('/css', express.static(__dirname + '/../node_modules/bootstrap/dist/css'));
expressApp.use('/', express.static(__dirname + '/views'));

/* Initialize Electron App */
const createWindow = () => {
    const win = new BrowserWindow({
        width: 1280,
        height: 650,
        webPreferences: {
            nodeIntegration: true,
        }
    });

    win.loadURL('http://localhost:3000').catch(e => {
        console.log(e);
    }).then(() => {
        win.webContents.openDevTools();
    });
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    // macOS에서는 사용자가 명확하게 Cmd + Q를 누르기 전까지는
    // 애플리케이션이나 메뉴 바가 활성화된 상태로 머물러 있는 것이 일반적입니다.
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // macOS에서는 dock 아이콘이 클릭되고 다른 윈도우가 열려있지 않았다면
    // 앱에서 새로운 창을 다시 여는 것이 일반적입니다.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

process.on('uncaughtException', (err) => {
    console.log(err);
    // relaunch the app (if you want) app.relaunch({args: []}); app.exit(0);
});

/* Initialize Socker.io */
const http = require('http').createServer(expressApp);
http.listen(port, () => {
    console.log(`Http server has listening on port ${port}!`);
});

const socket = require('./middlewares/socket');
socket(http);