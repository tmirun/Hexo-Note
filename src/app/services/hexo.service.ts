import { Injectable } from '@angular/core';
import * as Hexo from 'hexo';
import { Subject } from 'rxjs';
import { SystemSettingsService } from './system-settings.service';
import { ElectronService } from './electron.service';

@Injectable({
  providedIn: 'root'
})
export class HexoService {

  public _hexo: typeof Hexo;
  public isInit$: Subject<boolean> = new Subject();

  constructor(
    private systemSettings: SystemSettingsService,
    private electronService: ElectronService
  ) { }

  public init() {
    const _Hexo = window.require('hexo');

    this.systemSettings.saveHexoPath('');

    this.checkHexoPath();

    this._hexo = new _Hexo(this.systemSettings.getHexoPath(), {
      drafts: true
    });

    // init
    return this._hexo.init().then(() => {
      // load sources and watching changes
      return this._hexo.load().then((...arg) => {
        this.isInit$.next(true);
      });
    });
  }

  public end() {
    this._hexo.unwatch();
  }

  public checkHexoPath() {
    if (!this.isHexoProjectPath()) {
      this.systemSettings.showSelectHexoPath();
      if (!this.isHexoProjectPath()) {
        this.showNotHexoProjectPathAlert();
      }
      this.checkHexoPath();
    }
  }

  public showNotHexoProjectPathAlert() {
    const remote = this.electronService.remote;
    const dialog = this.electronService.remote.dialog;
    dialog.showMessageBox(
      remote.getCurrentWindow(),
      {
        type: 'warning',
        title: 'ALERT',
        message: 'THE FOLDER DONT HEAVE _config.yml FILE, PLIZ CHOOSE THE CORRECT HEXO PROJECT FOLDER?'
      });
  }

  private isHexoProjectPath(): boolean {
    const hexoPath = this.systemSettings.getHexoPath();
    const existConfigFile = this.electronService.fs.existsSync(`${this.systemSettings.getHexoPath()}/_config.yml`);

    return hexoPath && existConfigFile;
  }
}
