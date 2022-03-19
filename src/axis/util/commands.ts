import chalk from 'chalk';
import { compareTwoStrings } from 'string-similarity';

export interface Command {
    name: string;
    aliases: string[];
    description: string;
    options: CommandOption[];
    execute: (args: CommandOptionValue[], command: Command, commands: Command[]) => void;
}

export type CommandOptionType = 'STRING' | 'NUMBER' | 'BOOLEAN';

export interface CommandOption {
    name: string;
    description: string;
    required: boolean;
    type: CommandOptionType;
}

export interface CommandOptionValue extends CommandOption {
    value: any;
}

export class CreateCommand implements Command {
    public name: string = '';
    public aliases: string[] = [];
    public description: string = '';
    public options: CommandOption[] = [];
    public execute(args: CommandOptionValue[], command: Command, commands: Command[]): void {
        throw new Error('Command execute method not implemented');
    }

    setName(name: string): CreateCommand {
        if (!/^[\w-]{1,32}$/.test(name)) throw new Error(`Invalid command name ${chalk.red(name)}`);
        this.name = name;
        return this;
    }

    addAlias(alias: string): CreateCommand {
        if (!/^[\w-]{1,32}$/.test(alias)) throw new Error(`Invalid alias ${chalk.red(alias)}`);
        if (this.aliases.find(a => a === alias)) throw new Error(`Alias ${chalk.red(alias)} already exists`);
        this.aliases = [...this.aliases, alias];
        return this;
    }

    setDescription(description: string): CreateCommand {
        this.description = description;
        return this;
    }

    addOption(name: string, description: string, required: boolean, type: CommandOptionType = 'STRING'): CreateCommand {
        if (!/^[\w-]{1,32}$/.test(name)) throw new Error(`Invalid option name ${chalk.red(name)}`);
        if (this.options.find(option => option.name === name)) throw new Error(`Option ${chalk.red(name)} already exists`);
        if (required && !(this.options[this.options.length - 1]?.required ?? true)) throw new Error(`All optional options must be at the end`);

        this.options = [
            ...this.options,
            {
                name,
                description,
                required,
                type
            }
        ];
        return this;
    }

    setExecute(execute: (args: CommandOptionValue[], command: Command, commands: Command[]) => void): CreateCommand {
        this.execute = execute;
        return this;
    }
}

export function createCommandUsage(command: Command, includeArgs: boolean = true): string {
    const options = includeArgs ? command.options.map(option => {
        const required = [
            option.required ? chalk.red('<') : chalk.blue('['),
            option.required ? chalk.red('>') : chalk.blue(']'),
        ];
        return ` ${required[0]}${option.name}${ option.type !== 'STRING' ? chalk.grey(':' + option.type) : '' }${required[1]}`;
    }) : [];

    return `${chalk.green('axis ' + command.name)}${options.join()}`;
}

export function executeCommand(commands: CreateCommand[]): void {
    const command = process.argv.slice(2)[0];
    const args = process.argv.slice(3);

    if (!command) {
        console.log(`Usage: axis <command> [options]`);
        console.log(`Use ${chalk.green('axis help')} to see a list of commands`);
        process.exit(0);
    }

    const commandObject = commands.find(c => c.name === command || c.aliases.includes(command));

    if (!commandObject) {
        console.log(`Command ${chalk.red(command)} not found`);
        const filter = commands.filter(c => compareTwoStrings(c.name, command) > 0.5 || c.aliases.some(a => compareTwoStrings(a, command) > 0.5) || c.description.includes(command));
        if (filter.length) {
            console.log(`Did you mean ${chalk.green(filter.map(c => c.name).join(', '))}?`);
        }

        process.exit(1);
    }
    if (args.length > commandObject.options.length) {
        console.log(`Too many arguments`);
        console.log(`Usage: ` + createCommandUsage(commandObject));
        process.exit(1);
    }

    const options = [];
    for (let opt of commandObject.options) {
        let arg: any = args[options.length];
        if (!arg && opt.required) {
            console.log(`Missing required argument ${chalk.red(opt.name)} — ${opt.description}`);
            console.log(`Usage: ` + createCommandUsage(commandObject));
            process.exit(1);
        }

        if (opt.type === 'NUMBER') {
            arg = Number(arg);
        } else if (opt.type === 'BOOLEAN') {
            if (arg === 'true' || arg === 't' || arg === '1' || arg === 'yes' || arg === 'y') {
                arg = true;
            } else if (arg === 'false' || arg === 'f' || arg === '0' || arg === 'no' || arg === 'n') {
                arg = false;
            } else {
                if (typeof arg !== 'undefined') {
                    console.log(`Invalid boolean value ${chalk.red(arg)}`);
                    console.log(`Usage: ` + createCommandUsage(commandObject));
                    process.exit(1);
                }
            }
        }

        const option: CommandOptionValue = {
            ...opt,
            value: arg,
        };

        options.push(option);
    }

    commandObject.execute(options, commandObject, commands);
}