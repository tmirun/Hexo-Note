import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { ElectronService } from './electron.service';
import { SystemSettingsService } from './system-settings.service';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  public isServerRunning = false;
  private _serverRunningChildProcess = null;

  constructor(
    private electronService: ElectronService,
    private systemSettings: SystemSettingsService
  ) { }

  public startServer(): Promise<any> {

    console.log('starting server');
    this.isServerRunning = true;

    return new Promise((resolve, reject) => {
      this._serverRunningChildProcess = this.electronService.childProcess
        .exec('hexo server', {
          cwd: this.systemSettings.getHexoPath()
        }, (error, stdout, stderr) => {
          console.log('stdout: ' + stdout);
          console.log('stderr: ' + stderr);
          if (error !== null) {
            this.isServerRunning = false;
            reject(error);
            console.log('exec error: ' + error);
          }
          resolve();
        });
    });
  }

  public stopServer() {
    console.log('stop server');
    this.isServerRunning = false;
    this._serverRunningChildProcess.kill();
  }

}
