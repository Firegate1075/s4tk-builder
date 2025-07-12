import * as vscode_uri from "vscode-uri" 

/**
 * Returns a posix-style fs path for use with globbing.
 * 
 * @param baseUri Base folder for globbing to take place
 * @param pattern Pattern to capture files with
 */
export function resolveGlobPattern(baseUri: vscode_uri.URI | string, pattern: string): string {
  const baseFsPath = typeof baseUri === "string" ? baseUri : baseUri.fsPath;
  return `${baseFsPath}/${pattern}`.replace(/\\/g, "/");
}