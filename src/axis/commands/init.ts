import { CreateCommand } from '../util/commands';
import { isSupportedVersion } from '../util/axisDir';
import { initAxis } from '../util/axisJSON';
import chalk from 'chalk';

export const command = new CreateCommand()
    .setName('init')
    .setDescription('Initialize a axis.json file')
    .setExecute(() => {
        if(!isSupportedVersion()) {
            console.log(chalk.red('This directory does not seem to be a valid Axis directory or the version is not supported'));
            console.log('');
            console.log('Use ' + chalk.green('axis download') + ' to download the latest version of Axis to current directory');
            console.log('Use ' + chalk.green('axis help download') + ' for more information about downloading Axis using command line');
            console.log('');
            console.log('You can also download Axis manually from GitHub: '+ chalk.blue('http://github.com/FalloutStudios/Axis/releases'));
            process.exit(1);
        }
        
        const init = initAxis();
        if(init instanceof Error) {
            console.log(chalk.red(init.message));
            console.log('');
            console.log('Use ' + chalk.green('axis help init') + ' for more information about initializing Axis using command line');
            process.exit(1);
        }

        console.log(chalk.green('axis.json successfully initialized'));
    });