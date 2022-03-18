import { CreateCommand, createCommandUsage } from '../util/commands';
import { compareTwoStrings } from 'string-similarity';
import chalk from 'chalk';

export const command = new CreateCommand()
    .setName('help')
    .addAlias('h')
    .setDescription('Show help for a command')
    .addOption('command', 'The command to show help for', false)
    .setExecute((args, cmd, commands) => {
        if (!args[0].value) {
            console.log(`The following commands are available:`);
            console.log(commands.map(c => `   ${createCommandUsage(c)}`).join('\n'));
            console.log('');
            console.log('Use ' + chalk.green('axis help <command>') + ' to see help for a specific command');
            return;
        }

        const commandFind = commands.find(c => c.name === args[0].value || c.aliases.includes(args[0].value));
        if (!commandFind) {
            const filter = commands.filter(c => compareTwoStrings(c.name, args[0].value) > 0.5 || c.aliases.some(a => compareTwoStrings(a, args[0].value) > 0.5) || c.description.includes(args[0].value));
            if (filter.length) {
                console.log(`The following commands are similar to ${chalk.green(args[0].value)}`);
                console.log(filter.map(c => `   ${createCommandUsage(c)}`).join('\n'));
                console.log('');
                console.log('Use ' + chalk.green('axis help <command>') + ' to see help for a specific command');
                return;
            }

            console.log(`Command ${chalk.green(args[0].value)} not found`);
            return;
        }

        console.log(chalk.green(commandFind.name) + ' — ' + commandFind.description);
        console.log(`   ${createCommandUsage(commandFind)}`);
        console.log('');
        console.log('Aliases: ' + chalk.green(commandFind.aliases.join(', ')));
        console.log('');
        console.log('Use ' + chalk.green('axis help') + ' to see a list of commands');
    });