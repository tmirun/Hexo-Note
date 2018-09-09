import { AppConfigCommon } from './environment.common';

export const AppConfig = {
  production: false,
  environment: 'LOCAL',
  ...AppConfigCommon
};
