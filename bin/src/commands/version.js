const { CommandBuilder } = require('../util/CommandBuilder');
module.exports = new CommandBuilder()
    .setName(['version','v'])
    .setDescription('Display version information')
    .setExecute(() => {
        console.log(`${require('../../../package.json').name} v${require('../../../package.json').version}`);
    });