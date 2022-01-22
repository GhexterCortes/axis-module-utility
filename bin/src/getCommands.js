const fs = require('fs');
const error = require('./util/printError');

module.exports = () => {
    const commands = [];

    const commandFiles = fs.readdirSync(__dirname + '/commands/', {  }).filter(file => file.endsWith('.js'));

    for (const commandFile of commandFiles) {
        try {
            const command = require(`${__dirname}/commands/${commandFile}`);
            commands.push(command);
        } catch (err) {
            // error(err.stack || err);
            continue;
        }
    }

    return commands;
}