const { CommandBuilder, CommandOption } = require('../util/CommandBuilder');
const backup = require('../util/backupFile');
const error = require('../util/printError');
const versions = require('../util/findSupportedVersion');
const AxisJson = require('../initAxis');
const ExtractModule = require('../extractModule');
const moveFromCache = require('../util/moveFromCache');
const chalk = require('chalk');
const yml = require('yaml');
const fs = require('fs');

module.exports = new CommandBuilder()
    .setName(['install', 'in', 'i'])
    .setDescription('Install a module')
    .addOption(new CommandOption()
        .setName('module')
        .setDescription('The module to install')
        .setType('string')
        .setRequired(true)
    )
    .setExecute(async (args, command, commands) => {
        const moduleName = args.get('module').value;
        console.log('Installing module ' + chalk.bold.blue(moduleName));

        // Check if package.json exists
        if(!fs.existsSync('./package.json')) error('No package.json found\nUse ' + chalk.white.bold('download') + ' to create new Axis bot');
        
        // Check Axis version in package.json
        const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
        if(!packageJson.version) error('No version found in package.json');


        console.log('Preparing installation...');
        console.log('Detected version: ' + chalk.bold.blue(packageJson.version || 'unknown'));


        // Check if Axis is supported
        const isSupported = versions(packageJson.version);
        if(!isSupported) error('Version ' + chalk.bold.blue(packageJson.version) + ' is not supported');
        if(!fs.existsSync(isSupported.config)) error('No config.yml found\nUse ' + chalk.white.bold('download') + ' to create new Axis bot');

        // Find Axis config
        const config = yml.parse(fs.readFileSync('./config/Bot/config.yml', 'utf8'));
        if(config.version != packageJson.version) error('Version mismatch\nCurrent version: ' + chalk.bold.blue(config.version) + '\nExpected version: ' + chalk.bold.blue(packageJson.version));

        // Create package.json backup
        console.log('Creating package.json backup...');
        if(!backup('./package.json')) error('Failed to backup package.json');


        const axisJson = new AxisJson(packageJson.version);
        const extractModule = new ExtractModule(moduleName, packageJson.version);

        // find axis.json
        console.log(chalk.yellow('Reading axis.json...'));
        axisJson.init();

        // extract module
        console.log(chalk.yellow('Extracting module...'));
        await extractModule.getModule(axisJson);

        moveFromCache(extractModule.cachePath, config.modulesFolder);

        console.log(chalk.green('Installation complete'));
    });
