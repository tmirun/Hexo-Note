import * as moment from 'moment';
import * as uuid4 from 'uuid/v4';
import { Article as ArticleInterface } from './Article.interface';

export class Article implements ArticleInterface {
  _id?: string;
  title?: string;
  raw?: string;
  published?: boolean;
  asset_dir?: string;
  path?: string;
  file?: string;
  updated?: moment.Moment;
  created?: moment.Moment;
  date?: moment.Moment;

  constructor(
    { asset_dir = '',
      path = '',
      file = '',
      raw = '',
      title = '',
      updated = moment(),
      created = moment(),
      date = moment()
    }: ArticleInterface) {

    this._id = uuid4();
    this.asset_dir = asset_dir;
    this.path = path;
    this.file = file;
    this.raw = raw;
    this.title = title;
    this.updated = updated;
    this.created = created;
    this.date = date;
  }
}
