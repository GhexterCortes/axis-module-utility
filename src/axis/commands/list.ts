import { isSupportedVersion } from '../util/axisDir';
import { getAxisJson } from '../util/axisJSON';
import { CreateCommand } from '../util/commands';
import chalk from 'chalk';

export const command = new CreateCommand()
    .setName('list')
    .setDescription('List all modules in axis.json')
    .setExecute(() => {
        if (!isSupportedVersion()) {
            console.log(chalk.red('This directory does not seem to be a valid Axis directory or the version is not supported'));
            console.log('');
            console.log('Use ' + chalk.green('axis download') + ' to download the latest version of Axis to current directory');
            console.log('Use ' + chalk.green('axis help download') + ' for more information about downloading Axis using command line');
            console.log('');
            console.log('You can also download Axis manually from GitHub: ' + chalk.blue('http://github.com/FalloutStudios/Axis/releases'));
            process.exit(1);
        }
        
        const axisJson = getAxisJson();
        if (axisJson instanceof Error) {
            console.log(chalk.red(axisJson.message));
            console.log('');
            console.log('Use ' + chalk.green('axis help list') + ' for more information about listing modules using command line');
            process.exit(1);
        }

        if (axisJson.modules.length === 0) {
            console.log(chalk.yellow('No modules found in axis.json'));
            return;
        }


        console.log(chalk.green('Modules in axis.json:'));
        console.log('');
        
        for (const module of axisJson.modules) {
            console.log(chalk.green(`- ${module.name} (${chalk.blue(module.version)})`));
            console.log(`  ${chalk.yellow('Description:')} ${module.description}`);
            console.log(`  ${chalk.yellow('Author:')} ${typeof module.author === 'object' ? module.author.join(', ') : module.author}`);
            console.log(`  ${chalk.yellow('License:')} ${module.license || 'Unlicensed'}`);
            console.log(`  ${chalk.yellow('Repository:')} ${module.repository || 'N/A'}`);
            console.log(`  ${chalk.yellow('Dependencies:')} ${module.dependencies.length || 0} dependencies found`);
            console.log('');
        }
    });