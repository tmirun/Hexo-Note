import { Component, OnInit, OnDestroy } from '@angular/core';
import { ArticleService } from '../../../services/article.service';
import { Article } from '../../../Models/Article';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/shareReplay';

@Component({
  selector: 'app-post',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit, OnDestroy {

  public posts: Article[];
  public drafts: Article[];
  public searchFormControl = new FormControl('');

  private postsSubscription: Subscription;
  private draftsSubscription: Subscription;

  constructor(
    private articleService: ArticleService,
  ) {

    const searchFormObservable = this.searchFormControl.valueChanges.shareReplay(1).debounceTime(300);

    this.postsSubscription = this.articleService.posts$
      .switchMap( (posts: Article[]) => {
        return searchFormObservable.map((query) => {
          return posts.filter(post => query ? post.title.toUpperCase().includes(query.toUpperCase()) : true);
        });
      })
      .subscribe((posts: Article[]) => {
        this.posts = posts;
        this.posts.sort((a, b) =>  b.date.valueOf() - a.date.valueOf());
      });

    this.draftsSubscription = this.articleService.drafts$
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
    this.articleService.getArticles();
    this.articleService.startWatchArticle();
  }

  ngOnDestroy() {
    this.postsSubscription.unsubscribe();
    this.draftsSubscription.unsubscribe();
    this.articleService.stopWatchArticle();
  }

}
