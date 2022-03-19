
import { readdirSync, createWriteStream, rmSync, renameSync } from 'fs';
import { CreateCommand } from '../util/commands';
import { replaceAll } from 'fallout-utility';
import { default as axios } from 'axios';
import { async as AsyncZip } from 'node-stream-zip';
import * as path from 'path';
import chalk from 'chalk';

export const command = new CreateCommand()
    .setName('download')
    .addAlias('d')
    .addAlias('dw')
    .setDescription('Download the latest or specified version of Axis to current directory')
    .addOption('version', 'Specify the version of Axis to download', false)
    .addOption('show-stack', 'Show stack trace when error occurs', false, 'BOOLEAN')
    .setExecute(async (args) => {
        let version = args[0].value ? replaceAll(args[0].value, 'v', '') : null;
        const currentDir = process.cwd();

        if (version) version = `v${version}`;

        if (readdirSync(currentDir).filter(f => !f.startsWith('.') && !f.startsWith('_') && f !== 'axis.json').length > 0) {
            console.log(chalk.red(`You can't download Axis to a directory that already contains files.`));
            process.exit(1);
        }

        const downloadUrl = `https://api.github.com/repos/FalloutStudios/Axis/releases/${typeof version === 'string' ? 'tags/'+version : 'latest'}`;
        const download = await axios({
            method: 'GET',
            url: downloadUrl
        }).catch(err => {
            console.log(`An error occurred while trying to fetch Axis repository: ${chalk.red(args[1].value ? err.stack : err.message)}`);
            console.log('');
            console.log(`URL: ${chalk.green(downloadUrl)}`);
            process.exit(1);
        });

        if (!download || !download.data || download.status !== 200) {
            console.log(chalk.red(`An error occurred while trying to download Axis`));
            console.log(`Status code: ${download.status}`);
            process.exit(1);
        }

        const zipHttp = await axios({
            method: 'GET',
            url: download.data.zipball_url,
            responseType: 'stream'
        }).catch(err => {
            console.log(`An error occurred while trying to download Axis zip file: ${chalk.red(args[1].value ? err.stack : err.message)}`);
            console.log('');
            console.log(`URL: ${chalk.green(download.data.zipball_url)}`);
            process.exit(1);
        });

        if (!zipHttp || !zipHttp.data || zipHttp.status !== 200) {
            console.log(chalk.red(`An error occurred while trying to download Axis`));
            console.log(`Status code: ${zipHttp.status}`);
            process.exit(1);
        }

        zipHttp.data.pipe(createWriteStream(path.join(currentDir, 'Axis.zip')));
        zipHttp.data.on('error', (err: Error): never => {
            console.log(`An error occurred while trying to download Axis zip: ${chalk.red(args[1].value ? err.stack : err.message)}`);
            console.log('');
            console.log(`URL: ${chalk.green(download.data.zipball_url)}`);
            process.exit(1);
        });
        zipHttp.data.on('end', async () => {
            console.log(`Axis downloaded successfully: Axis.zip (${chalk.blue(download.data.tag_name)})`);
            console.log('');
            console.log('Extracting Axis...');
            console.log('');
            
            const zip = new AsyncZip({
                file: path.join(currentDir, 'Axis.zip'),
                storeEntries: true
            });
            const entries = await zip.entries();
            
            if (!Object.keys(entries).length) {
                console.log(chalk.red('An error occurred while trying to extract Axis zip'));
                process.exit(1);
            }

            let i=0;
            for (const entry in entries) {
                if (i) break;
                console.log('Extracting ' + chalk.blue(entry));
                await zip.extract(entry, currentDir);
                i++;
            }

            console.log(chalk.green('Axis extracted successfully'));
            console.log('');
            console.log('Cleaning up...');
            console.log('');
            
            rmSync(path.join(currentDir, 'Axis.zip'), { recursive: true, force: true });
            console.log(chalk.green('Axis.zip') + ' removed successfully');
            console.log('');
            console.log('Axis ready to use!');
            console.log('');
            console.log('To install Axis dependencies, run:');
            console.log(chalk.bgGray('                   '));
            console.log(chalk.bgGray.blue('   $ ') + chalk.bgGray.green('npm install   '));
            console.log(chalk.bgGray('                   '));
            console.log('To run Axis, run:');
            console.log(chalk.bgGray('                   '));
            console.log(chalk.bgGray.blue('   $ ') + chalk.bgGray.green('node index    '));
            console.log(chalk.bgGray('                   '));
        });
    });