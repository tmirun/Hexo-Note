import isDev from 'electron-is-dev';
import {Category, Post, PostHexo, Tag} from "../common/models/hexo.model";

export const utils = {
  isDev() { return isDev; },

  isPro() { return !this.isDev(); }
};

export const sanitizePost = (post: PostHexo): Post => {
  const {prev, next, date, updated, tags, categories,...newPost} = post;
  const sanitizedPost: Post = newPost as Post;
  sanitizedPost.date = post.date.toDate();
  sanitizedPost.updated = post.date.toDate();
  sanitizedPost.tags = sanitizePostTagsOrCategories(tags);
  sanitizedPost.categories = sanitizePostTagsOrCategories(categories);
  return sanitizedPost;
}

export const sanitizePosts = (posts: PostHexo[]): Post[] => {
  return posts.map((post) => sanitizePost(post));
}

/**
 *
 _Query {
    data: [
      _Document {
        name: 'some tags',
        _id: 'cki2209st000a6x1ehunu5gpi',
        slug: [Getter],
        path: [Getter],
        permalink: [Getter],
        posts: [Getter],
        length: [Getter]
    },
  }

 to
 [
 {
      name: 'some tags',
      _id: 'cki2209st000a6x1ehunu5gpi',
      slug: [Getter],
      path: [Getter],
      permalink: [Getter],
      posts: [Getter],
      length: [Getter]
    }
 ]
 */
export const sanitizePostTagsOrCategories = (hexoTags: any): Tag[] | Category[] => {
  const tags = hexoTags.toArray();
  return tags.map((tag: any) => {
    const sanitizedTag = tag.toObject();
    delete sanitizedTag.posts;
    delete sanitizedTag.length;
    return sanitizedTag;
  })
}
