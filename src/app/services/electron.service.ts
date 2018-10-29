import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote, shell, clipboard} from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs-extra';
import * as yaml from 'js-yaml';
import * as path from 'path';

import chokidar from 'chokidar';

@Injectable()
export class ElectronService {

  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  process: any;
  shell: typeof shell;
  clipboard: typeof clipboard;
  app: typeof remote.app;

  childProcess: typeof childProcess;
  fs: typeof fs;
  yaml: typeof yaml;
  path: typeof path;

  watcher: typeof chokidar;

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;
      this.process = this.remote.process;
      this.shell = window.require('electron').shell;
      this.clipboard = window.require('electron').clipboard;
      this.app = this.remote.app;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs-extra');
      this.yaml = window.require('js-yaml');
      this.path = window.require('path');

      this.watcher = window.require('chokidar');
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  }

}
