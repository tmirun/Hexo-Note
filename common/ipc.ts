export const IPC_HANDLES = {
  openHexoProject: 'openHexoProject',
  getPosts: 'getPosts',
  getPostById: 'getPostById',
  getDrafts: 'getDrafts',
  getTags: 'getTags',
  getCategories: 'getCategories',
  getHexoServerStatus: 'getHexoServerStatus',
  startHexoServer: 'startHexoServer',
  stopHexoServer: 'stopHexoServer',

  getConfigYml: 'getConfigYml',
  updateConfigYml: 'updateConfigYml'
}

export const IPC_RENDER_LISTENERS = {
  onPostChange: 'onPostChange',
  onDraftChange: 'onDraftChange',
  onPageChange: 'onPageChange',
  onTagChange: 'onTagChange',
  onCategoriesChange: 'onCategoriesChange',
  onHexoServerStatusChange: 'onHexoServerStatusChange',
}
