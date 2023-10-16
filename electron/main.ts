import {
  app,
  BrowserWindow,
  Notification,
  ipcMain,
  screen,
  dialog,
  BrowserView,
} from "electron";
import path from "path";
import { readdirSync, statSync, writeFile } from "fs";
const { exec } = require("child_process");
const schedule = require("node-schedule");
let mainWindow;
let newWin;
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
  mainWindow = win;
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.resolve(__dirname, "../dist/index.html"));
  }
};

const createdNewWindow = () => {
  // 获取屏幕的大小和位置
const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    width: 350,
    height: 350,
    icon: path.resolve(__dirname, "../favicon.ico"),
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    show: false,
  });
  newWin = win;
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL("https://www.zyh.show/?code=1");
  } else {
    win.loadFile(path.resolve(__dirname, "../dist/index.html"));
  }
 // 将窗口定位在屏幕的右下角
 console.log('width', width);
  console.log('height', height);
 
 newWin.setPosition(width - 360, height - 320);
};

app.whenReady().then(() => {
  createdWindow();
  createdNewWindow();
});
// 兼容MacOS系统的窗口关闭功能
app.on("window-all-closed", () => {
  mainWindow = null;
  // 非MacOS直接退出
  if (process.platform != "darwin") {
    app.quit();
  }
});

// 点击MacOS底部菜单时重新启动窗口
app.on("activate", () => {
  console.log("BrowserWindow.getAllWindows", mainWindow);
  if (mainWindow === null) {
    createdWindow();
  }
  // if (BrowserWindow.getAllWindows.length == 0) {
  //   createdWindow();
  // }
});

/** 创建新的窗口 */
ipcMain.on("make-window", (event) => {
  console.log("创建窗口=======",newWin.isVisible());
  // 如果视图已经存在，则显示它


  
  if(newWin && !newWin.isVisible()){
    newWin.show();
    return;
  }else{
    newWin.hide();
  }

});

/** 打开文件夹的 */
ipcMain.on("open-folder", (event, folderPath) => {
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
    writeFile("data.json", JSON.stringify(directoryList), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Data written to file");
    });
    event.sender.send("directoryList", directoryList);
  });
  // event.reply('folder-files', files);
});

//可以执行命令
ipcMain.on("scriptExe", (event, item) => {
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

/** 获取文件夹路径 */
ipcMain.on("open-file-dialog", (event, item) => {
  console.log("open-file-dialog==================", item);
  dialog
    .showOpenDialog({
      properties: ["openFile", "openDirectory"],
    })
    .then((res) => {
      console.log("res", res);
      event.reply("selected-directory", res);
      event.sender.send("directoryList", res.filePaths[0]);
    });
});

/**git clone */
ipcMain.on("git-clone", (event, item) => {
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
    exec(removeOriginCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.error(`远程地址已经删除===`);
    });
  });
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
