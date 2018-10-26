import { Component, OnInit } from '@angular/core';
import { HexoService } from '../../services/hexo.service';
import { NzModalService } from 'ng-zorro-antd';
import { NewBlogModalComponent } from '../../components/new-blog-modal/new-blog-modal.component';
import { ElectronService } from '../../services/electron.service';
import { Route, Router } from '@angular/router';
import {SystemSettingsService} from '../../services/system-settings.service';

@Component({
  selector: 'app-not-project-found',
  templateUrl: './not-project-found.component.html',
  styleUrls: ['./not-project-found.component.scss']
})
export class NotProjectFoundComponent implements OnInit {

  constructor(
    private hexoService: HexoService,
    private modalService: NzModalService,
    private electronService: ElectronService,
    private system: SystemSettingsService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  public openNewBlogDialog() {
    this.modalService.create({
      nzTitle: 'NEW HEXO BLOG',
      nzContent: NewBlogModalComponent,
      nzFooter: null
    });
  }

  public openExistingProjectDialog() {
    const path = this.hexoService.openSelectHexoDirectoryDialog();
    if (path) {
      this.system.saveHexoPath(path);
      this.electronService.remote.getCurrentWindow().reload();
    }
  }

  public openHexoSetupPage() {
    this.electronService.shell.openExternal('https://hexo.io/docs/setup');
  }

}
