#!/usr/bin/env node

const commands = require('./src/getCommands')();
const arguments = require('./src/arguments')(commands);