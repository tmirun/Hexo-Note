import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { SystemSettingsService } from './system-settings.service';
import { utils } from '../../../common/utils';

@Injectable({
  providedIn: 'root'
})
export class UtilsService  {

  constructor(
    private electronService: ElectronService,
    private systemSettingsService: SystemSettingsService,
  ) {
  }

  public isWindows() {
    return process.platform === 'win32';
  }

  public isMac() {
    return navigator.platform.match('Mac');
  }

  public isDev() { return utils.isDev(); }

  public isPro() { return utils.isPro(); }

  public openTerminal() {
    const path = this.systemSettingsService.getHexoPath();
    const childProcess = this.electronService.childProcess;
    const { spawn } = childProcess;
    switch (process.platform) {
      case 'win32':
        childProcess.exec(`start cmd.exe /K cd /D {path}`);
        break;
      case 'linux':
        const terminal = 'gnome-terminal';
        spawn (terminal, { cwd: path } as any);
        // openTerminalAtPath.on ('error', (err) => { console.log (err); });
        break;
      case 'darwin':
        spawn ('open', [ '-a', 'Terminal', path ]);
        // openTerminalAtPath.on ('error', (err) => { console.log (err); });
        break;
    }
  }

  public removeFileExtension(filename): string {
    return filename.replace(/\.[^/.]+$/, '');
  }

  public clipboardHasFormat (format) {
    const clipboard = this.electronService.clipboard;
    const formats = clipboard.availableFormats();
    for (let i = 0; i < formats.length; i++) {
      if (formats[i].includes(format)) {
        return true;
      }
    }
    return false;
  }

  public createDirIfNotExist(path: string): boolean {
    if (this.electronService.fs.existsSync(path)) {
      return true;
    } else {
      this.electronService.fs.mkdirSync(path);
      console.warn(`file is not exist, creating: ${path}`);
      return false;
    }
  }

  public findFilesInDir(startPath: string, filter?: string): string[] {
    const results = [];
    const fs = this.electronService.fs;
    const path = this.electronService.path;
    if (!fs.existsSync(startPath)) {
      console.log('no dir ', startPath);
      return results;
    }

    const files = fs.readdirSync(startPath);
    for (let i = 0; i < files.length; i++) {
      const filename = path.join(startPath, files[i]);
      if (!filter || filename.indexOf(filter) >= 0) {
        results.push(filename);
      }
    }
    return results;
  }

  // https://stackoverflow.com/questions/31917891/node-how-to-remove-a-directory-if-exists
  public rmdir (dir) {
    const list = this.electronService.fs.readdirSync(dir);
    for (let i = 0; i < list.length; i++) {
      const filename = this.electronService.path.join(dir, list[i]);
      const stat = this.electronService.fs.statSync(filename);

      if (filename === '.' || filename === '..') {
        // pass these files
      } else if (stat.isDirectory()) {
        // rmdir recursively
        this.rmdir(filename);
      } else {
        // rm fiilename
        this.electronService.fs.unlinkSync(filename);
      }
    }
    console.log('dir delete:', dir);
    this.electronService.fs.rmdirSync(dir);
  }
}
