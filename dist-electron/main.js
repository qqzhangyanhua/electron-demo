"use strict";
const electron = require("electron");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const schedule = require("node-schedule");
let mainWindow;
const createdWindow = () => {
  const win = new electron.BrowserWindow({
    width: 900,
    height: 600,
    minHeight: 600,
    // 设置最小高度
    minWidth: 900,
    // 设置最小宽度
    icon: path.resolve(__dirname, "../favicon.ico"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
    autoHideMenuBar: true
    // 隐藏菜单栏
  });
  mainWindow = win;
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.resolve(__dirname, "../dist/index.html"));
  }
};
electron.app.whenReady().then(() => {
  createdWindow();
});
electron.app.on("window-all-closed", () => {
  mainWindow = null;
  if (process.platform != "darwin") {
    electron.app.quit();
  }
});
electron.app.on("activate", () => {
  console.log("BrowserWindow.getAllWindows", mainWindow);
  if (mainWindow === null) {
    createdWindow();
  }
});
electron.ipcMain.on("open-folder", (event, folderPath) => {
  electron.dialog.showOpenDialog({ properties: ["openDirectory"] }).then((res) => {
    if (res.canceled) {
      return;
    }
    const files = fs.readdirSync(res.filePaths[0]);
    const filePaths = res.filePaths[0];
    console.log("路径前缀===", filePaths);
    const directoryList = [];
    for (const file of files) {
      const filePath = path.join(filePaths, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        directoryList.push({
          filePath,
          fileName: file
        });
      }
    }
    console.log("directoryList", directoryList);
    fs.writeFile("data.json", JSON.stringify(directoryList), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Data written to file");
    });
    event.sender.send("directoryList", directoryList);
  });
});
electron.ipcMain.on("scriptExe", (event, item) => {
  console.log("scriptExe==================", item);
  if (item.type === "vscode") {
    const code = "/usr/local/bin/code";
    exec(` ${code} ${item.filePath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
    });
  }
  if (item.type === "finder") {
    exec(`open ${item.filePath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
    });
  }
  if (item.type === "iterm") {
    exec(`cd ${item.filePath} && open -a iTerm .`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
    });
  }
});
let job;
electron.ipcMain.on("setAlarm", (event, item) => {
  console.log("setAlarm==================", item);
  console.log("job===", job);
  if (job) {
    job.cancel();
  }
  job = schedule.scheduleJob(new Date(item.time), function() {
    event.sender.send("alarmTriggered");
    var myNotification = new electron.Notification({
      title: item.title,
      body: item.body
    });
    myNotification.show();
  });
});
electron.ipcMain.on("reminderEvent", (event, item) => {
  setIpcJob(item);
});
electron.ipcMain.on("reminderEvent2", (event, item) => {
  setIpcJob(item);
});
electron.ipcMain.on("reminderEvent1", (event, item) => {
  setIpcJob(item);
});
electron.ipcMain.on("open-file-dialog", (event, item) => {
  console.log("open-file-dialog==================", item);
  electron.dialog.showOpenDialog({
    properties: ["openFile", "openDirectory"]
  }).then((res) => {
    console.log("res", res);
    event.reply("selected-directory", res);
    event.sender.send("directoryList", res.filePaths[0]);
  });
});
electron.ipcMain.on("git-clone", (event, item) => {
  console.log("git-clone==================", item);
  const localTemplateDir = `${item.filePath}/${item.projectName}`;
  const templateRepoUrl = item.template;
  const command = `git clone ${templateRepoUrl} ${localTemplateDir}`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    event.sender.send("clone-success", item);
    console.error(`clone-success: ${stderr}`);
    const removeOriginCommand = `cd ${localTemplateDir} && git remote remove origin`;
    exec(removeOriginCommand, (error2, stdout2, stderr2) => {
      if (error2) {
        console.error(`exec error: ${error2}`);
        return;
      }
      console.error(`远程地址已经删除===`);
    });
  });
});
const ipcObj = {
  reminderEvent: null,
  reminderEvent1: null,
  reminderEvent2: null
};
function setIpcJob(item) {
  console.log("setAlarm==================", item);
  if (item.action === "cancel") {
    ipcObj[item.eventKey].cancel();
    return;
  }
  if (ipcObj[item.eventKey]) {
    ipcObj[item.eventKey].cancel();
  }
  ipcObj[item.eventKey] = schedule.scheduleJob(
    new Date(item.time),
    function() {
      var myNotification = new electron.Notification({
        title: item.title,
        body: item.body
      });
      myNotification.show();
    }
  );
}
