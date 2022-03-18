import chalk from 'chalk';
import * as path from 'path';
import { AxisJsonModule } from '../util/axisJSON';
import { readFileSync, writeFileSync, existsSync } from 'fs';

export function getDotAxis(dir: string = './') {
    if (!existsSync(path.join(dir, '.axis'))) return new Error(chalk.red('.axis does not exist'));

    return JSON.parse(readFileSync(path.join(dir, 'axis.json'), 'utf8'));
}

export function generateDotAxis(dir: string = './', options?: AxisJsonModule) {
    if (existsSync(path.join(dir, '.axis'))) return new Error(chalk.red('.axis already exists'));

    let axisJson: AxisJsonModule = options || {
        name: '',
        version: '',
        author: '',
        license: '',
        main: '',
        files: [],
        supportedVersions: [],
        description: '',
        repository: 'http://github.com/',
        dependencies: {}
    }
    
    writeFileSync(path.join(dir, '.axis'), JSON.stringify(axisJson, null, 2));
    if (!existsSync(path.join(dir, '.axis'))) return new Error(chalk.red('.axis could not be created'));

    return true;
}