import chalk from "chalk";
import * as path from 'path';
import { existsSync, writeFileSync, readFileSync } from "fs";
import { isSupportedVersion } from '../util/axisDir';

export interface AxisJsonModuleDependencies {
    [key: string]: string;
}

export interface AxisJsonModule {
    name: string;
    version: string;
    main: string;
    files: string[];
    supportedVersions: string[];
    description: string;
    dependencies: AxisJsonModuleDependencies
}

export interface AxisJson {
    modules: AxisJsonModule[];
}

export function initAxis(dir: string = './') {
    if (!isSupportedVersion()) return new Error(chalk.red('This directory does not seem to be a valid Axis directory'));
    if (existsSync(path.join(dir, 'axis.json'))) return new Error(chalk.red('axis.json already exists'));
    
    const axisJson: AxisJson = {
        modules: []
    };

    writeFileSync(path.join(dir, 'axis.json'), JSON.stringify(axisJson, null, 2));
    if (!existsSync(path.join(dir, 'axis.json'))) return new Error(chalk.red('axis.json could not be created'));

    return true;
}

export function addAxisModule(module: AxisJsonModule, dir: string = './') {
    if (!isSupportedVersion()) return new Error(chalk.red('This directory does not seem to be a valid Axis directory'));
    if (!existsSync(path.join(dir, 'axis.json'))) {
        const init = initAxis(dir);
        if (init instanceof Error) return init;
    }

    const axisJson: AxisJson = JSON.parse(readFileSync(path.join(dir, 'axis.json'), 'utf8'));
    if (!axisJson.modules) axisJson.modules = [];
    if (axisJson.modules.some(elm => elm.name === module.name)) return new Error(`Module already exists\nUse ${chalk.blue('axis uninstall ' + module.name)} to remove it`);

    axisJson.modules.push(module);
    writeFileSync(path.join(dir, 'axis.json'), JSON.stringify(axisJson, null, 2));

    return true;
}

export function removeAxisModule(moduleName: string, dir: string = './') {
    if (!isSupportedVersion()) return new Error(chalk.red('This directory does not seem to be a valid Axis directory'));
    if (!existsSync(path.join(dir, 'axis.json'))) {
        const init = initAxis(dir);
        if (init instanceof Error) return init;
    }

    const axisJson: AxisJson = JSON.parse(readFileSync(path.join(dir, 'axis.json'), 'utf8'));
    if (!axisJson.modules) axisJson.modules = [];
    if (!axisJson.modules.some(elm => elm.name === moduleName)) return new Error(`Module does not exist\nUse ${chalk.blue('axis install ' + moduleName)} to add it`);

    axisJson.modules = axisJson.modules.filter(elm => elm.name !== moduleName);
    writeFileSync(path.join(dir, 'axis.json'), JSON.stringify(axisJson, null, 2));

    return true;
}