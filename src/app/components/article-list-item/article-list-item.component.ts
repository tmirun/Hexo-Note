import {Component, Input, OnInit} from '@angular/core';
import {Article} from '../../Models/Article';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {PostService} from '../../services/post.service';
import {RemanePostModalComponent} from '../remane-post-modal/remane-post-modal.component';

@Component({
  selector: 'app-article-list-item',
  templateUrl: './article-list-item.component.html',
  styleUrls: ['./article-list-item.component.scss']
})
export class ArticleListItemComponent implements OnInit {

  @Input() article: Article;

  constructor(
    private postService: PostService,
    private modalService: NzModalService,
    private message: NzMessageService,
  ) { }

  ngOnInit() {
  }

  public removeArticle() {
    this.modalService.confirm({
      nzTitle: 'REMOVE ARTICLE',
      nzContent: 'DO YOU WANT REMOVE ARTICLE:' + this.article.title,
      nzOnOk: () => new Promise((resolve, reject) => {
        this.postService.delete(this.article).then(() => {
          resolve();
        }).catch((error) => {
          reject(error);
        });
      }).catch((error) => {
        console.log('ERROR REMOVE ARTICLE', error);
        this.message.error('ERROR REMOVE ARTICLE ' + error);
      })
    });
  }

  public rename() {
    this.modalService.create({
      nzTitle: 'RENAME FILE',
      nzContent: RemanePostModalComponent,
      nzComponentParams: {
        article: this.article
      },
      nzFooter: null
    });
  }

}
