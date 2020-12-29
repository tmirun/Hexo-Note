import {HEXO_EVENTS} from "../common/events";
import {ipcMain} from "electron";
import {IPC_RENDER_LISTENERS} from "../common/ipc";
import {hexoService} from "./services/hexo.service";

export const initializeHexoIpcEvent = () => {
    hexoService.event.on(HEXO_EVENTS.startServer, () => {
      ipcMain.emit(IPC_RENDER_LISTENERS.onHexoServerStatusChange, true)
    })

    hexoService.event.on(HEXO_EVENTS.stopServer, () => {
      ipcMain.emit(IPC_RENDER_LISTENERS.onHexoServerStatusChange, false)
    })
}
