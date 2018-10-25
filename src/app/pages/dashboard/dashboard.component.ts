import { Component, OnDestroy, OnInit } from '@angular/core';
import { HexoService } from '../../services/hexo.service';
import { ConfigService } from '../../services/config.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  private _configYmlSubscription: Subscription;

  constructor(
    private hexoService: HexoService,
    private configService: ConfigService,
    private router: Router
  ) { }

  ngOnInit() {
    this.configService.getConfigYml();
    this._configYmlSubscription = this.configService.configYml$.subscribe((configYmlData) => {
      if (configYmlData) { this.router.navigate(['/dashboard/post']); }
    });
  }

  ngOnDestroy() {
    this._configYmlSubscription.unsubscribe();
  }

}
