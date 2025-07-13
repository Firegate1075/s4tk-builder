import {Args, Command, Flags} from '@oclif/core'
import { S4TKSettings } from "#helpers/settings"
import S4TKWorkspace from "#workspace/s4tk-workspace";
import * as vscode_uri from "vscode-uri"
import { runBuild } from "#building/build-runner"
import { LOCALE_OPTIONS } from "#constants"
import * as path from "path"

export default class Release extends Command {
  static override args = {
    project_root: Args.string({
      name: "project-root",
      description: 'path to the s4tk project',
      required: false,
      default: process.cwd()
    }),
  }
  static override description = 'Build the project in release mode. This creates zip archives after building for distributing the project.'
  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]
  static override flags = {
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
    const {args, flags} = await this.parse(Release)

    S4TKSettings.spacesPerIndent = flags.spaces
    S4TKSettings.defaultStringTableLocale = flags.defaultLocale as StringTableLocaleName

    let workspace = new S4TKWorkspace(vscode_uri.URI.file(path.resolve(args.project_root)))
    await workspace.loadConfig()

    let success = await runBuild(workspace, "release", "Release Build")
    if (success) {
      this.exit(0)
    } else {
      this.exit(1)
    }
  }
}
