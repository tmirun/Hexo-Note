import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { SystemSettingsService } from './system-settings.service';
import { BehaviorSubject } from 'rxjs';
import { Config } from '../Models/Config.Interface';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  configYml$: BehaviorSubject<string> = new BehaviorSubject('');
  configJson$: BehaviorSubject<Config> = new BehaviorSubject({});

  constructor(
    private electronService: ElectronService,
    private systemSettings: SystemSettingsService,
  ) { }

  public getConfigYml (): string {
    return this.electronService.fs.readFile(this.getConfigYmlPath(), 'utf8')
      .then((configYmlData) => {
        this.configYml$.next(configYmlData);
        console.log('get config yml');

        const configJson = this.electronService.yaml.safeLoad(configYmlData) as Config;
        this.configJson$.next(configJson);
        console.log('parse config yml to json');

        return configYmlData;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }

  public getConfigYmlPath(): string | undefined {
    const hexoPath = this.systemSettings.getHexoPath();
    if (!hexoPath ) { return undefined; }
    return `${hexoPath}/_config.yml`;
  }

  public updateConfigYml(content: string): Promise<string> {
    return this.electronService.fs.writeFile(this.getConfigYmlPath(), content)
      .then(() => {
        this.configYml$.next(content);
        return content;
      });
  }
}
