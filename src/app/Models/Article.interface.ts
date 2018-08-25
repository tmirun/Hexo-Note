import * as moment from 'moment';

export interface Article {
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
}
