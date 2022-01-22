const { CommandBuilder, CommandOption } = require('../util/CommandBuilder');
const chalk = require('chalk');

module.exports = new CommandBuilder()
    .setName(['help','h'])
    .setDescription('Display help information')
    .addOption(new CommandOption()
        .setName('command-name')
        .setDescription('The command to display help information for')
        .setType('string')
        .setRequired(false)
    )
    .setExecute((args, command, commands) => {
        const commandName = args ? args.get('command-name') : null;

        if(!commandName) {
            console.log(chalk.bold('Available commands:'));
            commands.forEach(c => {
                console.log(`  ${chalk.greenBright(c.name.join(', '))} — ${c.description}`);
            });
        } else {
            const cmd = commands.find(c => c.name.includes(commandName.value));
            if(!cmd) return console.log(chalk.red('Command ') + chalk.bold(commandName.value) + chalk.red(' not found'));

            console.log(chalk.bold(`Command ${commandName.value}`));
            console.log(`  ${chalk.greenBright(cmd.name.join(', '))} — ${cmd.description}`);

            if(cmd?.options.length > 0) {
                console.log(chalk.bold('Options:'));
                cmd.options.forEach(o => {
                    console.log(`  ${chalk.greenBright(o.name) +' '+ (o.equired ? chalk.bgYellowBright.black('Required') : chalk.bgBlue.black('Optional'))} — ${o.description}`);
                });
            }
        }
    });