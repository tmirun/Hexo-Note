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
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public isLoading = false;

  constructor(
    public electronService: ElectronService,
    private hexoService: HexoService,
    private router: Router,
    private configService: ConfigService,
    private translate: TranslateService) {

    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron()) {
      console.log('Mode electron');
    } else {
      console.log('Mode web');
    }

    if (this.hexoService.isCurrentDirectoryProjectFolder()) {
      this.router.navigate(['dashboard/article']);
    }
  }
}
