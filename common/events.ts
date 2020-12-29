export const HEXO_EVENTS = {
  // HEXO EVENTS: https://hexo.io/api/events
  new: 'hexoServer:new',
  startServer: 'hexoServer:serverStart',
  deployBefore: 'hexoServer:DeployBefore',
  deployAfter: 'hexoServer:deployAfter',
  exit: 'hexoServer:exit',
  generateBefore: 'hexoServer:generateBefore',
  generateAfter: 'hexoServer:generateAfter',
  processBefore: 'hexoServer:processBefore',
  processAfter: 'hexoServer:processAfter',
  ready: 'hexoServer:ready',

  // CUSTOM EVENT
  stopServer: 'hexoServer:serverStop',

}
