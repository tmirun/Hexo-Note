import { Injectable } from '@angular/core';
import { HexoService } from './hexo.service';
import { BehaviorSubject } from 'rxjs';
import { Post } from '../Models/Post.interface';
import { ElectronService } from './electron.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  public articles$: BehaviorSubject<Post[]> = new BehaviorSubject([]); // save posts and drafts
  public posts$: BehaviorSubject<Post[]> = new BehaviorSubject([]); // only save posts
  public drafts$: BehaviorSubject<Post[]> = new BehaviorSubject([]); // only save drafts

  constructor(
    private hexoService: HexoService,
    private electronService: ElectronService
  ) {
    this.articles$.subscribe((articles) => {
      const drafts: Post[] = [];
      const posts: Post[] = [];

      articles.forEach((article) => {
        if (article.published) {
          posts.push(article);
        } else {
          drafts.push(article);
        }
      });

      this.drafts$.next(drafts);
      this.posts$.next(posts);
    });
  }

  public getArticles() {
    const _hexoArticles:  any = this.hexoService._hexo.locals.get('posts');
    this.articles$.next(_hexoArticles.data);
    return _hexoArticles;
  }

  public getArticleLocalById$(postId: string) {
    return this.articles$.getValue().find( (post) => post._id === postId);
  }

  public create(post: Post) {
    return this.hexoService._hexo.post.create(post, true).then(function() {
      console.log('ok', arguments);
    }).catch(function () {
      console.log('ko', arguments);
    });
  }

  public update(updatePost: Post): Promise<any> {
    return this.electronService.fs.writeFile(updatePost.full_source, updatePost.raw).then(() => {
      this._updateLocalArticle(updatePost);
      return true;
    });
  }

  public _updateLocalArticle(updatePost: Post) {
    const articles = this.articles$.getValue();

    const articleIndex = articles.findIndex(article => article._id === updatePost._id);
    articles[articleIndex] = { ...articles[articleIndex], ...updatePost};

    this.articles$.next(articles);
  }
}
