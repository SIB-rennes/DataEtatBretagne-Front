export interface Preference {
  uuid?: string;
  name?: string;
  filters: JSONObject;
}

export type JSONValue = string | number | boolean | JSONObject | JSONArray;

export interface JSONObject {
  [k: string]: JSONValue;
}

export interface JSONArray extends Array<JSONValue> {}
