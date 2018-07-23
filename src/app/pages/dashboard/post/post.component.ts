import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../../../services/post.service';
import { Post } from '../../../Models/Post.interface';
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

  public posts: Post[];
  public drafts: Post[];
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
      .switchMap( (posts: Post[]) => {
        return searchFormObservable.map((query) => {
          return posts.filter(post => query ? post.title.toUpperCase().includes(query.toUpperCase()) : true);
        });
      })
      .subscribe((posts: Post[]) => {
        this.posts = posts;
        this.posts.sort((a, b) =>  b.date.valueOf() - a.date.valueOf());
      });

    this.draftsSubscription = this.postService.drafts$
      .switchMap( (drafts: Post[]) => {
        return searchFormObservable.map((query) => {
          return drafts.filter(draft =>  query ? draft.title.toUpperCase().includes(query.toUpperCase()) : true);
        });
      })
      .subscribe((drafts: Post[]) => {
        this.drafts = drafts;
        this.drafts.sort((a, b) =>  b.date.valueOf() - a.date.valueOf());
      });

    this.searchFormControl.patchValue('');
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
