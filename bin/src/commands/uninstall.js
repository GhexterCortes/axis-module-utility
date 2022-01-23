const { CommandBuilder, CommandOption } = require('../util/CommandBuilder');
const versions = require('../util/findSupportedVersion');
const AxisJson = require('../InitAxis');
const error = require('../util/printError');
const chalk = require('chalk');
const yml = require('yaml');
const fs = require('fs');

module.exports = new CommandBuilder()
    .setName(['uninstall', 'un', 'u'])
    .setDescription('Uninstall a from axis.json file')
    .addOption(new CommandOption()
        .setName('module')
        .setDescription('The module to uninstall')
        .setType('string')
        .setRequired(true)
    )
    .setExecute(async (args, command, commands) => {
        const moduleName = args.get('module').value;
        console.log('Uninstalling module ' + chalk.bold.blue(moduleName));

        // Check if package.json exists
        if(!fs.existsSync('./package.json')) error('No package.json found\nUse ' + chalk.white.bold('download') + ' to create new Axis bot');

        // Check Axis version in package.json
        const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
        if(!packageJson.version) error('No version found in package.json');

        console.log('Preparing uninstallation...');
        console.log('Detected version: ' + chalk.bold.blue(packageJson.version || 'unknown'));

        // Check if Axis is supported
        const isSupported = versions(packageJson.version);
        if(!isSupported) error('Version ' + chalk.bold.blue(packageJson.version) + ' is not supported');
        if(!fs.existsSync(isSupported.config)) error('No config.yml found\nUse ' + chalk.white.bold('download') + ' to create new Axis bot');

        // Find Axis config
        const config = yml.parse(fs.readFileSync('./config/Bot/config.yml', 'utf8'));
        if(config.version != packageJson.version) error('Version mismatch\nCurrent version: ' + chalk.bold.blue(config.version) + '\nExpected version: ' + chalk.bold.blue(packageJson.version));

        // Find moduleName
        console.log(chalk.yellow('Reading axis.json...'));
        let axisJson = new AxisJson(packageJson.version).init();

        const foundModule = axisJson.json.modules.find(m => m.name == moduleName);
        if(!foundModule) error('Module ' + chalk.bold.blue(moduleName) + ' not found');

        // Remove module from axis.json
        axisJson.json.modules = axisJson.json.modules.filter(m => m.name != moduleName);

        const mainFile = config.modulesFolder + '/' + foundModule.main;
        const folders = foundModule?.folders || [];
        if(fs.existsSync(mainFile)) {
            fs.rmSync(mainFile, { recursive: true, force: true });
            console.log(chalk.green(chalk.bold.blue(mainFile) + ' removed!'));
        }

        for (const folder of folders) {
            if(fs.existsSync(folder)) {
                fs.rmSync(config.modulesFolder + '/' + folder, { recursive: true, force: true });
                console.log(chalk.green(chalk.bold.blue(folder) + ' removed!'));
            }
        }

        // Save axis.json
        axisJson.save();

        if(foundModule?.dependencies && foundModule.dependencies.length) {
            console.log(chalk.blue(foundModule.dependencies.length) + ' dependencies found');
            console.log(chalk.yellow('If you wish to remove them, do it manually using ' + chalk.white.bold('npm uninstall') + ' command'));
            console.log(chalk.yellow('to avoid errors in your package.json file'));
        }
        console.log(chalk.green('Module ' + chalk.bold.blue(moduleName) + ' uninstalled!'));
    });
