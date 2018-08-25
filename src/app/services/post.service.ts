import { Injectable } from '@angular/core';
import { HexoService } from './hexo.service';
import { BehaviorSubject } from 'rxjs';
import { Post } from '../Models/Post.interface';
import { Article } from '../Models/Article';
import { ElectronService } from './electron.service';
import { SystemSettingsService } from './system-settings.service';
import { ConfigService } from './config.service';
import { UtilsService } from './utils.service';
import * as moment from 'moment';
import 'rxjs/add/operator/combineLatest';

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

  public getArticleLocalById(postId: string) {
    return this.articles$.getValue().find( (post) => post._id === postId);
  }

  public checkIfExistPost(articleTitle: string): boolean {
    const articles = this.articles$.getValue();
    return articles.findIndex(article => {
      return article.title === articleTitle;
    }) === -1 ? false : true;
  }

  public findPostBySlug(slug: string): Post {
    const articles = this.articles$.getValue();
    return articles.find(article => {
      return article.slug === slug;
    });
  }

  public create(post: Post): Promise<any> {
    return this.hexoService._hexo.post.create(post, true)
      .then((data) => {
        console.log('create article ok');
        this.hexoService.load().then(() => {
          this.getArticles();
        });
        return data;
      })
      .catch((error) => {
        console.error('create article error', error);
        throw error;
      });
  }

  public update(updatePost: Post): Promise<any> {
    return this.electronService.fs.writeFile(updatePost.full_source, updatePost.raw)
      .then(() => {
        console.log('update article ok');
        this._updateLocalArticle(updatePost);
        return true;
      })
      .catch((error) => {
        console.error('update article error', error);
        throw error;
      });
  }

  public delete(path: string): Promise<any> {
    // TODO Remove folder if exist
    const pathWithoutExtension = path.replace(/\.[^/.]+$/, '');
    return this.electronService.fs.unlink(path)
      .then(() => {
        console.log('delete article ok');
        this.hexoService.load().then(() => {
          this.getArticles();
        });
      })
      .catch((error) => {
        console.log('delete article error', error);
        throw error;
      });
  }

  public _updateLocalArticle(updatePost: Post) {
    const articles = this.articles$.getValue();

    const articleIndex = articles.findIndex(article => article._id === updatePost._id);
    articles[articleIndex] = { ...articles[articleIndex], ...updatePost};

    this.articles$.next(articles);
  }

  public publish(post: Post): Promise<any> {
    return this.hexoService._hexo.post.publish({slug: post.slug}, true)
      .then((data) => {
        console.log('publish draft ok');
        this.hexoService.load().then(() => {
          this.getArticles();
        });
        return data;
      })
      .catch((error) => {
        console.error('publish draft error', error);
        throw error;
      });
  }

  public renderArticle(post: Post) {
    console.log(this.hexoService._hexo.post.render('test.md', {content: post.raw}).then((...arg) => {
      console.log(arg);
    }));
  }
}
