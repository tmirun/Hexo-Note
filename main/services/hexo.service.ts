import { logger } from './logger.service';
import { join } from 'path';
import {ArticleLayout, CategoryHexo, Page, Post, PostHexo, TagHexo} from '../../common/models/hexo.model';
import { Server } from 'http';
import { EventEmitter } from 'events';
import { HEXO_EVENTS } from '../../common/events';
import { sanitizePosts } from "../utils";
import {ipcMain} from "electron";
import {IPC_RENDER_LISTENERS} from "../../common/ipc";

const { readFile } = require('hexo-fs');
const Hexo = require('hexo');

export interface ArticleCreateData {
  title: string;
  slug?: string;
  layout?: ArticleLayout;
  path?: string;
  date?: Date;
}

export interface ArticleCreateResponse {
  path: string,
  content: string
}

export class HexoService {
  public hexo: any; // hexoServer is extended event emitter
  private server: Server | undefined;
  public event: EventEmitter;

  constructor(hexoBlogPath: string = '') {
    // TODO: to replace
    // TODO: check project and throw error
  }

  async init (hexoProjectPath: string) {
    this.hexo = new Hexo(hexoProjectPath, {});
    this.event = this.hexo;
    await this.hexo.init();
    logger.log('initialized');
    this._initEvents();
  }

  private _initEvents () {
    this.hexo.on('new', (post: any) => {
      logger.log('new', post)
    });
    this.hexo.on('server', () => {
      logger.log('start server')
    })
    // this.hexoServer.on('deployBefore', () => {
    //   socket.emit(HEXO_EVENTS.deployBefore);
    //   logger.log('deployBefore')
    // })
    this.hexo.on('deployAfter', () => {
      logger.log('deployAfter')
    })
    // this.hexoServer.on('exit', () => {
    //   logger.log('exit')
    // })
    // this.hexoServer.on('generateBefore', () => {
    //   logger.log('generateBefore')
    // })
    this.hexo.on('generateAfter', () => {
      logger.log('generateAfter')
    })
    // this.hexoServer.on('processBefore', () => {
    //   logger.log('processBefore')
    // })
    // this.hexoServer.on('processAfter', () => {
    //   logger.log('processAfter')
    // })
    this.hexo.on('ready', () => {
      logger.log('ready')
    })
  }

  public getServerState(): boolean {
    return !!this.hexoServer;
  }

  async getDrafts() {
    // TODO: it need replace late
    await this.hexo.load();
    const posts = this.hexo.model('Post');
    let allPosts = posts.toArray();
    return allPosts.filter((post: any) => post.published)
  }

  async getPosts (): Promise<Post[]> {
    await this.hexo.load();
    const response = await this.hexo.locals.get('posts');
    const posts: PostHexo[] = response.data;
    return sanitizePosts(posts);
  }

  async getPages (): Promise<Page[]> {
    await this.hexo.load();
    const response = await this.hexo.locals.get('pages');
    return response.data;
  }

  async getCategories (): Promise<CategoryHexo> {
    await this.hexo.load();
    const response =  await this.hexo.locals.get('categories');
    return response.data;
  }

  async getTags (): Promise<TagHexo> {
    await this.hexo.load();
    const response =  await this.hexo.locals.get('tags');
    return response.data;
  }

  async createPost (title: string): Promise<ArticleCreateResponse>{
    return  await this.createArticle({
      title: title,
      layout: 'post',
    })
  }

  async createDraft (title: string): Promise<ArticleCreateResponse>{
    return  await this.createArticle({
      title: title,
      layout: 'draft',
    })
  }

  async createPage (title: string): Promise<ArticleCreateResponse>{
    return  await this.createArticle({
      title: title,
      layout: 'page',
    })
  }

  /**
   * this method use for create all king of article (page, draft, post....)
   */
  async createArticle (data: ArticleCreateData): Promise<ArticleCreateResponse>{
    const response: ArticleCreateResponse[] = await this.hexo.post.create(data)
    return response[0]
  }

  static async isHexoProject(path: string): Promise<boolean> {
    const pkgPath = join(path, 'package.json');
    try {
      const fileContent = await readFile(pkgPath);
      const json = JSON.parse(fileContent);
      return (typeof json.hexo === 'object');
    } catch (e) {
      logger.warn(e)
      return false;
    }
  }

  async startServer(){
    logger.log('start server in process')
    this.server = await this.hexo.call('server', {});
    this.hexo.emit(HEXO_EVENTS.startServer);
    logger.log('start server OK')
  }

  async stopServer() {
    logger.log('stop server in process')
    if(!this.hexoServer) {
      this.hexo.emit(HEXO_EVENTS.stopServer)
      logger.log('server is NOT started');
      return;
    }
    this.hexoServer.close();
    this.server = undefined;
    console.log(this.hexoServer);
    logger.log('stop server OK')
  }

  async generate() {
    await this.hexo.call('generate', {})
  }

  async deploy() {
    await this.hexo.call('deploy', {})
  }
}

export const hexoService = new HexoService();
