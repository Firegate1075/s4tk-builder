
class _S4TKSettings {
  showConfigLoadedMessage: boolean;
  defaultStringTableLocale: StringTableLocaleName;
  spacesPerIndent: number;

  constructor(
    showConfigLoadedMessage = false,
    defaultStringTableLocale = "English" as StringTableLocaleName,
    spacesPerIndent = 2
  ) {
    this.showConfigLoadedMessage = showConfigLoadedMessage
    this.defaultStringTableLocale = defaultStringTableLocale
    this.spacesPerIndent = spacesPerIndent
  }
}

export var S4TKSettings = new _S4TKSettings()