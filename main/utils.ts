import isDev from 'electron-is-dev';
import {Post, PostHexo} from "../common/models/hexo.model";

export const utils = {
  isDev() { return isDev; },

  isPro() { return !this.isDev(); }
};

export const sanitizePost = (post: PostHexo): Post => {
  const {prev, next, date, updated, tags, categories,...newPost} = post;
  const sanitizedPost: Post = newPost as Post;
  sanitizedPost.date = post.date.toDate();
  sanitizedPost.updated = post.date.toDate();
  return newPost as any
}

export const sanitizePosts = (posts: PostHexo[]): Post[] => {
  return posts.map((post) => sanitizePost(post))
}
