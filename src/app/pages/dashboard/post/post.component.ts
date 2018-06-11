import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../../../services/post.service';
import { Post } from '../../../Models/Post.interface';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {

  public posts: Post[];
  public drafts: Post[];
  public test = 'fdsa';

  private postsSubscription;
  private draftsSubscription;

  constructor(
    private postService: PostService
  ) {

    this.postsSubscription = this.postService.posts$.subscribe((posts: Post[]) => {
      this.posts = posts;
      this.posts.sort((a, b) =>  b.date.valueOf() - a.date.valueOf());
    });

    this.draftsSubscription = this.postService.posts$.subscribe((drafts: Post[]) => {
      this.drafts = drafts;
      this.drafts.sort((a, b) =>  b.date.valueOf() - a.date.valueOf());
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
