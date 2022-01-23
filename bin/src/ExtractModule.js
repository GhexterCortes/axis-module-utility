const StreamZip = require('node-stream-zip');
const error = require('./util/printError');
const validateModule = require('./util/validateModule');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

module.exports = class ExtractModule {
    constructor(location, version) {
        this.location = location;
        this.version = version;
        this.module = null;
        this.cachePath = null;
    }

    async getModule(axisJson) {
        let zip = new StreamZip.async({ file: this.location, storeEntries: true });

        if(!fs.existsSync('.axiscache')) fs.mkdirSync('.axiscache');

        const cachePath = './.axiscache/' + path.basename(this.location);

        if(fs.existsSync(cachePath)) fs.rmSync(cachePath + '/', { recursive: true, force: true });
        zip.on('extract', (entry, file) => {
            console.log(`Extracted ${chalk.blue(entry.name)} to ${chalk.green(file)}`);
        });

        await zip.extract(null, cachePath + '/', () => true);
        await zip.close();

        if(!fs.existsSync(cachePath)) error(`${cachePath} does not exist`);
        if(!fs.existsSync(cachePath + '/.axis')) {
            fs.unlinkSync(cachePath);
            error('Module does not contain a valid ".axis" file');
        }

        const module_ = JSON.parse(fs.readFileSync(cachePath + '/.axis', 'utf8'));
        try {
            validateModule(module_, axisJson.json, this.version);
        } catch (err) {
            fs.rmSync(cachePath + '/', { recursive: true, force: true });
            error(err.message);
        }

        this.module = module_;
        this.cachePath = cachePath;

        return this;
    }
}