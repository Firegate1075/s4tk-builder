import * as fs from "fs";
import * as path from "path";
import * as vscode_uri from "vscode-uri" 
import {  resolveGlobPattern } from "#helpers/fs";
import { S4TKSettings } from "#helpers/settings";
//import ResourceIndex from "#indexing/resource-index";
import { S4TKConfig } from "#workspace/s4tk-config";

/**
 * A model for a single workspace folder that contains an S4TK project.
 */
export default class S4TKWorkspace {
  private static readonly _blankConfig: S4TKConfig = S4TKConfig.blankProxy();
  private _activeConfig?: S4TKConfig;
  

  get config(): S4TKConfig { return this._activeConfig ?? S4TKWorkspace._blankConfig; }
  get active(): boolean { return Boolean(this._activeConfig); }

  constructor(
    public readonly rootUri: vscode_uri.URI,
  ) {
    this.loadConfig({ showNoConfigError: false });
  }

  //#region Public Methods

  /**
   * Loads the config into the workspace if it exists and is valid. If it does
   * not exist or is not valid, then the config becomes unloaded.
   * 
   * @param showNoConfigError Whether or not to display an error to the user
   * if there is no config to load
   */
  async loadConfig({ showNoConfigError = false }: { showNoConfigError?: boolean; } = {}) {
    const configInfo = S4TKConfig.find(this.rootUri);
    if (!configInfo.exists) {
      if (showNoConfigError) vscode.window.showWarningMessage(
        "No S4TK config file was found at the root of this workspace.",
        MessageButton.CreateProject,
      ).then(handleMessageButtonClick);
      this._setConfig(undefined);
      return;
    }

    try {
      const content = await fs.promises.readFile(configInfo.uri.fsPath);
      const config = S4TKConfig.parse(content.toString());
      if (S4TKSettings.get("showConfigLoadedMessage"))
        vscode.window.showInformationMessage("Successfully loaded S4TK config.");
      this._setConfig(config);
    } catch (e) {
      vscode.window.showErrorMessage(
        `Could not validate S4TK config. You will not be able to build your project until all errors are resolved and the config has been reloaded. [${e}]`,
        MessageButton.GetHelp,
        MessageButton.ReportProblem,
      ).then(handleMessageButtonClick);
      this._setConfig(undefined);
    }
  }

  /**
   * Resolves a path that is either absolute or relative to the root URI of this
   * workspace. 
   * 
   * @param relativePath Relative path to resolve
   * @param isGlob Whether or not this is for a glob pattern
   */
  resolvePath(relativePath: string, isGlob: boolean = false): string {
    // FIXME: unsure if this is correct
    if (isGlob) {
      return resolveGlobPattern(this.rootUri, relativePath);
    } else {
      return path.isAbsolute(relativePath)
        ? path.normalize(relativePath)
        : path.resolve(this.rootUri.fsPath, relativePath);
    }
  }



  //#endregion

  //#region Private Methods


  private _setConfig(config: S4TKConfig | undefined) {
    this._activeConfig = config;
  }

  //#endregion
}