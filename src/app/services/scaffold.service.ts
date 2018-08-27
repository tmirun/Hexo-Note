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
  ) { }

  public getDraftTemplate(): Promise<string> {
    return this.hexoService._hexo.scaffold.get('draft')
      .then((template: string) => {
        this.draft$.next(template);
        console.log('get draft template ok');
        return template;
      })
      .catch((error) => {
        console.error('get draft template error:', error);
        throw error;
      });
  }

  public getPostTemplate(): Promise<string> {
    return this.hexoService._hexo.scaffold.get('draft')
      .then((template: string) => {
        this.post$.next(template);
        console.log('get post template ok');
        return template;
      })
      .catch((error) => {
        console.error('get post template error:', error);
        throw error;
      });
  }

  public getPageTemplate(): Promise<string> {
    return this.hexoService._hexo.scaffold.get('page')
      .then((template: string) => {
        this.page$.next(template);
        console.log('get page template ok');
        return template;
      })
      .catch((error) => {
        console.error('get page template error:', error);
        throw error;
      });
  }
}
