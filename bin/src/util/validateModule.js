const chalk = require('chalk');
module.exports = (module_, axisJson, version) => {
    // Required properties
    if(!module_.name) throw new Error('No module name found in the target module');
    if(!module_.main) throw new Error('No main file found in the target module');
    if(!module_.version) throw new Error('No module version found in the target module');
    if(!module_.supportedVersions || typeof module_.supportedVersions !== 'object') throw new Error('No supported versions found in the target module');

    // Check if the module name is valid
    if(!/^[\w-]{1,32}$/.test(module_.name)) throw new Error('Module name is invalid');

    // Check if module main file is valid name
    if(typeof module_.main !== 'string') throw new Error('Main file is not a string');

    // Check if version is valid
    if(typeof module_.version !== 'string') throw new Error('Module version is not a string');

    // Validate description
    if(module_.description && typeof module_.description !== 'string') throw new Error('Module description is not a string');
    if(module_.description && module_.description.length > 1024) throw new Error('Module description is too long');
    if(module_.description && module_.description.length < 1) throw new Error('Module description is too short');

    // Check if module is supported
    if(!module_.supportedVersions.includes(version)) throw new Error('Module ' + chalk.bold.blue(module_.name) + ' is not supported on this version of Axis');

    // Check if dependencies are valid
    if(module_.dependencies && typeof module_.dependencies !== 'object') throw new Error('Dependencies are not an object');

    // Check if ignore is valid
    if(module_.ignore && typeof module_.ignore !== 'object') throw new Error('Ignore is not an object');

    // If exists
    if(axisJson.modules.find(m => m.name === module_.name)) throw new Error('Module ' + chalk.bold.blue(module_.name) + ' already exists');


    return true;
}