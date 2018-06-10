import { Injectable } from '@angular/core';
import * as Hexo from 'hexo';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HexoService {

  public _hexo: typeof Hexo;
  public isInit$: Subject<boolean> = new Subject();

  constructor() { }

  public init() {
    const _Hexo = window.require('hexo');
    this._hexo = new _Hexo('/Users/guang/projects/blog', {
      drafts: true
    });

    // init
    return this._hexo.init().then(() => {
      // load sources and watching changes
      return this._hexo.watch().then((...arg) => {
        console.log('watch change', arg);
        this.isInit$.next(true);
      });
    });
  }

  public end() {
    this._hexo.unwatch();
  }
}
