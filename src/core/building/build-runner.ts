import * as vscode_uri from "vscode-uri"
import * as fs from "fs" 
import * as path from "path"
import { S4TKFilename } from "#constants";
import { S4TKSettings } from "#helpers/settings";
import S4TKWorkspace from "#workspace/s4tk-workspace";
import { BuildMode, BuildSummary } from "./summary";
import { buildProject } from "./builder";

/**
 * Runs a build for the given workspace and displays all necessary information
 * in the VS Code window before, during, and after.
 * 
 * @param workspace Workspace to run build
 * @param mode Mode to build for
 * @param readableMode Human-readable text for `mode`
 */
export async function runBuild(workspace: S4TKWorkspace, mode: BuildMode, readableMode: string) {
    const summary = await buildProject(workspace, mode);
    const buildSummaryUri = await _outputBuildSummary(workspace, summary);

    if (summary.buildInfo.success) {
      const warnings: string[] = [];
      const warnIf = (num: number, msg: string) => {
        if (num) warnings.push(`${num} ${msg}${(num === 1) ? '' : 's'}`);
      }
      warnIf(summary.buildInfo.problems, "problem");
      warnIf(summary.written.ignoredSourceFiles.length, "ignored file");
      warnIf(summary.written.missingSourceFiles.length, "missing file");
      const warningMsg = warnings.length ? ` [${warnings.join("; ")}]` : "";
      console.info(`S4TK ${readableMode} Successful${warningMsg}`);
      return true
    } else if (buildSummaryUri) {
      console.error(
        `S4TK ${readableMode} Failed: ${summary.buildInfo.fatalErrorMessage}. See: ${path.basename(buildSummaryUri.fsPath)}`
      );
      return false
    } else {
      console.error(`S4TK ${readableMode} Failed: ${summary.buildInfo.fatalErrorMessage}`);
      return false
    }
}

async function _outputBuildSummary(workspace: S4TKWorkspace, summary: BuildSummary): Promise<vscode_uri.URI | undefined> {
  if (workspace.config.buildSettings.outputBuildSummary === "none") return;
  const uri = vscode_uri.Utils.joinPath(workspace.rootUri, S4TKFilename.buildSummary);
  if (!uri) return;
  const content = JSON.stringify(summary, null, S4TKSettings.spacesPerIndent);
  //await vscode.workspace.fs.writeFile(uri, Buffer.from(content));
  await fs.promises.writeFile(uri.fsPath, Buffer.from(content))
  return uri;
}
