import * as moment from 'moment';
import * as uuid4 from 'uuid/v4';
import { Article as ArticleInterface } from './Article.interface';

export class Article implements ArticleInterface {
  public _id?: string;
  public title?: string;
  public raw?: string;
  private _info?: string;
  private _content?: string;
  public published?: boolean;
  public asset_dir?: string;
  public path?: string;
  public file?: string;
  public fileName?: string;
  public updated?: moment.Moment;
  public created?: moment.Moment;
  public date?: moment.Moment;

  constructor(
    { title = '',
      raw = '',
      info = '',
      content = '',
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
    this.title = title;
    this.raw = raw;
    this.info = info;
    this.content = content;
    this.published = published;
    this.asset_dir = asset_dir;
    this.path = path;
    this.file = file;
    this.fileName = fileName;
    this.updated = updated;
    this.created = created;
    this.date = date;
    if (! moment.isMoment(this.date)) {
      this.date = moment(this.date);
    }
  }

  get info() {
    return this._info;
  }

  set info(value: string) {
    this._info = value;
    this.raw = this.info + this.content;
  }

  get content() {
    return this._content;
  }

  set content(value: string) {
    this._content = value;
    this.raw = this.info + this.content;
  }

}
