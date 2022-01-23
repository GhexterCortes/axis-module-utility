# Axis Module Utility
Manage your [Axis](https://github.com/FalloutStudios/Axis) modules easily and install modules from zip archive. You can also download and extract a specific release of Axis in an empty directory.

*This is currently under development*

## Installation
Use the following command to install the package.
**NOTE:** Install the package globally with `-g` flag.
```bash
npm i -g axis-module-utility
```

## Getting Started
### Downloading Axis
To easily create Axis bot just run the following command to download the latest Axis release and automatically extract files in your current directory.
**NOTE:** U can only use this command to an empty directory. 
```bash
axis download
```

To download a specific version just add the GitHub release tag without the `v`.
```bash
axis download 1.4.1
```
### Installing Modules
Install a module from a zip file. The archive must have a valid `.axis` file to be installed.
```bash
axis install packaged-module.zip
```

### Creating Packaged Module
To create your module you must add `.axis` inside your archive and it'll be formatted as JSON. Main file and other files such as folders can be added too.

> structure
> ```
> Package.zip
>├─ ModuleRequiredFolder/
>│  ├─ index.js
>│  ├─ someFile.json
>├─ Main.js
>├─ .axis
> ``` 

### Creating .axis
**Required**
+ `name` - `string` The module name displayed in `axis.json` and used to uninstall module. This property must match \^[\w-]{1,32}
+ `main` - `string` The main script file of your module.
+ `version` - `version` Version of your module.
+ `supportedVersions` - `Object[]` Supported Axis versions.

**Optional**
+ `description` - `string` Module description.
+ `dependencies` - `Object[]` Required dependencies to run your module. This will be added to `package.json` if it doesn't exist in `package.json`'s dependencies.
+ `ignore` - `Object[]` This will prevent certain files from being copied to their modules folder.
+ `folders` - `Object[]` Specify which *files/folder* are included to your module for uninstallation.

**.axis**
```json
{
	"name": "test-module",
	"version": "1.0",
	"main": "Main.js",
	"folders": ["ModuleRequiredFolder"],
	"supportedVersions": ["1.6.0","1.6.1","1.6.2","1.6.3"],
	"description": "Test description",
	"dependencies": {
		"axios": "^0.25.0"
	}
}
```

