import {Args, Command, Flags} from '@oclif/core'
import { S4TKSettings } from "#helpers/settings"
import S4TKWorkspace from "#workspace/s4tk-workspace";
import * as vscode_uri from "vscode-uri"
import { runBuild } from "#building/build-runner"
import { S4TKFilename } from "#constants"
import * as path from "path"


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
      helpGroup: "BUILD MODES",
      description: "Build the project in release mode. This creates zip archives after building for distributing the project.",
      exclusive: ["development", "dryRun"],
    }),
    development: Flags.boolean({
      char: 'b',
      summary: "build in development mode",
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
    })
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Build)

    // TODO: set S4TKSettings according to flags

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
