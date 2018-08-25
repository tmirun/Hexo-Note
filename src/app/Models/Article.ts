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
  fileName?: string;
  updated?: moment.Moment;
  created?: moment.Moment;
  date?: moment.Moment;

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
    this.title = title;
    this.raw = raw;
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
}
