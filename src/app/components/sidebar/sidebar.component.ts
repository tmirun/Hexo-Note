import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { UtilsService } from './../../services/utils.service';
import { NzMessageService } from 'ng-zorro-antd';
import { HexoService } from '../../services/hexo.service';
import { ServerService } from '../../services/server.service';
import { AppConfig } from '../../../environments/environment';
import { ElectronService } from '../../services/electron.service';
import {RenameArticleModalComponent} from '../rename-article-modal/rename-article-modal.component';
import {NewArticleFormComponent} from '../new-article-form/new-article-form.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public isDeploying = false;
  public version: string = AppConfig.version;

  constructor(
    private modalService: NzModalService,
    private utilsService: UtilsService,
    private hexoService: HexoService,
    private message: NzMessageService,
    private electronService: ElectronService,
    public serverService: ServerService
  ) {
  }

  ngOnInit() {
  }

  public openNewArticleModal() {
    this.modalService.create({
      nzTitle: 'RENAME FILE',
      nzContent: NewArticleFormComponent,
      nzFooter: null
    });
  }

  public openTerminal() {
    this.utilsService.openTerminal();
  }

  public confirmDeploy() {
    this.modalService.confirm({
      nzTitle: 'DEPLOY',
      nzContent: 'DO YOU WANT DEPLOY THE PROJECT?',
      nzOnOk: () => { this.deploy(); }
    });
  }

  public deploy() {
    this.isDeploying = true;
    const deployMessageId = this.message.loading('Deploy in process..', { nzDuration: 0 }).messageId;
    this.hexoService.deployChildProcess()
      .then(() => this.message.success('DEPLOY OK'))
      .catch((error) => this.message.error(`DEPLOY ERROR ${error}`))
      .finally(() => {
        this.isDeploying = false;
        this.message.remove(deployMessageId);
      });
  }

  public switchServer() {
    if (this.serverService.isServerRunning) {
      this.serverService.stopServer();
      this.message.info('STOP SERVER');
    } else {
      this.message.info('STARTING SERVER');
      this.serverService.startServer().catch((error) => {
        this.message.error(`SERVER STARTING ERROR ${error}`);
      });
    }
  }

  public openIssuePage() {
    this.electronService.shell.openExternal('https://github.com/tmirun/Hexo-Note/issues');
  }
}
