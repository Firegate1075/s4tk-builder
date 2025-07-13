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
    // flag with no value (-f, --force)
    force: Flags.boolean({char: 'f'}),
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({char: 'n', description: 'name to print'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Build)

    // TODO: set S4TKSettings according to flags


    let workspace = new S4TKWorkspace(vscode_uri.URI.file(args.project_root))
    console.log("Workspace created")
    await workspace.loadConfig()
    
    runBuild(workspace, "build", "Build")


  }
}
