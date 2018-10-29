import isDev from 'electron-is-dev';

export const utils = {
  isDev() { return isDev; },

  isPro() { return !this.isDev(); }
};
