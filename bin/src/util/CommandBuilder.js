const chalk = require('chalk');

class CommandBuilder {
    constructor() {
        this.name = null;
        this.description = null;
        this.options = [];
        this.execute = null;
    }

    /**
     * @param {string} name - The name of the command
     */
    setName(name) {
        if(!name || typeof name !== 'string' && typeof name !== 'object'|| typeof name == 'string' && !/^[\w-]{1,32}$/.test(name)) throw new TypeError('command name must be a valid string and match '+chalk.blue('/^[\\w-]{1,32}$/'));
        this.name = typeof name == 'string' ? [name] : name;

        return this;
    }

    /**
     * @param {string} description - The description of the command
     */
    setDescription(description) {
        if(!description || typeof description !== 'string') throw new TypeError('command description must be a valid string');
        this.description = description;

        return this;
    }

    /**
     * @param {Object[]} option - The option to add to the command
     */
    addOption(option) {
        if(!option || !(option instanceof CommandOption)) throw new TypeError('command option must be a valid CommandOption instance');
        this.options.push(option);

        return this;
    }

    /**
     * 
     * @param {function} execute - The function to execute when the command is called
     * @returns 
     */
    setExecute(execute = () => { /* do nothing */ }) {
        if(!execute || typeof execute !== 'function') throw new TypeError('command execute must be a valid function');
        this.execute = execute;

        return this;
    }
}

class CommandOption {
    constructor () {
        this.name = null;
        this.description = null;
        this.type = null;
        this.required = false;
    }

    /**
     * @param {string} name - Option name that match ^[\w-]{1,32}$
     */
    setName(name) {
        if(!name || typeof name !== 'string' || typeof name == 'string' && !/^[\w-]{1,32}$/.test(name)) throw new TypeError('command option name must be a valid string and match '+chalk.blue('/^[\\w-]{1,32}$/'));
        this.name = name;

        return this;
    }

    /**
     * @param {string} description - Option description
     */
    setDescription(description) {
        if(!description || typeof description !== 'string') throw new TypeError('command option description must be a valid string');
        this.description = description;

        return this;
    }
    
    /**
     * @param {string} type - Option type can be string, number, boolean
     */
    setType(type) {
        if(type !== 'string' && type !== 'number' && type !== 'boolean') throw new TypeError('command option type must be a valid data type');
        this.type = type;

        return this;
    }

    /**
     * @param {boolean} required - Option required
     */
    setRequired(required) {
        if(typeof required !== 'boolean') throw new TypeError('command option required must be a valid boolean');
        this.required = required;

        return this;
    }
}

module.exports = { CommandBuilder, CommandOption };