import type { ResourceKey } from "@s4tk/models/types";
import { StringTableResource } from "@s4tk/models";
import { StringTableLocale, BinaryResourceType } from "@s4tk/models/enums";
import { formatAsHexString, formatStringKey } from "@s4tk/hashing/formatting";
import S4TKAssets from "#assets";
import { randomFnv32, randomFnv64 } from "#helpers/hashing";
import { parseAndValidateJson } from "#helpers/schemas";
import { S4TKSettings } from "#helpers/settings";

/**
 * A string table JSON that follows the `stbl.schema.json` schema.
 */
export default class StringTableJson {
  //#region Properties

  private static _DEFAULT_GROUP_STRING = "0x80000000";
  private static _DEFAULT_GROUP_INT = 0x80000000;

  public get format() { return this._format; }
  public get hasMetaData() { return this._format.endsWith("metadata"); }
  public get isArray() { return this._format.startsWith("array"); }
  public get isObject() { return this._format.startsWith("object"); }

  private _locale?: StringTableLocaleName;
  public get locale() { return this._locale; }

  private _group?: string;
  public get group() { return this._group; }

  private _instanceBase?: string;
  public get instanceBase() { return this._instanceBase; }

  private _fragment?: boolean;
  public get fragment() { return this._fragment; }

  //#endregion

  //#region Lifecycle

  constructor(
    private _format: StringTableJsonFormat,
    private _entries: StringTableJsonEntry[],
    metadata?: {
      locale?: StringTableLocaleName;
      group?: string;
      instanceBase?: string;
      fragment?: boolean;
    }) {
    this._locale = metadata?.locale;
    this._group = metadata?.group;
    this._instanceBase = metadata?.instanceBase;
    this._fragment = metadata?.fragment;
  }

  /**
   * Parses the given JSON content into a StringTableJson object.
   * 
   * @param content JSON content from which to parse a StringTableJson
   * @throws If JSON is malformed or violates schema
   */
  static parse(content: string): StringTableJson {
    const result = parseAndValidateJson<RawStringTableJson>(content, S4TKAssets.schemas.stbl);

    if (result.parsed) {
      if (Array.isArray(result.parsed)) {
        const entriesArr = result.parsed as RawStringTableJsonArray;
        return new StringTableJson("array", entriesArr);
      } else if ((result.parsed as RawStringTableJsonMetaData).entries) {
        const metadata = result.parsed as RawStringTableJsonMetaData;
        if (Array.isArray(metadata.entries)) {
          const entriesArr = metadata.entries as RawStringTableJsonArray;
          return new StringTableJson("array-metadata", entriesArr, {
            locale: metadata.locale,
            group: metadata.group,
            instanceBase: metadata.instanceBase,
            fragment: metadata.fragment,
          });
        } else {
          const entriesObj = metadata.entries as RawStringTableJsonObject;
          const entriesArr: RawStringTableJsonArray = [];
          for (const key in entriesObj) entriesArr.push({ key, value: entriesObj[key] });
          return new StringTableJson("object-metadata", entriesArr, {
            locale: metadata.locale,
            group: metadata.group,
            instanceBase: metadata.instanceBase,
            fragment: metadata.fragment,
          });
        }
      } else {
        const entriesObj = result.parsed as RawStringTableJsonObject;
        const entriesArr: RawStringTableJsonArray = [];
        for (const key in entriesObj) entriesArr.push({ key, value: entriesObj[key] });
        return new StringTableJson("object", entriesArr);
      }
    } else {
      throw new Error(result.error);
    }
  }

  //#endregion

  //#region Public Methods

  /**
   * Returns a resource key to use for a binary STBL created from this JSON. If
   * any metadata is missing, it will be filled in with default values (or a
   * random FNV56 in the case of the instance base).
   */
  getResourceKey(): ResourceKey {
    return {
      type: BinaryResourceType.StringTable,
      group: this._group
        ? parseInt(this._group, 16)
        : StringTableJson._DEFAULT_GROUP_INT,
      instance: StringTableLocale.setHighByte(
        StringTableLocale[this._locale ?? S4TKSettings.defaultStringTableLocale],
        this._instanceBase
          ? BigInt(this._instanceBase)
          : randomFnv64()
      )
    }
  }

  /**
   * Writes this STBL JSON to a string.
   */
  stringify(): string {

    let entries: RawStringTableJsonEntries = this._entries;
    if (this.isObject) {
      entries = {};
      this._entries.forEach(({ key, value }) =>
        (entries as RawStringTableJsonObject)[key] = value
      );
    }

    if (this.hasMetaData) {
      return JSON.stringify({
        locale: this._locale,
        group: this._group,
        instanceBase: this._instanceBase,
        fragment: this._fragment,
        entries: entries,
      }, null, S4TKSettings.spacesPerIndent);
    } else {
      return JSON.stringify(entries, null, S4TKSettings.spacesPerIndent);
    }
  }


  /**
   * Creates a binary StringTableResource from this StringTableJson.
   */
  toBinaryResource(): StringTableResource {
    return new StringTableResource(this._entries.map(({ key, value }) => ({
      key: parseInt(key, 16),
      value: value
    })));
  }

  //#endregion
}

//#region Types

type StringTableJsonFormat = "array" | "object" | "array-metadata" | "object-metadata";

interface StringTableJsonEntry { key: string; value: string; }

type RawStringTableJsonArray = StringTableJsonEntry[];
type RawStringTableJsonObject = { [key: string]: string; };
type RawStringTableJsonEntries = RawStringTableJsonArray | RawStringTableJsonObject;

interface RawStringTableJsonMetaData {
  locale?: StringTableLocaleName;
  group?: string;
  instanceBase?: string;
  fragment?: boolean;
  entries: RawStringTableJsonEntries;
}

type RawStringTableJson = RawStringTableJsonEntries | RawStringTableJsonMetaData;

//#endregion
