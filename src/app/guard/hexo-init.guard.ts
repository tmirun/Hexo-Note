import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { HexoService } from '../services/hexo.service';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class HexoInitGuard implements CanActivate {
  constructor(
    private hexoService: HexoService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.hexoService.isInit$.map((isInit: boolean) => {
      console.log(isInit);
      return isInit;
    });
  }
}
