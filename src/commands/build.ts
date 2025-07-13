import {Args, Command, Flags} from '@oclif/core'
import { S4TKSettings } from "#helpers/settings"
import S4TKWorkspace from "#workspace/s4tk-workspace";
import * as vscode_uri from "vscode-uri"
import { runBuild } from "#building/build-runner"
import { S4TKFilename } from "#constants"
import * as path from "path"


const LOCALE_OPTIONS = [
  "English",
  "ChineseSimplified",
  "ChineseTraditional",
  "Czech",
  "Danish",
  "Dutch",
  "Finnish",
  "French",
  "German",
  "Italian",
  "Japanese",
  "Korean",
  "Norwegian",
  "Polish",
  "Portuguese",
  "Russian",
  "Spanish",
  "Swedish",
] as const

export default class Build extends Command {
  static override args = {
    project_root: Args.string({
      name: "project-root",
      description: 'path to the s4tk project',
      required: false,
      default: process.cwd()
    }),
  }
  static override description = 'describe the command here'
  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]
  static override flags = {
    release: Flags.boolean({
      char: 'r',
      summary: "build in release mode",
      helpGroup: "BUILD MODE",
      description: "Build the project in release mode. This creates zip archives after building for distributing the project.",
      exclusive: ["development", "dryRun"],
    }),
    development: Flags.boolean({
      char: 'b',
      summary: "build in development mode (default)",
      helpGroup: "BUILD MODE",
      description: "Build the project in development mode. This builds the source files into packages.",
      exclusive: ["release", "dryRun"],
    }),
    dryRun: Flags.boolean({
      char: 'd',
      summary: "build in dry-run mode",
      helpGroup: "BUILD MODE",
      description: "Build the project in dry run mode. This compiles the source files but does not write the files.",
      exclusive: ["release", "development"],
      helpLabel: "-d, --dry-run",
      aliases: ["dry-run"]
    }),
    spaces: Flags.integer({
      min: 0,
      char: 's',
      summary: "number of spaces per indent in json output",
      helpGroup: "SETTINGS",
      description: "Specify the number of spaces per indent in the generated json output files.",
      default: 2,
    }),
    defaultLocale: Flags.string({
      char: 'l',
      summary: "default string table locale",
      helpGroup: "SETTINGS",
      description: "Set the default locale of string tables, where no locale is specified in the metadata. Options: " + LOCALE_OPTIONS.join('|'),
      options: LOCALE_OPTIONS,
      default: "English",
    })
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Build)

    // TODO: set S4TKSettings according to flags
    S4TKSettings.spacesPerIndent = flags.spaces
    S4TKSettings.defaultStringTableLocale = flags.defaultLocale as StringTableLocaleName

    let workspace = new S4TKWorkspace(vscode_uri.URI.file(path.resolve(args.project_root)))
    await workspace.loadConfig()
    
    if (flags.release)
      runBuild(workspace, "release", "Release Build")
    else if (flags.dryRun)
      runBuild(workspace, "dryrun", "Dry-Run Build")
    else // default to development build
      runBuild(workspace, "build", "Development Build")
  }
}
