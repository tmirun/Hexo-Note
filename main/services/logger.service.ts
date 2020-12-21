import * as chalk from 'chalk';

export const logger = {
  log(...arg: any[]) { console.log(chalk.blue(...arg))},
  warn(...arg: any[]) { console.warn(chalk.yellow(...arg))},
}
