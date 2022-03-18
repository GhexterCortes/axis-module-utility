#!/usr/bin/env node
import { readdirSync } from 'fs';
import { CreateCommand, executeCommand } from './axis/util/commands';

const commandFiles = readdirSync(__dirname + `/axis/commands/`).filter(file => file.endsWith('.js'));
const commands = commandFiles.map((file): CreateCommand  => require(`./axis/commands/${file}`).command);

executeCommand(commands);