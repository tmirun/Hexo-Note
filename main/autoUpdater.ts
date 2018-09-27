import { autoUpdater } from 'electron-updater';
import * as electronLog from 'electron-log';
import { dialog, BrowserWindow, ipcMain } from 'electron';
import { UpdateCheckResult } from '../common/models/updateCheckResult.interface';
import { IPC_CHANNELS } from '../common/ipc-channels';

autoUpdater.logger = electronLog as any;

export function autoUploadCheck() {
  autoUpdater.checkForUpdates();

  // if exist new version
  autoUpdater.on('update-available', ( result: UpdateCheckResult) => {

    // create update information window
    let updateWin = new BrowserWindow({
      width: 500,
      height: 300,
      autoHideMenuBar: true,
      maximizable: false,
      fullscreen: false,
      fullscreenable: false,
      resizable: false
    });

    updateWin['custom'] = result;

    updateWin.loadURL(`file://${__dirname}/../renderer/update-window.html`);

    updateWin.on('close', () => { updateWin = null; });

    ipcMain.on(IPC_CHANNELS.AUTO_UPLOAD_ACCEPT, (event) => {
      openDownloadProgressWindow();
      event.returnValue = true;
    });

    function openDownloadProgressWindow() {
      // creating progress window;
      let progressWin = new BrowserWindow({
        width: 400,
        height: 80,
        autoHideMenuBar: true,
        maximizable: false,
        fullscreen: false,
        fullscreenable: false,
        resizable: false
      });

      progressWin.loadURL(`file://${__dirname}/../renderer/update-progress.html`);

      progressWin.on('close', () => { progressWin = null; });

      // sent progress percent to window;
      let progressPercent = 0;

      ipcMain.on(IPC_CHANNELS.AUTO_UPLOAD_DOWNLOAD_PROGRESS, (event) => {
        event.returnValue = progressPercent;
      });

      autoUpdater.on('download-progress', (download) => {
        progressPercent = download.percent;
      });

      autoUpdater.on('update-downloaded', () => {
        if (progressWin) { progressWin.close(); }

        dialog.showMessageBox(  {
          type: 'info',
          title: 'Update Ready',
          message: 'Then new version is downloaded, Quit and install now?',
          buttons: ['Yes', 'Late'],
        },
        (buttonIndex) => {
          if (buttonIndex === 0) { autoUpdater.quitAndInstall(); }
        });

      });
    }

  });
}
