const { CommandBuilder, CommandOption } = require('../util/CommandBuilder');
const chalk = require('chalk');
const AxisJson = require('../InitAxis');

module.exports = new CommandBuilder()
    .setName(['list','ls'])
    .setDescription('List all installed modules from axis.json')
    .setExecute((args, command, commands) => {
        const axisJson = new AxisJson().init();

        console.log(chalk.bold('Installed modules:'));
        axisJson.json.modules.forEach(m => {
            console.log(`  ${chalk.bold.blue(m.name)} — ${chalk.bold.blue(m.version)}`);
            console.log(`    ${chalk.bold.green('Description:')} ${m.description}`);
        });
    });
