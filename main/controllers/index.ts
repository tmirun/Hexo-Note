import { dialog } from 'electron';
import { HexoService } from '../services/hexo.service';
import {store, STORE_KEY} from '../store';

export const openHexoProject = async () => {
    const paths = dialog.showOpenDialogSync({properties: ['openDirectory']});

    if (!paths?.length) {
        throw Error('No hexo project selected')
    }

    const hexoProjectPath = paths[0]
    const isHexoProject = await HexoService.isHexoProject(hexoProjectPath[0]);

    if (!isHexoProject) {
        dialog.showErrorBox(`no hexo project`, `${hexoProjectPath} isn't hexo project`)
        throw Error(`${hexoProjectPath} isn't hexo project`)
    }

    store.set(STORE_KEY.projectPath, hexoProjectPath)
}
