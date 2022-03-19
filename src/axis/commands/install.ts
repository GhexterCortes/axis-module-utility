import chalk from 'chalk';
import { CreateCommand } from "../util/commands";
import { ModuleManager } from "../util/moduleManager";

export const command = new CreateCommand()
    .setName('install')
    .addAlias('i')
    .addAlias('in')
    .setDescription('Install a archived module')
    .addOption('file', 'module archive to install', true)
    .addOption('show-stack', 'show stack trace on error', false, 'BOOLEAN')
    .setExecute(async (args) => {
        try {
            new ModuleManager()
                .setPath(args[0].value, process.cwd())
                .extractToCache()
                .addModule();
        } catch (err) {
            if (err instanceof Error) {
                console.log(chalk.red(!args[1].value ? err.message : err.stack));
                console.log('');
                console.log('Use ' + chalk.green('axis help install') + ' for more information about installing a module using command line');
                process.exit(1);
            } else {
                console.log(!args[1].value ? chalk.red('Unknown error occured') : err);
                console.log('');
                console.log('Use ' + chalk.green('axis help install') + ' for more information about installing a module using command line');
                process.exit(1);
            }
        }
    });