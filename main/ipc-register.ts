import {ipcMain} from "electron";
import {IPC_HANDLES} from "../common/ipc";
import {openHexoProject} from "./controllers";
import {Post} from "../common/models/hexo.model";
import {hexoService} from "./services/hexo.service";
import {logger} from "./services/logger.service";

ipcMain.handle(IPC_HANDLES.openHexoProject, openHexoProject)
ipcMain.handle(IPC_HANDLES.getPosts, async (): Promise<Post[]> => {
  return await hexoService.getPosts();
})

ipcMain.handle(IPC_HANDLES.startHexoServer, async () => {
  logger.log('IPC:', IPC_HANDLES.startHexoServer)
  return await hexoService.startServer();
})

ipcMain.handle(IPC_HANDLES.stopHexoServer, async () => {
  logger.log('IPC:', IPC_HANDLES.stopHexoServer)
  return await hexoService.stopServer();
})

ipcMain.handle(IPC_HANDLES.getHexoServerStatus, async () => {
  logger.log('IPC:', IPC_HANDLES.getHexoServerStatus);
  return hexoService.getServerState();
})

ipcMain.handle(IPC_HANDLES.getConfigYml, async () => {
  logger.log('IPC:', IPC_HANDLES.getConfigYml);
  return hexoService.getConfigYml();
})

ipcMain.handle(IPC_HANDLES.getPostById, async(event, postId: string) => {
  logger.log('IPC:', IPC_HANDLES.getPostById, postId);
  if(!postId) {
    throw Error('postId empty');
  }
  const post = await hexoService.getPostById(postId);
  return post;
})

ipcMain.handle(IPC_HANDLES.updateConfigYml, async (event, content: string) => {
  logger.log('IPC:', IPC_HANDLES.updateConfigYml);
  if(!content) {
    throw Error('content empty')
  }
  return hexoService.updateConfigYml(content);
})
