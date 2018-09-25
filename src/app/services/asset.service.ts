import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  constructor(
    private electronService: ElectronService,
    private utilsService: UtilsService
  ) {}

  public saveImageToAssetDir(assetDir = '', file = '', imageData = ''): Promise<any> {
    this.utilsService.createDirIfNotExist(assetDir);
    const path = this.electronService.path;
    const fs = this.electronService.fs;
    const imageFilePath = path.join(assetDir, file);
    return this.electronService.fs.writeFile(imageFilePath, imageData)
      .then((...arg) => {
        console.log('save image ok');
        return true;
      })
      .catch((err) => {
        console.error('save image error', err);
        throw err;
      });
  }

  public getAssetsPath(assetDir: string): string[] {
   return this.utilsService.findFilesInDir(assetDir);
  }

  public checkIfExistFileName(assetDir: string, fileName: string): boolean {
    const path = this.electronService.path;
    const files = this.getAssetsPath(assetDir).map((filesPath) => path.basename(filesPath));
    for (let i = 0; i < files.length; i++ ) {
      if (files.includes(fileName)) { return true; }
    }
    return false;
  }
}
