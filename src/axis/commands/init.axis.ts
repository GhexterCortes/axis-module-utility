import { AxisJsonModule } from "../util/axisJSON";
import { CreateCommand } from "../util/commands";
import { existsSync, writeFileSync } from "fs";
import { default as supportedVersions } from "../supported-versions.json";
import { input as ask } from "fallout-utility";
import chalk from "chalk";

export const command = new CreateCommand()
    .setName('init-dot-axis')
    .addAlias('ia')
    .addAlias('ida')
    .setDescription('Initialize a new .axis project')
    .addOption('dont-ask', 'Do not ask for property values', false, 'BOOLEAN')
    .setExecute((args) => {
        const input = (question: string) => {
            if (args[0].value) return '';
                
            return ask(question);
        }

        if (existsSync('.axis')) {
            console.log(chalk.red('.axis already exists'));
            return;
        }

        const defaultAxisJson: AxisJsonModule = {
            name: input('Module name: '),
            version: input('Module Version (1.0): ') || '1.0',
            author: input('Author: '),
            license: input('License (MIT): ') || 'MIT',
            main: input('Main file: '),
            files: (() => {
                const files = input('Files (separate by comma): ');
                if (files) return files.split(',');
            })() || [],
            supportedVersions: (() => {
                let versions = input('Supported versions (separate by comma): ');
                if (!versions) return [];
                
                versions = versions.split(',');
                versions = versions.filter((version: string) => version && supportedVersions.some(vrs => vrs.versions.includes(version)));
                
                return versions;
            })() || [],
            description: input('Description: '),
            repository: input('Repository (https://github.com/): ') || 'https://github.com/',
            dependencies: {}
        };

        console.log('')
        console.log(defaultAxisJson);
        console.log('')
        
        let confirm = ask('OK? (y/n): ') != 'n';
        if (confirm) {
            writeFileSync('.axis', JSON.stringify(defaultAxisJson, null, 2));
            console.log(chalk.green('axis.json created'));
        }
    });