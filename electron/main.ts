import { app, BrowserWindow, Notification, ipcMain, dialog } from "electron";
import path from "path";
import { readdirSync, statSync ,writeFile} from "fs";
const { exec } = require("child_process");
const schedule = require("node-schedule");
const createdWindow = () => {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    minHeight: 600, // 设置最小高度
    minWidth: 900, // 设置最小宽度
    icon: path.resolve(__dirname, "../favicon.ico"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
    autoHideMenuBar: true, // 隐藏菜单栏
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.resolve(__dirname, "../dist/index.html"));
  }
};

app.whenReady().then(() => {
  createdWindow();
});
// 兼容MacOS系统的窗口关闭功能
app.on("window-all-closed", () => {
  // 非MacOS直接退出
  if (process.platform != "darwin") {
    app.quit();
  }
});

// 点击MacOS底部菜单时重新启动窗口
app.on("activate", () => {
  if (BrowserWindow.getAllWindows.length == 0) {
    createdWindow();
  }
});

/** 打开文件夹的 */
ipcMain.on("open-folder", (event, folderPath) => {
  // console.log('folderPath',dialog);
  // const files = readdirSync(folderPath);
  // console.log('files', files);
  dialog.showOpenDialog({ properties: ["openDirectory"] }).then((res) => {
    // 如果取消了就直接return
    if (res.canceled) {
      return;
    }
    const files = readdirSync(res.filePaths[0]);
    const filePaths = res.filePaths[0];
    console.log("路径前缀===", filePaths);
    const directoryList: any = [];
    for (const file of files) {
      const filePath = path.join(filePaths, file);
      const stats = statSync(filePath);
      if (stats.isDirectory()) {
        directoryList.push({
          filePath,
          fileName: file,
        });
      }
    }
    console.log("directoryList", directoryList);
    writeFile('data.json', JSON.stringify(directoryList), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Data written to file');
    });
    event.sender.send("directoryList", directoryList);
  });
  // event.reply('folder-files', files);
});

//可以执行命令
ipcMain.on("scriptExe", (event, item) => {
  console.log("scriptExe==================", item);
  if(item.type==='vscode'){
    exec(`cd ${item.filePath} && code .`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  }
  if(item.type==='iterm'){
    exec(`cd ${item.filePath} && open -a iTerm .`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  }
  // exec("code .", (err, stdout, stderr) => {
  //   if (err) {
  //     console.error(err);
  //     return;
  //   }
  //   console.log(stdout);
  // });
});

// 在主进程中安排定时任务
let job;
ipcMain.on("setAlarm", (event, item) => {
  console.log("setAlarm==================", item);
  console.log("job===", job);
  // 如果之前已经安排了任务，则取消该任务
  if (job) {
    job.cancel();
  }

  // 安排新的定时任务
  job = schedule.scheduleJob(new Date(item.time), function () {
    // 向渲染进程发送消息
    event.sender.send("alarmTriggered");
    var myNotification = new Notification({
      title: item.title,
      body: item.body,
    });
    myNotification.show();
  });
});

// 在主进程中安排定时任务
let reminderEvent;
ipcMain.on("reminderEvent", (event, item) => {
  setIpcJob(item);
});

ipcMain.on("reminderEvent2", (event, item) => {
  setIpcJob(item);
});

ipcMain.on("reminderEvent1", (event, item) => {
  setIpcJob(item);
});

const ipcObj = {
  reminderEvent: null,
  reminderEvent1: null,
  reminderEvent2: null,
};
function setIpcJob(item) {
  console.log("setAlarm==================", item);
  // 在主进程中安排定时任务
  //删除之后就取消结束了
  if (item.action === "cancel") {
    ipcObj[item.eventKey].cancel();
    return;
  }
  // 如果之前已经安排了任务，则取消该任务
  if (ipcObj[item.eventKey]) {
    ipcObj[item.eventKey].cancel();
  }
  ipcObj[item.eventKey] = schedule.scheduleJob(
    new Date(item.time),
    function () {
      // 向渲染进程发送消息
      var myNotification = new Notification({
        title: item.title,
        body: item.body,
      });
      myNotification.show();
    }
  );
}
