import { Injectable } from '@angular/core';
import { HexoService } from './hexo.service';
import { BehaviorSubject } from 'rxjs';
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

  public articles$: BehaviorSubject<Article[]> = new BehaviorSubject([]); // save posts and drafts
  public posts$: BehaviorSubject<Article[]> = new BehaviorSubject([]); // only save posts
  public drafts$: BehaviorSubject<Article[]> = new BehaviorSubject([]); // only save drafts

  constructor(
    private hexoService: HexoService,
    private electronService: ElectronService,
    private systemSettingsService: SystemSettingsService,
    private configService: ConfigService,
    private utilsService: UtilsService
  ) {
    this.posts$.combineLatest(this.drafts$).subscribe(([posts, drafts]) => {
      this.articles$.next([...posts, ...drafts]);
    });
  }

  public getArticles() {
    this.getPosts();
    this.getDrafts();
  }

  public getPosts(): Article[] {
    const articles = this.getPostsPath().map((path) => {
      const article = this._parseArticleFromPath(path);
      article.published = true;
      return article;
    });
    this.posts$.next(articles);
    return articles;
  }

  public getDrafts(): Article[] {
    const articles = this.getDraftsPath().map((path) => {
      const article = this._parseArticleFromPath(path);
      article.published = false;
      return article;
    });
    this.drafts$.next(articles);
    return articles;
  }

  public getPostsPath(): string[] {
    return this.utilsService.findFilesInDir(this.getPostPath(), '.md');
  }

  public getDraftsPath(): string[] {
    return this.utilsService.findFilesInDir(this.getDraftPath(), '.md');
  }

  public getArticleLocalById(postId: string) {
    return this.articles$.getValue().find( (post) => post._id === postId);
  }

  private _parseArticleFromPath(path: string): Article {
    const title = this.electronService.path.basename(path, '.md');
    const file = this.electronService.path.basename(path);
    const raw =  this.electronService.fs.readFileSync(path, 'utf8');
    const stat = this.electronService.fs.statSync(path);
    const updated = moment(stat.mtime);
    const created = moment(stat.ctime);
    return new Article({ title, file, path, raw, updated, created});
  }

  public checkIfExistPost(articleTitle: string): boolean {
    const articles = this.articles$.getValue();
    return articles.findIndex(article => {
      return article.title === articleTitle;
    }) === -1 ? false : true;
  }

  public findArticleBySlug(slug: string): any {
    // const articles = this.articles$.getValue();
    // return articles.find(article => {
    //   return article.slug === slug;
    // });
  }

  public create(post: Article): any {
    // return this.hexoService._hexo.post.create(post, true)
    //   .then((data) => {
    //     console.log('create article ok');
    //     this.hexoService.load().then(() => {
    //       this.getArticles();
    //     });
    //     return data;
    //   })
    //   .catch((error) => {
    //     console.error('create article error', error);
    //     throw error;
    //   });
  }

  public update(updateArticle: Article): Promise<any> {
    return this.electronService.fs.writeFile(updateArticle.path, updateArticle.raw)
      .then(() => {
        console.log('update article ok');
        this._updateLocalArticle(updateArticle);
        return true;
      })
      .catch((error) => {
        console.error('update article error', error);
        throw error;
      });
  }

  public delete(path: string): any {
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

  public _updateLocalArticle(updateArticle: Article) {
    const articles = this.articles$.getValue();

    const articleIndex = articles.findIndex(article => article._id === updateArticle._id);
    articles[articleIndex] = { ...articles[articleIndex], ...updateArticle};

    this.articles$.next(articles);
  }

  public publish(post: Article): Promise<any> {
    // return this.hexoService._hexo.post.publish({slug: post.slug}, true)
    //   .then((data) => {
    //     console.log('publish draft ok');
    //     this.hexoService.load().then(() => {
    //       this.getArticles();
    //     });
    //     return data;
    //   })
    //   .catch((error) => {
    //     console.error('publish draft error', error);
    //     throw error;
    //   });
  }

  public getPostPath(): string {
    const hexoPath = this.systemSettingsService.getHexoPath();
    const sourcePath = this.configService.configJson$.getValue().source_dir;

    if (!hexoPath || ! sourcePath ) { return undefined; }
    return `${hexoPath}/${sourcePath}/_posts`;
  }

  public getDraftPath(): string {
    const hexoPath = this.systemSettingsService.getHexoPath();
    const sourcePath = this.configService.configJson$.getValue().source_dir;

    if (!hexoPath || ! sourcePath ) { return undefined; }
    return `${hexoPath}/${sourcePath}/_drafts`;
  }
}
