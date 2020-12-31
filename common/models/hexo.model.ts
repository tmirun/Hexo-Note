import { Moment } from 'moment';

export type ArticleLayout = 'post' | 'page' | 'draft' | string;

export interface Page extends PostHexo {}
export interface Post extends Omit<PostHexo, 'date' | 'updated' | 'prev' | 'next' | 'tags' | 'categories'> {
  tags: Tag[],
  categories: Category[],
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
  tags: TagsHexo[]
  categories: CategoriesHexo[],
  prev: Document,
  next: Document,
  __post: boolean
}

export interface Tag extends TagHexo {}
export interface Category extends CategoryHexo {}

export interface CategoryHexo extends TagHexo {}
export interface CategoriesHexo extends TagsHexo {}

export interface TagsHexo {
  data: TagHexo[],
  length: number
}

export interface TagHexo {
  name: string,
  _id: string,
  slug: string,
  path: string,
  permalink: string,
  posts?: string,
}
