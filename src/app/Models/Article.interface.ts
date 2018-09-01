import * as moment from 'moment';

export interface Article {
  _id?: string;
  raw?: string; // the all file content, have info part and content part
  info?: string; // extraction of hexo note part between --- ---
  content?: string; // post content part
  published?: boolean;
  asset_dir?: string;
  path?: string;
  file?: string;
  fileName?: string;
  updated?: moment.Moment;
  created?: moment.Moment;

  // hexo info
  date?: moment.Moment;
  title?: string;
  tags?: string[];
  categories?: string | string[];
}
