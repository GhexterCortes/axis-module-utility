const chalk = require('chalk');
module.exports = (module_, axisJson, version) => {

    if(!module_.name) throw new Error('No module name found in the target module');
    if(!module_.main) throw new Error('No main file found in the target module');
    if(!module_.version) throw new Error('No module version found in the target module');
    if(!module_.supportedVersions || typeof module_.supportedVersions !== 'object') throw new Error('No supported versions found in the target module');

    if(!/^[\w-]{1,32}$/.test(module_.name)) throw new Error('Module name is invalid');
    if(typeof module_.main !== 'string') throw new Error('Main file is not a string');
    if(typeof module_.version !== 'string') throw new Error('Module version is not a string');
    if(module_.description && typeof module_.description !== 'string') throw new Error('Module description is not a string');
    if(module_.description && module_.description.length > 1024) throw new Error('Module description is too long');
    if(module_.description && module_.description.length < 1) throw new Error('Module description is too short');
    if(axisJson.modules.find(m => m.name === module_.name)) throw new Error('Module ' + chalk.bold.blue(module_.name) + ' already exists');
    if(!module_.supportedVersions.includes(version)) throw new Error('Module ' + chalk.bold.blue(module_.name) + ' is not supported on this version of Axis');
    if(module_.dependencies && typeof module_.dependencies !== 'object') throw new Error('Dependencies are not an object');

    return true;
}