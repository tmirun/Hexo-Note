import Store from 'electron-store';

export const STORE_KEY = {
    projectPath: 'projectPath'
}

const schema = {
    [STORE_KEY.projectPath]: { "type": "string" }
};

export const store = new Store(schema);
