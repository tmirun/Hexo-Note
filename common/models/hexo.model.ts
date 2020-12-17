import { Moment } from 'moment';

export type ArticleLayout = 'post' | 'page' | 'draft' | string;

export interface Page extends Post {}
export interface Post {
  title: string,
  date: Moment,
  _content: string,
  source: string,
  raw: string,
  slug: string,
  published: boolean,
  updated: Moment,
  comments: boolean,
  layout: ArticleLayout,
  photos: string[],
  link: string,
  _id: string,
  content: string,
  site: any, // TODO
  excerpt: string,
  more: string,
  path: string,
  permalink: string,
  full_source: string,
  asset_dir: string,
  tags: string[],
  categories: string[],
  prev: Document,
  next: Document,
  __post: boolean
}

export interface Category extends Tag {
};

export interface Tag {
  name: string,
  _id: string,
  slug: string,
  path: string,
  permalink: string,
  posts: string,
}
