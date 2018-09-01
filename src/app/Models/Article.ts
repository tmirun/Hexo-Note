import * as moment from 'moment';
import * as uuid4 from 'uuid/v4';
import { Article as ArticleInterface } from './Article.interface';
import * as yaml from 'js-yaml';

export class Article implements ArticleInterface {
  public _id?: string;
  private _raw?: string;
  private _info?: string;
  private _content?: string;

  public published?: boolean;
  public asset_dir?: string;
  public path?: string;
  public file?: string;
  public fileName?: string;
  public updated?: moment.Moment;
  public created?: moment.Moment;

  // hexo info
  public date?: moment.Moment;
  public title?: string;
  public tags?: string[];
  public categories?: string | string[];

  constructor(
    { title = '',
      raw = '',
      published = false,
      asset_dir = '',
      path = '',
      file = '',
      fileName = '',
      updated = moment(),
      created = moment(),
      date = moment()
    }: ArticleInterface) {

    this._id = uuid4();
    this.created = created;
    this.date = date;
    if (! moment.isMoment(this.date)) {
      this.date = moment(this.date);
    }
    this.title = title;
    this.raw = raw;
    this.published = published;
    this.asset_dir = asset_dir;
    this.path = path;
    this.file = file;
    this.fileName = fileName;
    this.updated = updated;
  }

  get raw(): string {
    return this._raw;
  }

  set raw(value: string) {
    this._raw = value;
    this._parseArticleInfoAndContent(this._raw);
  }

  get info(): string {
    return this._info;
  }

  set info(value: string) {
    this._info = value;
    this._raw = this._info + this._content;
  }

  get content(): string {
    return this._content;
  }

  set content(value: string) {
    this._content = value;
    this._raw = this._info + this._content;
  }

  public refreshInfoAndContent() {
    this._parseArticleInfoAndContent(this._raw);
  }

  private _parseArticleInfoAndContent(raw: string) {
    const regex = /(---([.\s\S]+?)---)([.\s\S]*)/g;
    const match = regex.exec(raw);
    const info = match[1];
    const content = match[3];
    try {
      const articleInfoItems = yaml.safeLoad(match[2]);
      this._parseArticleInfoItems(articleInfoItems);
      this._info = info;
      this._content = content;
    } catch (e) {
      console.error(e);
      this._content = raw;
    }

  }

  private _parseArticleInfoItems(articleInfoItems = {}) {
    for (const key in articleInfoItems) {
      if (articleInfoItems.hasOwnProperty(key)) {
        if (articleInfoItems[key] instanceof Date) {
          articleInfoItems[key] = moment(articleInfoItems[key]);
        }
        this[key] = articleInfoItems[key];
      }
    }
  }



}
