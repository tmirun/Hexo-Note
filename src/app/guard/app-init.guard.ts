import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { ConfigService } from '../services/config.service';
import {HexoService} from '../services/hexo.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private hexoService: HexoService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.hexoService.isCurrentDirectoryProjectFolder()) {
      return true;
    } else {
      this.router.navigate(['not-project-found']);
      return false;
    }
  }
}
