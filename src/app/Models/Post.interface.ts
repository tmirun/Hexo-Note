// HEXO API POST INTERFACE

import * as moment from 'moment';
import { PostCategory } from './Category.interface';
import { PostTag } from './Tag.interface';

export interface Post {
  asset_dir?: string;
  canonical_path?: string;
  categories?: {
    data?: PostCategory[];
    length?: number
  };
  comments?: boolean;
  content?: string;
  date?: moment.Moment;
  excerpt?: string;
  full_source?: string;
  lang?: string;
  layout?: string;
  link?: string;
  more?: string;
  path?: string;
  permalink?: string;
  photos?: string[];
  published?: boolean;
  raw?: string;
  site?: {
    data?: any
  };
  slug?: string;
  source?: string;
  tags?: PostTag;
  title?: string;
  updated?: moment.Moment;
  __post?: boolean;
  _content?: string;
  _id?: string;
}
