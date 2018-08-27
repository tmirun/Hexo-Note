import { Post } from './Post.interface';

export interface PostTag {
  length: number;
  name: string;
  parent: string;
  path: string;
  permalink: string;
  posts: Post[];
  slug: string;
  _id: string;
}
