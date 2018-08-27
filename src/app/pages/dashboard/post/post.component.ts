import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../../../services/post.service';
import { Article } from '../../../Models/Article';
import { Subscription } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/shareReplay';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {

  public posts: Article[];
  public drafts: Article[];
  public searchFormControl = new FormControl('');
  public searchOptions: string[] = [];

  private postsSubscription: Subscription;
  private draftsSubscription: Subscription;

  constructor(
    private postService: PostService,
    private modalService: NzModalService
  ) {

    const searchFormObservable = this.searchFormControl.valueChanges.shareReplay(1).debounceTime(300);

    this.postsSubscription = this.postService.posts$
      .switchMap( (posts: Article[]) => {
        return searchFormObservable.map((query) => {
          return posts.filter(post => query ? post.title.toUpperCase().includes(query.toUpperCase()) : true);
        });
      })
      .subscribe((posts: Article[]) => {
        this.posts = posts;
        this.posts.sort((a, b) =>  b.date.valueOf() - a.date.valueOf());
      });

    this.draftsSubscription = this.postService.drafts$
      .switchMap( (drafts: Article[]) => {
        return searchFormObservable.map((query) => {
          return drafts.filter(draft =>  query ? draft.title.toUpperCase().includes(query.toUpperCase()) : true);
        });
      })
      .subscribe((drafts: Article[]) => {
        this.drafts = drafts;
        this.drafts.sort((a, b) =>  b.date.valueOf() - a.date.valueOf());
      });

    this.searchFormControl.patchValue('');
  }

  ngOnInit() {
    this.postService.getArticles();
    this.postService.startWatchArticle();
  }

  ngOnDestroy() {
    this.postsSubscription.unsubscribe();
    this.draftsSubscription.unsubscribe();
    this.postService.stopWatchArticle();
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
