import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {ConfigService} from '../services/config.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigInitGuard implements CanActivate {

  constructor(
    private configService: ConfigService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    this.configService.getConfigYml();

    return this.configService.configYml$
      .filter(configYmlData => !!configYmlData) // only pass if not empty
      .map((configYmlData) => {
        return !!configYmlData;
      });
  }
}
