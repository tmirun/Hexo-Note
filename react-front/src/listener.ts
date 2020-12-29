import {IPC_RENDER_LISTENERS} from "../../common/ipc";
import {store} from "./store";
import {setServerStateAction} from "./store/hexoServer/actions";

const electron = window.require("electron")
const { ipcRenderer } = electron;

export const initIpcListener = () => {
  ipcRenderer.on(IPC_RENDER_LISTENERS.onHexoServerStatusChange, (serverState: boolean) => {
    store.dispatch(setServerStateAction(serverState))
  })
}
