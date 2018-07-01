import { Injectable } from '@angular/core';
import { HexoService } from './hexo.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScaffoldService {

  public draft$: BehaviorSubject<string> = new BehaviorSubject('');
  public post$: BehaviorSubject<string> = new BehaviorSubject('');
  public page$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(
    private hexoService: HexoService
  ) {

  }

  public getDraftTemplate(): Promise <string> {
    return this.hexoService._hexo.scaffold.get('draft')
      .then((template: string) => {
        this.draft$.next(template);
        return template;
      });
  }

  public getPostTemplate() {
    return this.hexoService._hexo.scaffold.get('draft')
      .then((template: string) => {
        this.post$.next(template);
        return template;
      });
  }

  public getPageTemplate() {
    return this.hexoService._hexo.scaffold.get('page')
      .then((template: string) => {
        this.page$.next(template);
        return template;
      });
  }
}
