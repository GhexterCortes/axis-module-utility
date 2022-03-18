import { CreateCommand } from '../util/commands';
import { isAxisDir, isSupportedVersion } from '../util/axisDir';
import { readFileSync } from 'fs';
import chalk from 'chalk';

export const command = new CreateCommand()
    .setName('version')
    .addAlias('v')
    .setDescription('Show the version of Axis')
    .setExecute(() => {
        console.log(`Current Axis CLI version: ${chalk.green(require('../../../package.json').version)}`);
        if (isAxisDir()) {
            const pkgJson = JSON.parse(readFileSync('./package.json', 'utf8'));
            console.log(`Directory Axis version: ${ isSupportedVersion() ? chalk.green(pkgJson.version) : chalk.red(pkgJson.version + ' (not supported by Axis module util)') }`);
        }
    })