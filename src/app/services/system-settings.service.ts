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

  showSelectHexoPath(): string {
    const remote = this.electronService.remote;
    const dialog = remote.dialog;

    const paths = dialog.showOpenDialog({
      properties: ['openDirectory']
    });

    if (!paths) {
      remote.getCurrentWindow().close();
    }

    const path = paths[0];
    this.saveHexoPath(path);
    return path;
  }


  getHexoPath(): string {
    return this._settings.get('hexoPath');
  }

  saveHexoPath(path: string) {
    this._settings.set('hexoPath', path);
  }

}
