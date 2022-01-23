const { CommandBuilder } = require('../util/CommandBuilder');
const chalk = require('chalk');
const version = require('../version');
const versions = require('../util/supportedVersions');

module.exports = new CommandBuilder()
    .setName(['about','ab'])
    .setDescription('Display information about Axis cli')
    .setExecute(() => {
        console.log(chalk.bold('Axis cli'));
        console.log(chalk.bold('Version: ') + chalk.blue(version));
        console.log(chalk.bold('Author: ') + chalk.blue('FalloutStudios'));
        console.log(chalk.bold('Supported Axis Versions: ') + chalk.blue(versions.map(v => v.versions.join(', ')).join('  ')));
    });