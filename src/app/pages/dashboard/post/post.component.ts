import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../../../services/post.service';
import { Post } from '../../../Models/Post.interface';
import { Subscription } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {

  public posts: Post[];
  public drafts: Post[];

  private postsSubscription: Subscription;
  private draftsSubscription: Subscription;

  constructor(
    private postService: PostService,
    private modalService: NzModalService
  ) {

    this.postsSubscription = this.postService.posts$.subscribe((posts: Post[]) => {
      this.posts = posts;
      this.posts.sort((a, b) =>  b.date.valueOf() - a.date.valueOf());
    });

    this.draftsSubscription = this.postService.drafts$.subscribe((drafts: Post[]) => {
      this.drafts = drafts;
      this.drafts.sort((a, b) =>  b.date.valueOf() - a.date.valueOf());
    });
  }

  public removeArticle(article: Post) {
    this.modalService.confirm({
      nzTitle: 'REMOVE ARTICLE',
      nzContent: 'DO YOU WANT REMOVE ARTICLE:' + article.title,
      nzOnOk: () => new Promise((resolve, reject) => {
        this.postService.delete(article.full_source).then(() => {
          resolve();
        }).catch((error) => {
          reject(error);
        });
      }).catch((error) => console.log('ERROR REMOVE ARTICLE', error))
    });
  }

  ngOnInit() {
    this.postService.getArticles();
  }

  ngOnDestroy() {
    this.postsSubscription.unsubscribe();
    this.draftsSubscription.unsubscribe();
  }
}
