export const HEXO_EVENTS = {
  // HEXO EVENTS: https://hexo.io/api/events
  new: 'hexo:new',
  server: 'hexo:serverStart',
  deployBefore: 'hexo:DeployBefore',
  deployAfter: 'hexo:deployAfter',
  exit: 'hexo:exit',
  generateBefore: 'hexo:generateBefore',
  generateAfter: 'hexo:generateAfter',
  processBefore: 'hexo:processBefore',
  processAfter: 'hexo:processAfter',
  ready: 'hexo:ready',

  // CUSTOM EVENT
  stopServer: 'hexo:serverStop',

}
