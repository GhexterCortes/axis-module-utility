import chalk from 'chalk';
import { CreateCommand } from "../util/commands";
import { ModuleManager } from "../util/moduleManager";

export const command = new CreateCommand()
    .setName('uninstall')
    .addAlias('u')
    .addAlias('un')
    .setDescription('Uninstall axis module from axis.json')
    .addOption('file', 'archived module to uninstall', true)
    .addOption('show-stack', 'show stack trace on error', false, 'BOOLEAN')
    .setExecute(async (args, flags) => {
        try {
            const m = new ModuleManager();

            m.axisDir = process.cwd();

            m.parsePkgJson().parseAxisJson().parseAxisConfig().removeModule(args[0].value);
        } catch (err) {
            if (err instanceof Error) {
                console.log(chalk.red(!args[1].value ? err.message : err.stack));
                console.log('');
                console.log('Use ' + chalk.green('axis help uninstall') + ' for more information about uninstalling a module using command line');
                process.exit(1);
            } else {
                console.log(!args[1].value ? chalk.red('Unknown error occured') : err);
                console.log('');
                console.log('Use ' + chalk.green('axis help uninstall') + ' for more information about uninstalling a module using command line');
                process.exit(1);
            }
        }
    });