import {Component, Input, OnInit} from '@angular/core';
import {Article} from '../../Models/Article';
import {NzModalService} from 'ng-zorro-antd';
import {PostService} from '../../services/post.service';

@Component({
  selector: 'app-article-list-item',
  templateUrl: './article-list-item.component.html',
  styleUrls: ['./article-list-item.component.scss']
})
export class ArticleListItemComponent implements OnInit {

  @Input() article: Article;

  constructor(
    private postService: PostService,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
  }

  public removeArticle(article: Article) {
    this.modalService.confirm({
      nzTitle: 'REMOVE ARTICLE',
      nzContent: 'DO YOU WANT REMOVE ARTICLE:' + article.title,
      nzOnOk: () => new Promise((resolve, reject) => {
        this.postService.delete(article).then(() => {
          resolve();
        }).catch((error) => {
          reject(error);
        });
      }).catch((error) => console.log('ERROR REMOVE ARTICLE', error))
    });
  }

}
