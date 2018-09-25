import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { AppConfig } from './environments/environment';

import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/yaml/yaml';
import * as fixPath from 'fix-path';
import { utils } from '../common/utils';

import { shim } from 'promise.prototype.finally';
shim();

if (AppConfig.production) {
  enableProdMode();
}

if (utils.isPro) {
  fixPath();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    preserveWhitespaces: false
  })
  .catch(err => console.error(err));
