import { Injectable } from '@angular/core';
import * as Hexo from 'hexo';
import { Subject, BehaviorSubject } from 'rxjs';
import { SystemSettingsService } from './system-settings.service';
import { ElectronService } from './electron.service';

@Injectable({
  providedIn: 'root'
})
export class HexoService {

  public _hexo: typeof Hexo;
  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false)
  public isInit$: Subject<boolean> = new Subject();

  constructor(
    private systemSettings: SystemSettingsService,
    private electronService: ElectronService
  ) { }

  public init(): Promise<any> {
    const _Hexo = window.require('hexo');

    this.checkHexoPath();

    this._hexo = new _Hexo(this.systemSettings.getHexoPath(), {
      drafts: true
    });

    // init
    return this._hexo.init()
      .then(() => {
        console.log('hexo init ok');
        // load sources and watching changes
        return this.load().then(() => {
          this.isInit$.next(true);
        });
      })
      .catch((error) => {
        console.log('hexo init error', error);
        throw error;
      });
  }

  public load(): Promise<any> {
    this.isLoading$.next(true);
    return this._hexo.load()
      .then(() => {
        console.log('hexo load ok');
        this.isLoading$.next(false);
      })
      .catch((error) => {
        console.log('hexo load error', error);
        throw error;
      });
  }

  public end() {
    this._hexo.unwatch();
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
}
