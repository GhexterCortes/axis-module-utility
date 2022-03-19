import { CreateCommand } from "../util/commands";

export const command = new CreateCommand()
    .setName('install')
    .addAlias('i')
    .addAlias('in')
    .setDescription('Install a archived module')
    .addOption('file', 'module archive to install', true)
    .setExecute(async (args, flags) => {
        
    });