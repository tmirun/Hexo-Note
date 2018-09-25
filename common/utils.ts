export const utils = {
  isDev() {
    return process.mainModule.filename.indexOf('app.asar') === -1;
  },

  isPro() {
    return !this.isDev();
  }
};
