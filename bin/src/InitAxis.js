const validateModule = require('./util/validateModule');
const error = require('./util/printError');
const fs = require('fs');

module.exports = class AxisJson {
    constructor(version) {
        this.version = version;
        this.json = {
            modules: [],
        };
        this.cache = { axisJson: this.json };
    }

    init() {
        if(!fs.existsSync('./axis.json')) fs.writeFileSync('./axis.json', JSON.stringify(this.json, null, 2));
        this.json = JSON.parse(fs.readFileSync('./axis.json', 'utf8'));

        if(!this.json.modules) this.json.modules = [];
        this.cache.axisJson = this.json;
        
        return this;
    }

    addModule(module_) {
        if(!this.json.modules) this.json.modules = [];

        try {
            validateModule(module_, this.json, this.version);
        } catch(err) {
            error(err.message);
        }

        this.json.modules.push(module_);
        return this;
    }

    removeModule(module_) {
        if(!this.json.modules) this.json.modules = [];

        this.json.modules.filter(m => m.name !== module_.name);
        return this;
    }

    save() {
        fs.writeFileSync('./axis.json', JSON.stringify(this.json, null, 2));
        this.cache.axisJson = this.json;
        return this;
    }
}