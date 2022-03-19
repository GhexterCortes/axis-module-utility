# Axis Module Utility
Manage your [Axis](https://github.com/FalloutStudios/Axis) modules easily and install modules from zip archive. You can also download and extract a specific release of Axis in an empty directory.


## Installation
Use the following command to install the package.
**NOTE:** Install the package globally with `-g` flag.
```bash
npm i -g axis-module-utility
```

## Getting Started
### Commands
```bash
The following commands are available:
   axis clear-cache [auto-yes:BOOLEAN]
   axis download [version], [show-stack:BOOLEAN]
   axis help [command]
   axis init
   axis install <file>, [show-stack:BOOLEAN]
   axis list
   axis uninstall <file>, [auto-yes:BOOLEAN], [show-stack:BOOLEAN]
   axis version

Use axis help <command> to see help for a specific command
```
### Downloading Axis
To easily create Axis bot just run the following command to download the latest Axis release and automatically extract files in your current directory.
**NOTE:** U can only use this command to an empty directory.

Downloads the latest release of Axis and extract files in your current directory.
```bash
axis download
```
Downloads a specific release of Axis and extract files in your current directory.
```bash
axis download <version>
```

### Installing Modules
Install a module from a zip file. The archive must have a valid [`.axis`](#creating-axis) file to be installed.
```bash
axis install packaged-module.zip
```
### Creating Packaged Module
To create your module you must add [`.axis`](#creating-axis) inside your archive and it'll be formatted as JSON. Main file and other files such as folders can be added too.

> File structure
> ```
> Package.zip
>├─ ModuleRequiredFolder/
>│  ├─ index.js
>│  ├─ someFile.json
>├─ Main.js
>├─ .axis
> ``` 

### Creating .axis
**Required Properties**
+ `name` - `string` The module name displayed in `axis.json` and used to uninstall module. This property must match \^[\w-]{1,32}
+ `version` - `version` Version of your module.
+ `main` - `string` The main script file of your module.
+ `supportedVersions` - `string[]` Supported Axis versions.
+ `dependencies` - `{ [key: string]: string }` Dependencies of your module. `[]` if there are no dependencies.

**Optional Properties**
+ `author` - `string|string[]` The author(s) of the module.
+ `license` - `string` The license of the module.
+ `files` - `string[]` Additional files to be added to the other than the main file.
+ `description` - `string` The description of the module.
+ `repository` - `string` The repository of the module.

**.axis**
```json
{
	"name": "AxiisModule",
    "version": "1.0",
    "author": "You",
    "license": "MIT",
    "main": "yourMainFile.js",
    "files": [
        "includedFolder",
        "includedFile.js"
    ],
    "supportedVersions": [
        "1.6.6",
        "1.6.5",
        "1.6.4",
        "1.6.3"
    ],
    "description": "Description of the module",
    "repository": "https://github.com/YourUsername/YourRepository",
    "dependencies": {
        "dependency": "version"
    }
}
```