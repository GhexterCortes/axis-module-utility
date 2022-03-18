import { CreateCommand } from '../util/commands';
import { existsSync, rmSync } from 'fs';
import { input } from 'fallout-utility';
import * as path from 'path';
import chalk from 'chalk';

export const command = new CreateCommand()
    .setName('clear-cache')
    .addAlias('cc')
    .setDescription('Deletes .axiscache folder')
    .addOption('auto-yes', 'Auto yes to prompts', false, 'BOOLEAN')
    .setExecute((args) => {
        let continue_ = undefined;

        if (args.some(a => a.name === 'auto-yes' && a.value)) {
            continue_ = true;
        } else {
            continue_ = input({ text: 'Are you sure you want to delete the cache? (y/n) ', echo: undefined }) === 'y';
        }

        if (!continue_) return;

        const cachePath = path.join(process.cwd(), '.axiscache');
        if (existsSync(cachePath)) {
            rmSync(cachePath, { recursive: true });
            console.log(chalk.green('Cache successfully deleted'));
        } else {
            console.log(chalk.red('No cache folder found'));
        }
    })