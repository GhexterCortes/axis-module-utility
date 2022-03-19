import chalk from 'chalk';
import Zip from 'adm-zip';
import * as path from 'path';
import * as yaml from 'yaml';
import { AxisJson, AxisJsonModule, getAxisJson } from './axisJSON';
import { default as supportedVersions } from '../supported-versions.json';
import { readdirSync, readFileSync, writeFileSync, existsSync, rmSync, renameSync, mkdirSync } from 'fs';

export interface PkgJson {
    name: 'axis';
    version?: string;
    description?: string;
    dependencies?: {
        [key: string]: string;
    };
}

export class ModuleManager {
    public modulePath?: string = undefined;
    public pkgJson?: PkgJson = undefined;
    public axisDir: string = './';
    public modulesDir: string = 'modules';
    public axisJson?: AxisJson = undefined;
    public dotAxis?: AxisJsonModule = undefined;
    public entries?: string[] = undefined;
    public zip?: Zip = undefined;
    
    setPath(modulePath: string, dir: string = './'): ModuleManager {
        if (!modulePath) throw new Error('Module path is not defined');
        if (!existsSync(modulePath)) throw new Error(`Module path ${chalk.yellow(modulePath)} does not exist`);
        this.modulePath = modulePath;

        console.log(chalk.green(`Module path set to ${chalk.yellow(modulePath)}`));
        this.zip = new Zip(modulePath);
        this.entries = this.zip.getEntries().map(entry => entry.entryName);
        
        this.axisDir = dir;
        
        this.parsePkgJson();
        this.parseAxisConfig();
        this.parseDotAxis();
        this.parseAxisJson();

        return this;
    }

    extractToCache(): ModuleManager {
        if (!this.zip) throw new Error('Archive is not available');

        if (!existsSync(path.join(this.axisDir, '.axiscache'))) mkdirSync(path.join(this.axisDir, '.axiscache'), { recursive: true });
        const axiscache = readdirSync(path.join(this.axisDir, '.axiscache'));
        console.log(chalk.green(`Extracting files to ${chalk.yellow(path.join(this.axisDir, '.axiscache'))}`));
        
        if (this.dotAxis?.name) {
            if (axiscache.some(x => x === this.dotAxis?.name)) rmSync(path.join(this.axisDir, '.axiscache', this.dotAxis.name), { recursive: true });

            mkdirSync(path.join(this.axisDir, '.axiscache', this.dotAxis.name), { recursive: true });

            this.zip.extractAllTo(path.join(this.axisDir, '.axiscache', this.dotAxis.name));
            console.log(chalk.green(`Extracted ${chalk.yellow(this.dotAxis.name)} to ${chalk.yellow(path.join(this.axisDir, '.axiscache', this.dotAxis.name))}`));
        } else {
            throw new Error('Module name is not defined');
        }

        return this;
    }

    addModule(): ModuleManager{
        if (!this.dotAxis) throw new Error('Dot axis is not defined');
        if (!this.dotAxis?.name) throw new Error('Module name is not defined');
        if (!this.dotAxis.version) throw new Error('Dot axis version is not defined');
        if (!this.dotAxis.main) throw new Error('Dot axis main file is not defined');
        if (!existsSync(path.join(this.axisDir, '.axiscache', this.dotAxis.name))) throw new Error('Module is not extracted to cache');
        if (this.axisJson?.modules?.some(x => this.dotAxis?.name && x.name === this.dotAxis.name)) throw new Error(`Module ${chalk.yellow(this.dotAxis.name)} already exists`);

        const modulePath = path.join(this.axisDir, this.modulesDir);
        const cachePath = path.join(this.axisDir, '.axiscache', this.dotAxis.name);
        const files = [this.dotAxis.main, ...(this.dotAxis.files || [])];

        console.log('');
        console.log(chalk.green(`Installing module ${chalk.yellow(this.dotAxis.name)}`));
        console.log(chalk.green(`Module version ${chalk.yellow(this.dotAxis.version)}`));
        console.log(chalk.green(`Module main file ${chalk.yellow(this.dotAxis.main)}`));
        console.log(chalk.green(`Module files ${chalk.yellow(files.join(', '))}`));
        console.log('');

        if (!existsSync(modulePath)) mkdirSync(modulePath, { recursive: true });
        if (!existsSync(path.join(cachePath, this.dotAxis.main))) throw new Error('Module main file is not extracted to cache');
        if (existsSync(path.join(modulePath, this.dotAxis.main))) throw new Error('File '+ chalk.yellow(this.dotAxis.main) +' already exists');
        if (this.dotAxis.files && this.dotAxis.files.length) {
            console.log(`Copying additional files (${chalk.yellow(files.join(', '))}) to ${chalk.yellow(modulePath)}`);

            for (const file of this.dotAxis.files) {
                if (!existsSync(path.join(cachePath, file))) throw new Error('File '+ chalk.yellow(file) +' is not extracted to cache');
                if (existsSync(path.join(modulePath, file))) throw new Error('File '+ chalk.yellow(file) +' already exists');
                renameSync(path.join(cachePath, file), path.join(modulePath, file));
                console.log(`Copied file ${chalk.yellow(file)}`);
            }
        }

        renameSync(path.join(cachePath, this.dotAxis.main), path.join(modulePath, this.dotAxis.main));

        let transferedFiles = 0;
        if (existsSync(path.join(modulePath, this.dotAxis.main))) transferedFiles++;
        if (this.dotAxis.files && this.dotAxis.files.length) {
            for (const file of this.dotAxis.files) {
                if (existsSync(path.join(modulePath, file))) transferedFiles++;
            }
        }

        if (transferedFiles !== files.length) {
            for (const file of files) {
                if (existsSync(path.join(modulePath, file))) rmSync(path.join(modulePath, file));
            }
            throw new Error('Some files are not transfered');
        }

        this.axisJson?.modules.push(this.dotAxis);
        this.saveAxisJson();
        this.savePkgJson(this.dotAxis.dependencies || {});

        return this;
    }

    removeModule(): ModuleManager {
        if (!this.dotAxis) throw new Error('Dot axis is not defined');
        if (!this.dotAxis?.name) throw new Error('Module name is not defined');
        if (!this.dotAxis.version) throw new Error('Dot axis version is not defined');
        if (!this.dotAxis.main) throw new Error('Dot axis main file is not defined');

        const modulePath = path.join(this.axisDir, this.modulesDir);
        const files = [this.dotAxis.main, ...(this.dotAxis.files || [])];

        if (!existsSync(modulePath)) throw new Error('Module path does not exist');
        
        let removedFiles = 0;
        for (const file of files) {
            console.log(`Removing ${chalk.yellow(path.join(modulePath, file))}`);

            if (!existsSync(path.join(modulePath, file))) {
                console.log(`${chalk.yellow(path.join(modulePath, file))} does not exist`);
                continue;
            }
            rmSync(path.join(modulePath, file));
            console.log(`${chalk.green(path.join(modulePath, file))} removed`);
            removedFiles++;
        }

        console.log(`removed ${removedFiles} files. ${files.length - removedFiles} files are not removed`);

        if (this.axisJson?.modules) {
            console.log(`Updating axis.json`);
            this.axisJson.modules = this.axisJson?.modules.filter(x => this.dotAxis && x.name !== this.dotAxis.name);
            this.saveAxisJson();
        }

        if (this.dotAxis?.dependencies) {
            console.log(chalk.yellow(`Dependencies detected!`));
            console.log(chalk.yellow(`Manually remove dependencies from package.json to avoid errors to other modules using the same dependencies as ${chalk.blue(this.dotAxis.name)}`));
            console.log(chalk.yellow(`Dependencies: ${Object.keys(this.dotAxis.dependencies).map(x => chalk.blue(x)).join(', ')}`));
        }

        return this;
    }

    saveAxisJson(): ModuleManager {
        if (!this.axisJson) throw new Error('axis.json is not defined');
        if (!this.axisJson?.modules) throw new Error('axis.json modules is not defined');

        const axisJson = this.axisJson;

        axisJson.modules.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0; 
        });

        writeFileSync(path.join(this.axisDir, 'axis.json'), JSON.stringify(axisJson, null, 2));
        console.log(chalk.green(`axis.json saved`));

        return this;
    }

    savePkgJson(dependencies?: { [key: string]: string }): ModuleManager {
        if (!this.pkgJson) throw new Error('Pkg json is not defined');

        if (!this.pkgJson.dependencies) this.pkgJson.dependencies = {};

        if (dependencies) {
            console.log(`Updating package.json`);

            writeFileSync(path.join(this.axisDir, 'package.json.old'), JSON.stringify(this.pkgJson, null, 2));
            console.log(chalk.green(`package.json.old saved`));

            for (const key in dependencies) {
                if (this.pkgJson.dependencies[key]) {
                    console.log(`${chalk.yellow(key)} already exists in package.json`);
                    console.log(this.pkgJson.dependencies[key] === dependencies[key] ? chalk.green(`${this.dotAxis?.name} version of ${key} matches the one in package.json`) : chalk.red(`${this.dotAxis?.name} version of ${key} is different from the one in package.json`));
                    continue;
                }
                
                this.pkgJson.dependencies[key] = dependencies[key];
                console.log(`${chalk.green(key)} added to package.json`);
            }

            console.log(`package.json updated`);
            console.log(`Please run ${chalk.yellow('npm install')} to install the new dependencies`);
        }

        writeFileSync(path.join(this.axisDir, 'package.json'), JSON.stringify(this.pkgJson, null, 2));
        console.log(chalk.green(`package.json saved`));

        return this;
    }

    private parseDotAxis(): ModuleManager {
        if (!this.entries?.some(entry => entry.toLowerCase() === '.axis')) throw new Error(`Module doesn't have ${chalk.yellow('.axis')} file`);
        
        const axisFileContent = this.zip?.readAsText('.axis');
        if (!axisFileContent) throw new Error('Cannot read .axis file from archive');

        const content = JSON.parse(axisFileContent);
        if (!content) throw new Error('Cannot parse .axis file from archive');
        if (content.folders) {
            content.files = content.folders;
            delete content.folders;
        }

        this.dotAxis = content;

        if (!this.dotAxis?.supportedVersions.some(v => v === this.pkgJson?.version)) throw new Error(`Module version ${chalk.yellow(this.pkgJson?.version)} is not supported by this version of Axis`);
        return this;
    }

    private parsePkgJson(): ModuleManager {
        if (!existsSync(path.join(this.axisDir, 'package.json'))) throw new Error(`Current directory doesn't have ${chalk.yellow('package.json')} file`);
        
        const packageJson = JSON.parse(readFileSync(path.join(this.axisDir, 'package.json'), 'utf8'));
        if (!packageJson) throw new Error('Cannot parse package.json file');

        this.pkgJson = packageJson;

        console.log(`Detected Axis version ${chalk.blue(this.pkgJson?.version)}`);
        return this;
    }

    private parseAxisJson(): ModuleManager {
        const axisJson = getAxisJson(this.axisDir);
        this.axisJson = !(axisJson instanceof Error) ? axisJson : undefined;

        return this;
    }

    private parseAxisConfig(): ModuleManager {
        const findVersion = supportedVersions.find(elm => elm.versions.some(v => v === this.pkgJson?.version));
        if (!findVersion) throw new Error(`Axis version ${chalk.yellow(this.pkgJson?.version)} is not supported`);
        if (!existsSync(findVersion.configDir)) throw new Error(`Axis version ${chalk.yellow(this.pkgJson?.version)} doesn't have ${chalk.yellow(findVersion.configDir)} directory`);

        const axisConfig = yaml.parse(readFileSync(findVersion.configDir, 'utf8'));
        if (!axisConfig) throw new Error('Cannot parse config file');
        
        this.modulesDir = axisConfig.modulesFolder;
        if (!existsSync(path.join(this.axisDir, this.modulesDir))) throw new Error(`Axis version ${chalk.yellow(this.pkgJson?.version)} doesn't have ${chalk.yellow(this.modulesDir)} directory`);
        
        console.log(`Modules root directory is set to ${chalk.blue(this.modulesDir)}`);
        return this;
    }
}