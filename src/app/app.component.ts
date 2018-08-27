import { Component } from '@angular/core';
import { ElectronService } from './services/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { HexoService } from './services/hexo.service';
import { ScaffoldService } from './services/scaffold.service';
import { timer } from 'rxjs';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/delayWhen';
import {ConfigService} from './services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public isLoading = false;

  constructor(
    public electronService: ElectronService,
    private translate: TranslateService,
    private hexoService: HexoService,
    private configService: ConfigService,
    private scaffoldService: ScaffoldService) {

    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron()) {
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }

    // this.hexoService.isLoading$.delayWhen((isLoading) => {
    //   return isLoading ? timer(10) : timer(1000);
    // }).subscribe((isLoading) => {
    //   this.isLoading = isLoading;
    // });

    // this.hexoService.init().then(() => {
    //   this.scaffoldService.getDraftTemplate();
    //   this.scaffoldService.getPostTemplate();
    //   this.scaffoldService.getPageTemplate();
    // });

    this.configService.getConfigYml();
  }
}
