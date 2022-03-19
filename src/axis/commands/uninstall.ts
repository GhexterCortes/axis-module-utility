import chalk from 'chalk';
import { input } from 'fallout-utility';
import { CreateCommand } from "../util/commands";
import { ModuleManager } from "../util/moduleManager";

export const command = new CreateCommand()
    .setName('uninstall')
    .addAlias('u')
    .addAlias('un')
    .setDescription('Uninstall axis module from axis.json')
    .addOption('file', 'archived module to uninstall', true)
    .addOption('auto-yes', 'Automatically answer yes to all prompts', false, 'BOOLEAN')
    .addOption('show-stack', 'show stack trace on error', false, 'BOOLEAN')
    .setExecute(async (args) => {
        try {
            const m = new ModuleManager();

            m.axisDir = process.cwd();

            const confirm = args[1].value ?? (input('Are you sure you want to uninstall this module? (y/n) ') === 'y');
            if (!confirm) return;

            m.parsePkgJson().parseAxisJson().parseAxisConfig().removeModule(args[0].value);
        } catch (err) {
            if (err instanceof Error) {
                console.log(chalk.red(!args[2].value ? err.message : err.stack));
                console.log('');
                console.log('Use ' + chalk.green('axis help uninstall') + ' for more information about uninstalling a module using command line');
                process.exit(1);
            } else {
                console.log(!args[2].value ? chalk.red('Unknown error occured') : err);
                console.log('');
                console.log('Use ' + chalk.green('axis help uninstall') + ' for more information about uninstalling a module using command line');
                process.exit(1);
            }
        }
    });