import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { HexoService } from '../services/hexo.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMapTo';
import {ConfigService} from '../services/config.service';

@Injectable({
  providedIn: 'root'
})
export class HexoInitGuard implements CanActivate {
  constructor(
    private hexoService: HexoService,
    private configService: ConfigService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.configService.configYml$
      .switchMapTo(this.hexoService.isInit$);
  }
}
