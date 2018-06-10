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

  private postSubscription;

  constructor(
    private postService: PostService
  ) {

    this.postSubscription = this.postService.posts$.subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }

  ngOnInit() {
    console.log(this.postService.getArticles());
  }

  ngOnDestroy() {
    this.postSubscription.unsubscribe();
  }

}
