const chalk = require('chalk');

module.exports = (str) => {
    console.log(chalk.red(str));
    process.exit(1);
}