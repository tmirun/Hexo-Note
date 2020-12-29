import { dialog } from 'electron';
import {hexoService, HexoService} from '../services/hexo.service';
import {storeService, STORE_KEY} from '../services/store.service';

export const openHexoProject = async () => {
    const paths = dialog.showOpenDialogSync({properties: ['openDirectory']});

    if (!paths?.length) {
        throw Error('No hexoServer project selected')
    }

    const hexoProjectPath = paths[0]
    const isHexoProject = await HexoService.isHexoProject(hexoProjectPath);

    if (!isHexoProject) {
        dialog.showErrorBox(`no hexo project`, `${hexoProjectPath} isn't hexo project`)
        throw Error(`${hexoProjectPath} isn't hexo project`)
    }

    storeService.set(STORE_KEY.projectPath, hexoProjectPath)

    await hexoService.init(hexoProjectPath);
}
