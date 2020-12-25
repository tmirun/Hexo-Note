import isDev from 'electron-is-dev';
import {Post, PostHexo} from "../common/models/hexo.model";

export const utils = {
  isDev() { return isDev; },

  isPro() { return !this.isDev(); }
};

export const sanitizePost = (post: PostHexo): Post => {
  return {
    ...post,
    date: post.date.toDate(),
    updated: post.date.toDate(),
  };
}

export const sanitizePosts = (posts: PostHexo[]): Post[] => {
  return posts.map((post) => sanitizePost(post))
}
