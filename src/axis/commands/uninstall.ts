import { CreateCommand } from "../util/commands";

export const command = new CreateCommand()
    .setName('uninstall')
    .addAlias('u')
    .addAlias('un')
    .setDescription('Uninstall axis module from axis.json')
    .addOption('module-name', 'name of installed module to uninstall', true)
    .setExecute(async (args, flags) => {
        
    });