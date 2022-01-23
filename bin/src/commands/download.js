const { CommandBuilder, CommandOption } = require('../util/CommandBuilder');
const StreamZip = require('node-stream-zip');
const axios = require('axios').default;
const error = require('../util/printError');
const chalk = require('chalk');
const fs = require('fs');

module.exports = new CommandBuilder()
    .setName(['download','dw'])
    .setDescription('Download Axis from GitHub to the current directory')
    .addOption(new CommandOption()
        .setName('version')
        .setDescription('The version of Axis to download')
        .setType('string')
        .setRequired(false)
    )
    .setExecute(async (args, command, commands) => {
        const version = args ? args.get('version') : null;

        if(fs.readdirSync('./').length > 0) error('You can only download Axis in an empty directory');
        const download = await axios({
            method: 'GET',
            url: `https://api.github.com/repos/FalloutStudios/Axis/releases/${version ? 'tags/v'+version.value : 'latest'}`
        }).catch(err => error(err.message));
        if(!download) error('Axis could not be downloaded');

        const zipHttp = await axios({
            method: 'GET',
            url: download.data.zipball_url,
            responseType: 'stream'
        }).catch(err => error(err.message));
        if(!zipHttp) error('Axis could not be downloaded');

        zipHttp.data.pipe(fs.createWriteStream('Axis.zip'));
        zipHttp.data.on('end', async () => {
            console.log(chalk.greenBright('Axis downloaded successfully'));
            console.log(chalk.greenBright('Extracting...'));
            const zip = new StreamZip.async({
                file: 'Axis.zip',
                storeEntries: true
            });

            const entries = await zip.entries();
            await zip.extract(Object.keys(entries).shift(), './');

            console.log(chalk.greenBright('Extraction complete'));
            fs.unlinkSync('Axis.zip');

            console.log(chalk.greenBright('Axis downloaded!'));
            console.log(chalk.greenBright('Please run ' + chalk.white.bold('npm install') + ' to install dependencies'));
            console.log(chalk.greenBright('Please run ' + chalk.white.bold('node index.js') + ' to run Axis'));
        });
    });