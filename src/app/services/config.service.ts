import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { SystemSettingsService } from './system-settings.service';
import { BehaviorSubject } from 'rxjs';
import { HexoService } from './hexo.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  configYml$: BehaviorSubject<string> = new BehaviorSubject('');
  configJson$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(
    private electronService: ElectronService,
    private systemSettings: SystemSettingsService,
    private hexoService: HexoService
  ) { }

  public getConfigYml (): string {
    return this.electronService.fs.readFile(this.getConfigYmlPath(), 'utf8')
      .then((confitYmlData) => {
        this.configYml$.next(confitYmlData);
        console.log('get config yml');

        const configJson = this.electronService.yaml.safeLoad(confitYmlData);
        this.configJson$.next(configJson);
        console.log('parse config yml to json');

        return confitYmlData;
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
        this.hexoService.load();
        return content;
      });
  }
}
