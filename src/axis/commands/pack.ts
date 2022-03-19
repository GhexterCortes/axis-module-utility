import { CreateCommand } from "../util/commands";
import { default as Zip } from "adm-zip";
import chalk from "chalk";
import { existsSync, readFileSync, lstatSync, renameSync, mkdirSync } from "fs";
import path from "path";
import { AxisJsonModule } from "../util/axisJSON";

export const command = new CreateCommand()
    .setName('pack')
    .addAlias('pk')
    .addAlias('p')
    .setDescription('Pack all files and main file in .axis file into a zip file')
    .addOption('out-dir', 'module archive to install', false)
    .setExecute((args) => {
        let outDir = args[0].value || process.cwd();
        let moduleName = undefined;
        
        if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
        if (outDir.endsWith('.zip')) {
            moduleName = path.basename(outDir);
            outDir = path.dirname(outDir);
        }

        if (!existsSync(path.join('./', '.axis'))) {
            console.log(chalk.red('No .axis file found in current directory'));
            process.exit(1);
        }

        const dotAxisFile = JSON.parse(readFileSync(path.join('./', '.axis'), 'utf8'));
        if (!dotAxisFile.name || !dotAxisFile.version || !dotAxisFile.main || !dotAxisFile.supportedVersions || !dotAxisFile.dependencies) {
            console.log(chalk.red('Invalid .axis file'));
            console.log('');
            console.log('Use ' + chalk.green('axis init-dot-axis') + ' to create a valid .axis file');
            process.exit(1);
        }

        if(dotAxisFile.folders) dotAxisFile.files = dotAxisFile.folders;
        const dotAxis: AxisJsonModule = dotAxisFile;

        const zip = new Zip();

        console.log('Packing files...');
        zip.addLocalFile(path.join('./', dotAxis.main));
        zip.addLocalFile(path.join('./', '.axis'));

        if (dotAxis.files?.length) {
            for (const file of dotAxis.files) {
                if (lstatSync(path.join('./', file)).isFile()) {
                    zip.addLocalFile(path.join('./', file));
                } else if (lstatSync(path.join('./', file)).isDirectory()) {
                    zip.addLocalFolder(path.join('./', file), file);
                } else {
                    console.log(`${chalk.red(file)} is not a valid file or directory`);
                    continue;
                }

                console.log(`${chalk.green(file)} added to archive`);
            }
        }

        const fileName = moduleName || `${dotAxis.name}-${dotAxis.version}.zip`;

        if (existsSync(path.join(outDir, fileName))) renameSync(path.join(outDir, fileName), path.join(outDir, `${dotAxis.name}-${dotAxis.version}-old.zip`));
        
        console.log(`Creating archive ${chalk.green(fileName)}`);
        zip.writeZip(path.join(outDir, fileName));

        console.log(`${chalk.green(fileName)} created located in ${chalk.green(outDir)}`);
    });