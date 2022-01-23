const fs = require('fs');
const chalk = require('chalk');

module.exports = (path, modulesFolder, ignore) => {
    ignore = ignore || [];

    if(!fs.existsSync(path)) throw new Error(path + ' does not exist');
    const cacheDir = fs.readdirSync(path).filter(f => f !== '.axis' && !ignore.includes(f));

    if(!fs.existsSync(modulesFolder)) throw new Error(modulesFolder + ' does not exist');
    const modulesDir = fs.readdirSync(modulesFolder);

    const conflicts = cacheDir.filter(file => modulesDir.some(m => m.toLowerCase() === file.toLowerCase()));
    if(conflicts.length > 0) {throw new Error(`Conflicting ${conflicts.length > 1 ? 'files/folders' : 'file/folder'} found. Please remove them to continue: ${chalk.yellow(conflicts.join(', '))}`)};

    let movedFiles = [];
    for (const entry of cacheDir) {
        console.log(chalk.green(`${chalk.blue(entry)} moved to ./${chalk.blue(modulesFolder)}/`));
        fs.renameSync(`${path}/${entry}`, `${modulesFolder}/${entry}`);
        
        if(fs.existsSync(`${modulesFolder}/${entry}`)) movedFiles = [`${modulesFolder}/${entry}`, ...movedFiles];
    }

    if(movedFiles.length != cacheDir.length) {
        for (const file of movedFiles) {
            fs.rmSync(file, { recursive: true, force: true });
        }
        console.log(movedFiles, cacheDir);
        throw new Error(`Failed to move ${cacheDir.length - movedFiles.length} files/folders`);
    }

    return true;
}