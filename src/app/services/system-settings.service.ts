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

  public getHexoPath(): string {
    return this._settings.get('hexoPath');
  }

  public saveHexoPath(path: string) {
    this._settings.set('hexoPath', path);
  }

  public getIsActivePreview(): boolean {
    return this._settings.get('isActivePreview') || false;
  }

  public saveIsActivePreview(isActive: boolean = false) {
    this._settings.set('isActivePreview', isActive);
  }

}
