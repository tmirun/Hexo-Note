import { Moment } from 'moment';

export type ArticleLayout = 'post' | 'page' | 'draft' | string;

export interface Page extends PostHexo {}
export interface Post extends Omit<PostHexo, 'date' | 'updated' | 'prev' | 'next' | 'tags' | 'categories'> {
  date: Date,
  updated: Date
}

export interface PostHexo {
  date: Moment,
  title: string,
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
  tags: {data: TagHexo, length: string},
  categories: {data: CategoryHexo, length: string},
  prev: Document,
  next: Document,
  __post: boolean
}

export interface CategoryHexo extends TagHexo {
};

export interface TagHexo {
  name: string,
  _id: string,
  slug: string,
  path: string,
  permalink: string,
  posts: string,
}
