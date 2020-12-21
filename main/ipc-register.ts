import { ipcMain } from 'electron';
import { IPC_CHANNEL } from '../common/ipc';
import {openHexoProject} from './controllers';

// ipcMain.handle('createNewHexoProject', async (event, { projectName: string } ) => {
//     const path = dialog.showOpenDialogSync({ properties: ['openDirectory'] })[0];
//     // await HexoService.isHexoProject(dialog.showOpenDialogSync({ properties: ['openDirectory'] })[0])
// })

ipcMain.handle(IPC_CHANNEL.openHexoProject, openHexoProject)

