const chalk = require('chalk');
const _typeof = require('./util/typeof');

module.exports = (commands) => {
    let argv = process.argv.slice(2);

    if (argv.length === 0) return commands?.find(c => c.name.includes('help'))?.execute(null, null, commands);
    const command = commands.find(c => c.name.some(w => w === argv[0]));

    if (!command) {
        console.log(chalk.red('Command not found:') + ' ' + argv[0]);
        console.log(chalk.red('Use ') + chalk.bold('help') + chalk.red(' to display available commands'));
        process.exit(1);
    }

    argv = argv.slice(1);
    const requiredOptions = command.options.filter(o => o.required);

    if(requiredOptions.length > argv.length) {
        console.log(chalk.red('Incufficient arguments'));
        console.log(chalk.red('Use ') + chalk.bold('help') + chalk.red(' to display available commands'));
        process.exit(1);
    }

    argv = argv.map((opt, i) => {
        const option = command.options[i];

        if(!option) {
            console.log(chalk.red('Unknown option:') + ' ' + opt);
            console.log(chalk.red('Use ') + chalk.bold('help') + chalk.red(' to display available commands'));
            process.exit(1);
        }

        if(option.type != _typeof(typeof opt)) {
            console.log(chalk.red('Invalid argument type'));
            console.log(chalk.red('Use ') + chalk.bold('help') + chalk.red(' to display available commands'));
            process.exit(1);
        }

        option.value = opt;

        return option;
    });

    argv.get = (name) => {
        const option = argv.find(o => o.name === name);
        
        if(!option) return null;

        return option;
    };

    command.execute(argv, command, commands);
}