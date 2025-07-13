type StringTableJsonType = "array" | "object"

class _S4TKSettings {
  showConfigLoadedMessage: boolean;
  newStringsToStartOfStringTable: boolean;
  defaultStringTableJsonType: StringTableJsonType;
  defaultStringTableLocale: StringTableLocaleName;
  spacesPerIndent: number;

  constructor(
    showConfigLoadedMessage = false,
    newStringsToStartOfStringTable = true,
    defaultStringTableJsonType = "array" as StringTableJsonType,
    defaultStringTableLocale = "English" as StringTableLocaleName,
    spacesPerIndent = 2
  ) {
    this.showConfigLoadedMessage = showConfigLoadedMessage
    this.newStringsToStartOfStringTable = newStringsToStartOfStringTable
    this.defaultStringTableJsonType = defaultStringTableJsonType
    this.defaultStringTableLocale = defaultStringTableLocale
    this.spacesPerIndent = spacesPerIndent
  }
}

export var S4TKSettings = new _S4TKSettings()