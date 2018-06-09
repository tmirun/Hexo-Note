import { Injectable } from '@angular/core';
import * as Hexo from 'hexo';

@Injectable({
  providedIn: 'root'
})
export class HexoService {

  public _hexo: typeof Hexo;

  constructor() { }

  public init() {
    const _Hexo = window.require('hexo');
    this._hexo = new _Hexo('/Users/guang/projects/blog');

    // init
    return this._hexo.init().then(() => {
      // load sources and watching changes
      return this._hexo.watch().then(function() {
        console.log('hexo change', arguments);
      });
    });
  }
}
