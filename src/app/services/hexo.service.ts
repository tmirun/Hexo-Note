import { Injectable } from '@angular/core';
import { SystemSettingsService } from './system-settings.service';
import { ElectronService } from './electron.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class HexoService {

  constructor(
    private systemSettings: SystemSettingsService,
    private electronService: ElectronService
  ) { }

  public init(): void {
    this.checkHexoPath();
  }

  public checkHexoPath(): boolean {
    if (!this.systemSettings.getHexoPath() || !this.systemSettings.isHexoProjectPath(this.systemSettings.getHexoPath())) {
      const path = this.systemSettings.showSelectHexoPath();
      if (! path ) {
        this.electronService.remote.getCurrentWindow().close();
        return;
      }
      if (!this.systemSettings.isHexoProjectPath(path)) {
        this.systemSettings.showNotHexoProjectPathAlert();
      }
      this.checkHexoPath();
    }
  }

  public deployChildProcess(): Promise<any> {
    return this.exec(`hexo clean`)
      .then(() => this.exec('hexo g'))
      .then(() => this.exec('hexo d'));
  }

  public exec(command: string, options = {}, callback = (...arg: any[]) => {}): Promise<any> {
    const customOption = {
      cwd: this.systemSettings.getHexoPath()
    };
    return new Promise((resolve, reject) => {
      this.electronService.childProcess
        .exec(command, {...customOption, ...options},
          function (error, stdout, stderr) {
            callback(error, stdout, stderr);
            console.log('stdout: ' + stdout);
            console.warn('stderr: ' + stderr);
            if (error !== null) {
              console.error('exec error: ' + error);
              reject();
            }
            resolve();
          }
        );
    });
  }
}
