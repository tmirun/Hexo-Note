import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { UtilsService } from './../../services/utils.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public tplModal: NzModalRef;

  constructor(
    private postService: PostService,
    private modalService: NzModalService,
    private utilsService: UtilsService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    // this.createModal();
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
    const deployMessageId = this.message.loading('Action in progress..', { nzDuration: 0 }).messageId;
    this.utilsService.deploy().then(() => {
      this.message.success('DEPLOY OK');
      this.message.remove(deployMessageId);
    }).catch((error) => {
      this.message.remove(deployMessageId);
      this.message.error(`DEPLOY ERROR ${error}`);
    });
  }
}
