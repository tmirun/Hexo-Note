import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { SystemSettingsService } from './system-settings.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private electronService: ElectronService,
    private systemSettingsService: SystemSettingsService,
  ) {
  }

  public isWindows() {
    return process.platform === 'win32';
  }

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

  public findFilesInDir(startPath: string, filter: string): string[] {
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
      if (filename.indexOf(filter) >= 0) {
        results.push(filename);
      }
    }
    return results;
  }
}
