import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { UtilsService } from './../../services/utils.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { HexoService } from '../../services/hexo.service';
import { ServerService } from '../../services/server.service';
import { AppConfig } from '../../../environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public tplModal: NzModalRef;
  public currentLink: string;
  public isDeploying = false;
  public version: string = AppConfig.version;

  private routeSubscription: Subscription;

  constructor(
    private postService: PostService,
    private modalService: NzModalService,
    private utilsService: UtilsService,
    private hexoService: HexoService,
    private message: NzMessageService,
    public serverService: ServerService
  ) {
  }

  ngOnInit() {
  }

  public createModal(tplContet): void {
    this.modalService.create({
      nzTitle: 'NEW POST',
      nzContent: tplContet,
      nzFooter: null,
      nzClosable: false,
      nzOnOk: () => new Promise((resolve) => window.setTimeout(resolve, 1000))
    });
  }

  public openTerminal() {
    this.utilsService.openTerminal();
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
      });;
    }
  }
}