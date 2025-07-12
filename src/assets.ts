import * as vscode from "vscode";
import * as vscode_uri from "vscode-uri" 
import * as path from "path"
//const appDir = path.dirname(require.main.filename);

/**
 * References to asset files that are used throughout the extension.
 */
namespace S4TKAssets {
  let _extensionContext: vscode.ExtensionContext;

  /**
   * URIs to JSON files within the ~/data/ folder.
   */
  export const data = _uriResolver("data", {
    tdescEndpoints: ["tdesc-endpoints.json"],
  });

  /**
   * URIs to styles and scripts within the ~/media/ folder.
   */
  export const media = {
    styles: _uriResolver("media", {
      reset: ["reset.css"],
      vscode: ["vscode.css"],
      package: ["editors", "package.css"],
      stblBinary: ["editors", "stbl-binary.css"],
    }),
    scripts: _uriResolver("media", {
      package: ["editors", "package.js"],
      stblBinary: ["editors", "stbl-binary.js"],
    }),
  };

  /**
   * URIs to JSON schemas within the ~/schemas/ folder.
   */
  export const schemas = _uriResolver("schemas", {
    config: ["s4tk-config.schema.json"],
    stbl: ["stbl.schema.json"],
  });

  /**
   * URIs to files within the ~/samples/ folder.
   */
  export const samples = _uriResolver("samples", {
    config: ["s4tk.config.json"],
    gitignore: ["gitignore.txt"],
    package: ["sample.package"],
    readme: ["HowToUseS4TK.md"],
    simdata: ["buff_Example.SimData.xml"],
    stbl: ["sample.stbl"],
    stblJsonStrings: ["default-stbl-strings.json"],
    tuning: ["buff_Example.xml"],
  });

  // TODO: needs to be called or otherwise get project root directory
  export function setExtensionContext(context: vscode.ExtensionContext) {
    _extensionContext = context;
  }

  function _uriResolver<T>(root: string, obj: T): {
    [key in keyof T]: vscode_uri.URI;
  } {
    return new Proxy(obj as object, {
      get(target: any, prop: string) {
        const baseUri = _extensionContext.extension.extensionUri;
        // TODO: get project root directory
        return vscode_uri.Utils.joinPath(baseUri, root, ...(target[prop]));
      }
    });
  }
}

export default S4TKAssets;
