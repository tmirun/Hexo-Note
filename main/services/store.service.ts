import Store from 'electron-store';

export const STORE_KEY = {
    projectPath: 'projectPath'
}

const schema = {
    [STORE_KEY.projectPath]: { "type": "string" }
};

export const storeService = new Store(schema);

export const getProjectPath = (): string => {
    return storeService.get(STORE_KEY.projectPath, '') as string;
}
