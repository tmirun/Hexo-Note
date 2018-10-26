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
    private electronService: ElectronService,
    private utils: UtilsService
  ) {
  }

  public newBlog(directory: string): Promise<any> {
    return this.exec('hexo init', {cwd: directory});
  }

  public isCurrentDirectoryProjectFolder(): boolean {
    return this.utils.isHexoProjectFolder(this.systemSettings.getHexoPath());
  }

  public openSelectHexoDirectoryDialog(): string {
    const directory = this.utils.openDirectoryDialog();
    if (! directory) {
      this.utils.showNotHexoProjectPathAlert();
      return '';
    }
    return directory;
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
