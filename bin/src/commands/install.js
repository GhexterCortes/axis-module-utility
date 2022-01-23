const { CommandBuilder, CommandOption } = require('../util/CommandBuilder');
const backup = require('../util/backupFile');
const error = require('../util/printError');
const versions = require('../util/findSupportedVersion');
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
    .setExecute((args, command, commands) => {
        console.log('Installing module ' + chalk.bold.blue(args.get('module').value));
        

        if(!fs.existsSync('./package.json')) error('No package.json found\nUse ' + chalk.white.bold('download') + ' to create new Axis bot');
        const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));


        console.log('Preparing installation...');
        console.log('Detected version: ' + chalk.bold.blue(packageJson.version || 'unknown'));


        if(!packageJson.version) error('No version found in package.json');
        if(!fs.existsSync('./config/Bot/config.yml')) error('No config.yml found\nUse ' + chalk.white.bold('download') + ' to create new Axis bot');


        const config = yml.parse(fs.readFileSync('./config/Bot/config.yml', 'utf8'));
        if(config.version != packageJson.version) error('Version mismatch\nCurrent version: ' + chalk.bold.blue(config.version) + '\nExpected version: ' + chalk.bold.blue(packageJson.version));
        if(!versions(packageJson.version)) error('Version ' + chalk.bold.blue(packageJson.version) + ' is not supported');


        console.log('Backing up package.json...');
        if(!backup('./package.json')) error('Failed to backup package.json');


        console.log(chalk.green('Installation complete'));
    });
