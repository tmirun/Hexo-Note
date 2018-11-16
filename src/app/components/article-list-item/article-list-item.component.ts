import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Article} from '../../Models/Article';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ArticleService} from '../../services/article.service';
import {RenameArticleModalComponent} from '../rename-article-modal/rename-article-modal.component';
import {ConfigService} from '../../services/config.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-article-list-item',
  templateUrl: './article-list-item.component.html',
  styleUrls: ['./article-list-item.component.scss']
})
export class ArticleListItemComponent implements OnInit, OnDestroy {

  @Input() article: Article;

  public isPostAssetFolderActive = false;
  private configJsonSubscription: Subscription;

  constructor(
    private articleService: ArticleService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private configService: ConfigService
  ) { }

  ngOnInit() {
    this.configJsonSubscription = this.configService.configJson$.subscribe((configJson) => {
      this.isPostAssetFolderActive = configJson.post_asset_folder;
    });
  }

  ngOnDestroy() {
    this.configJsonSubscription.unsubscribe();
  }

  public removeArticle() {
    this.modalService.confirm({
      nzTitle: 'REMOVE ARTICLE',
      nzContent: 'DO YOU WANT REMOVE ARTICLE:' + this.article.title,
      nzOnOk: () => new Promise((resolve, reject) => {
        this.articleService.delete(this.article).then(() => {
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
      nzContent: RenameArticleModalComponent,
      nzComponentParams: {
        article: this.article
      },
      nzFooter: null
    });
  }

  public openAssetFolder() {
    const isOpened = this.articleService.openAssetFolder(this.article.asset_dir);
    if (isOpened) {
      this.message.success('FOLDER IS OPENED');
    } else {
      this.message.error('OPEN FOLDER FAIL, MAY BE NOT EXIST');
    }
  }

}
