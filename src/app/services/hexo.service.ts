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
}
