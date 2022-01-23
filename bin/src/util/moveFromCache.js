const fs = require('fs');
const chalk = require('chalk');
const error = require('./printError');

module.exports = (path, modulesFolder) => {
    if(!fs.existsSync(path)) error(path + ' does not exist');
    const cacheDir = fs.readdirSync(path).filter(f => f !== '.axis');

    if(!fs.existsSync(modulesFolder)) error(modulesFolder + ' does not exist');
    const modulesDir = fs.readdirSync(modulesFolder);

    const conflicts = cacheDir.filter(file => modulesDir.some(m => m.toLowerCase() === file.toLowerCase()));
    if(conflicts.length > 0) error(`Conflicting ${conflicts.length > 1 ? 'files/folders' : 'file/folder'} found. Please remove them to continue: ${chalk.yellow(conflicts.join(', '))}`);

    for (const entry of cacheDir) {
        console.log(chalk.green(`${entry} to ${modulesFolder}`));
        fs.renameSync(`${path}/${entry}`, `${modulesFolder}/${entry}`);
    }

    return true;
}