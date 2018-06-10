import { Injectable } from '@angular/core';
import { HexoService } from './hexo.service';
import { BehaviorSubject } from 'rxjs';
import { Post } from '../Models/Post.interface';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  public posts$: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public drafts$: BehaviorSubject<any[]> = new BehaviorSubject([]);

  constructor(
    private hexoService: HexoService
  ) {
    console.log(this.hexoService._hexo.locals.toObject());
  }

  public getArticles() {
    const articles: Post[] = this.hexoService._hexo.locals.get('posts');
    const drafts = [];
    const posts = [];
    articles.forEach((article) => {
      if (article.published) {
        posts.push(article);
      } else {
        drafts.push(article);
      }
    });
    this.posts$.next(posts);
    this.drafts$.next(drafts);
    return this.hexoService._hexo.locals.get('posts');
  }
}
