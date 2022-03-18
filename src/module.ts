import chalk from "chalk";

const errorMessage = chalk.red('You cannot import this to your project');

throw new Error(errorMessage);