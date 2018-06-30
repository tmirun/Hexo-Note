import { Injectable } from '@angular/core';
import * as settings from 'electron-settings';
import { ElectronService } from './electron.service';

@Injectable({
  providedIn: 'root'
})
export class SystemSettingsService {

  private _settings: typeof settings;

  constructor(
    private electronService: ElectronService
  ) {
    // Conditional imports
    if (this.electronService.isElectron()) {
      this._settings = window.require('electron-settings');
    }
  }

  showSelectHexoPath(): string | undefined {
    const remote = this.electronService.remote;
    const dialog = remote.dialog;

    const paths = dialog.showOpenDialog({
      properties: ['openDirectory']
    });

    if (!paths) {
      return paths as undefined;
    }

    const path = paths[0];
    this.saveHexoPath(path);
    return path;
  }

  showNotHexoProjectPathAlert() {
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

  isHexoProjectPath(path): boolean {
    return  this.electronService.fs.existsSync(`${path}/_config.yml`);
  }

  getHexoPath(): string {
    return this._settings.get('hexoPath');
  }

  saveHexoPath(path: string) {
    this._settings.set('hexoPath', path);
  }

}
