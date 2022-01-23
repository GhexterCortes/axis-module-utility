const chalk = require('chalk');
const error = require('./util/printError');

module.exports = class PackageJson {
    constructor(packageJson) {
        this.packageJson = packageJson;
        this.modified = false;
    }

    addDependencies(dependencies) {
        if(!this.packageJson.dependencies) this.packageJson.dependencies = {};
        
        for(let dependency in dependencies) {
            if(this.packageJson.dependencies[dependency]) {
                console.log(chalk.bgYellow.black('Warning') +' '+ chalk.yellow(`${chalk.blue(dependency)} is already in package.json`));
                continue;
            }
            
            this.packageJson.dependencies[dependency] = dependencies[dependency];
            this.modified = true;
        }
        
        return this;
    }

    removeDependencies(dependencies) {
        if(!this.packageJson.dependencies) this.packageJson.dependencies = {};

        for(let dependency in dependencies) {
            if(!this.packageJson.dependencies[dependency]) {
                console.log(chalk.bgYellow.black('Warning') +' '+ chalk.yellow(`${chalk.blue(dependency)} is not in package.json`));
                continue;
            }
            
            delete this.packageJson.dependencies[dependency];
            this.modified = true;
        }

        return this;
    }
}