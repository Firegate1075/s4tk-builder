
/**
 * Returns a posix-style fs path for use with globbing.
 * 
 * @param baseUri Base folder for globbing to take place
 * @param pattern Pattern to capture files with
 */
export function resolveGlobPattern(baseUri: string, pattern: string): string {
  return `${baseUri}/${pattern}`.replace(/\\/g, "/");
}
