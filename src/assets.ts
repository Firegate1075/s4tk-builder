import * as vscode_uri from "vscode-uri" 
import * as path from "path"
import * as url from "url"
//const appDir = path.dirname(require.main.filename);

/**
 * References to asset files that are used throughout the extension.
 */
namespace S4TKAssets {
  /**
   * URIs to JSON schemas within the ~/schemas/ folder.
   */
  export const schemas = _uriResolver("schemas", {
    config: ["s4tk-config.schema.json"],
    stbl: ["stbl.schema.json"],
  });

  function _uriResolver<T>(root: string, obj: T): {
    [key in keyof T]: vscode_uri.URI;
  } {
    return new Proxy(obj as object, {
      get(target: any, prop: string) {
        const module_root_dir = path.dirname(__dirname)
        return vscode_uri.Utils.joinPath(vscode_uri.URI.file(module_root_dir), root, ...(target[prop]));
      }
    });
  }
}

export default S4TKAssets;
