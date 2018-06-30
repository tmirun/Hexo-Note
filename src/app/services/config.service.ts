import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { SystemSettingsService } from './system-settings.service';
import { BehaviorSubject } from 'rxjs';
import {Post} from '../Models/Post.interface';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  configYml$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(
    private electronService: ElectronService,
    private systemSettings: SystemSettingsService
  ) { }

  public getConfigYml (): string {
    return this.electronService.fs.readFile(this.getConfigYmlPath(), 'utf8').then((confitYmlData) => {
      this.configYml$.next(confitYmlData);
      return confitYmlData;
    });
  }

  public getConfigYmlPath(): string | undefined {
    const hexoPath = this.systemSettings.getHexoPath();
    if (!hexoPath ) { return undefined; }
    return `${hexoPath}/_config.yml`;
  }

  public updateConfigYml(content: string): Promise<string> {
    return this.electronService.fs.writeFile(this.getConfigYmlPath(), content).then(() => {
      this.configYml$.next(content);
      console.log(content);
      return content;
    });
  }
}
