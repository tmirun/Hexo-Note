import { Injectable } from '@angular/core';
import { HexoService } from './hexo.service';
import { BehaviorSubject } from 'rxjs';
import { Article } from '../Models/Article';
import { Article as ArticleInterface } from '../Models/Article.interface';
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

  private _articleWatcher;

  public articles$: BehaviorSubject<Article[]> = new BehaviorSubject([]); // save posts and drafts
  public posts$: BehaviorSubject<Article[]> = new BehaviorSubject([]); // only save posts
  public drafts$: BehaviorSubject<Article[]> = new BehaviorSubject([]); // only save drafts

  constructor(
    private hexoService: HexoService,
    private electronService: ElectronService,
    private systemSettings: SystemSettingsService,
    private configService: ConfigService,
    private utilsService: UtilsService
  ) {
    this.posts$.combineLatest(this.drafts$).subscribe(([posts, drafts]) => {
      this.articles$.next([...posts, ...drafts]);
    });
  }

  public startWatchArticle() {
    this._articleWatcher = this.electronService.watcher.watch([this.getDraftPath(), this.getPostPath()],
      {
        interval: 100,
        ignoreInitial: true,
      });

    this._articleWatcher
      .on('add', path => {
        this.getArticles();
        console.log(`watch file ${path} has been added`);
      })
      .on('unlink', path => {
        this.getArticles();
        console.log(`watch file ${path} has been removed`);
      });
  }

  public stopWatchArticle() {
    if (this._articleWatcher) { this._articleWatcher.close(); }
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
    const file = this.electronService.path.basename(path);
    const asset_dir = path.replace(/\.[^/.]+$/, '');
    const fileName = this.electronService.path.basename(path, '.md');
    const raw =  this.electronService.fs.readFileSync(path, 'utf8');
    const stat = this.electronService.fs.statSync(path);
    const updated = moment(stat.mtime);
    const created = moment(stat.ctime);
    return new Article({ fileName, file, path, raw, updated, created, asset_dir});
  }

  public checkIfExistFileName(fileName: string): boolean {
    const articles = this.articles$.getValue();
    return articles.findIndex(article => {
      return article.fileName === fileName;
    }) === -1 ? false : true;
  }

  public create(article: ArticleInterface): Promise<any> {
      const layout = article.published ? 'post' : 'draft';
      return this.hexoService.exec(`hexo new ${layout} "${article.title}"`);
  }

  public update(updateArticle: Article): Promise<any> {
    return this.electronService.fs.writeFile(updateArticle.path, updateArticle.raw)
      .then(() => {
        console.log('update article ok');
        this._updateLocalArticle(updateArticle);
        updateArticle.refreshInfoAndContent();
        return true;
      })
      .catch((error) => {
        console.error('update article error', error);
        throw error;
      });
  }

  public delete(article: Article): any {
    // TODO Remove folder if exist

    if (article.asset_dir && this.electronService.fs.existsSync(article.asset_dir)) {
      this.utilsService.rmdir(article.asset_dir);
    }
    return this.electronService.fs.unlink(article.path)
      .then(() => {
        console.log('delete article ok');
      })
      .catch((error) => {
        console.log('delete article error', error);
        throw error;
      });
  }

  public _updateLocalArticle(updateArticle: Article) {
    const articles = this.articles$.getValue();

    const articleIndex = articles.findIndex(article => article._id === updateArticle._id);
    articles[articleIndex] = updateArticle;

    this.articles$.next(articles);
  }

  public publish(article: Article): Promise<any> {
    return this.hexoService.exec(`hexo publish "${article.title}"`);
  }

  public getPostPath(): string {
    const hexoPath = this.systemSettings.getHexoPath();
    const sourcePath = this.configService.configJson$.getValue().source_dir;

    if (!hexoPath || ! sourcePath ) { return undefined; }
    return `${hexoPath}/${sourcePath}/_posts`;
  }

  public getDraftPath(): string {
    const hexoPath = this.systemSettings.getHexoPath();
    const sourcePath = this.configService.configJson$.getValue().source_dir;

    if (!hexoPath || ! sourcePath ) { return undefined; }
    return `${hexoPath}/${sourcePath}/_drafts`;
  }

  public rename(article: Article, newFileName: string): any {
    const promises = [];
    const existAssetDir = this.existArticleAssetDir(article.path);
    const newFile = article.file.replace(article.fileName, newFileName);
    const newFilePath = article.path.replace(article.file, newFile);
    if (existAssetDir) {
      const newAssetDir = article.asset_dir.replace(article.fileName, newFileName);
      promises.push(this.electronService.fs.rename(article.asset_dir, newAssetDir));
    }
    promises.push(this.electronService.fs.rename(article.path, newFilePath))
    return Promise.all(promises);
  }

  public existArticleAssetDir(path) {
    return this.electronService.fs.existsSync(path);
  }

  public openAssetFolder(assetFolder: string): boolean {
    return this.electronService.shell.openItem(assetFolder);
  }

}
