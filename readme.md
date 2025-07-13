# Sims 4 Toolkit Build System

This package exposes the build system of the [Sims 4 Toolkit Visual Studio Code Extension](https://vscode.sims4toolkit.com/#/) as a command line tool.

The build system supports the build modes
- dry run
- development build
- release

See also [S4TK build config](https://vscode.sims4toolkit.com/#/features/build-config).

## Installation
NodeJS is required to use the package.
To install the tool, run:
```
$ npm install --global s4tk-builder
``` 

## Usage
The help option `$ s4tk-builder --help` shows a list of the available commands:
```
$ s4tk-builder --help
Build system for Sims 4 Toolkit projects. This command line tool implements the build system of the S4TK Visual Studio Code extension.

VERSION
  s4tk-builder/0.1.0 win32-x64 node-v22.17.0

USAGE
  $ s4tk-builder [COMMAND]

COMMANDS
  build    Build the project in development mode. This builds the source files into packages.
  dry-run  Build the project in dry run mode. This compiles the source files but does not write the files.
  release  Build the project in release mode. This creates zip archives after building for distributing the project.
```

For options for the commands, use `$ s4tk-builder [COMMAND] --help`, e.g.
```
$ s4tk-builder build --help
Build the project in development mode. This builds the source files into packages.

USAGE
  $ s4tk-builder build [PROJECT_ROOT] [-s <value>] [-l
    English|ChineseSimplified|ChineseTraditional|Czech|Danish|Dutch|Finnish|French|German|Italian|Japanese|Korean|Norwegian|Polish|Portuguese|Russian|Spanish|Swedish]

ARGUMENTS
  PROJECT_ROOT  [default: C:\Users\linus\Documents\GitHub\s4tk-builder] path to the s4tk project

SETTINGS FLAGS
  -s, --spaces=<value>          [default: 2] number of spaces per indent in json output
  -l, --defaultLocale=<option>  [default: English] default string table locale
                                <options: English|ChineseSimplified|ChineseTraditional|Czech|Danish|Dutch|Finnish|French|German|Italian|Japanese|Korean|Norwegian|Polish|Portuguese|Russian|Spanish|Swedish>   

DESCRIPTION
  Build the project in development mode. This builds the source files into packages.

EXAMPLES
  $ s4tk-builder build

FLAG DESCRIPTIONS
  -s, --spaces=<value>  number of spaces per indent in json output

    Specify the number of spaces per indent in the generated json output files.

  -l, --defaultLocale=<option>  default string table locale

    Set the default locale of string tables, where no locale is specified in the metadata. Options:
    English|ChineseSimplified|ChineseTraditional|Czech|Danish|Dutch|Finnish|French|German|Italian|Japanese|Korean|Norwegian|Polish|Portuguese|Russian|Spanish|Swedish
```