import { Component, OnInit } from '@angular/core';
import { HexoService } from '../../services/hexo.service';
import {NzModalService} from 'ng-zorro-antd';
import {NewBlogModalComponent} from '../../components/new-blog-modal/new-blog-modal.component';

@Component({
  selector: 'app-not-project-found',
  templateUrl: './not-project-found.component.html',
  styleUrls: ['./not-project-found.component.scss']
})
export class NotProjectFoundComponent implements OnInit {

  constructor(
    private hexoService: HexoService,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
  }

  openNewBlogDialog() {
    this.modalService.create({
      nzTitle: 'NEW HEXO BLOG',
      nzContent: NewBlogModalComponent,
      nzFooter: null
    });
  }

}
