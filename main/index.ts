import {app, BrowserWindow, screen} from 'electron';
import {hexoService, HexoService} from './services/hexo.service';
import './ipc-register';
import './listeners';
import {getProjectPath} from './services/store.service';
import {initializeHexoIpcEvent} from "./listeners";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createDashboardWindow = async () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const mainWindow = new BrowserWindow({
    height: height,
    width: width,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  // mainWindow.loadFile(path.join(__dirname, '../src/index.html'));
  mainWindow.loadURL('http://localhost:3000/dashboard');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

};

const createOpenProjectWindow = async () => {
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  await mainWindow.loadURL('http://localhost:3000/open-project');

  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  const projectPath = getProjectPath();
  const isHexoProject = HexoService.isHexoProject(projectPath);
  if(projectPath && isHexoProject) {
    await hexoService.init(projectPath);
    initializeHexoIpcEvent();
    await createDashboardWindow();
  } else {
    await createOpenProjectWindow();
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', async () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    await createDashboardWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
