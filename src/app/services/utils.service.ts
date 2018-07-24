import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { SystemSettingsService } from './system-settings.service';
import { HexoService } from './hexo.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private electronService: ElectronService,
    private systemSettingsService: SystemSettingsService,
    private hexoService: HexoService
  ) {
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
}
