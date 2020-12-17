import chalk from 'chalk';

export const logger = {
  log(...arg: any[]) { console.log(chalk.blueBright(...arg))},
  warn(...arg: any[]) { console.warn(chalk.yellowBright(...arg))},
}
