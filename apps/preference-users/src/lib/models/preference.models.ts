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

/**
 * Méta-données sous forme de hasMap d'un filtre.
 * La clé name correspond au nom du filtre technique.
 * Contient les informations pour l'affichage du filtre.
 */
export interface MapPreferenceFilterMetadata {
  [name: string]: PreferenceFilterMetadata;
}

/**
 * Méta-données d'un filtre. Contient les informations pour l'affichage du filtre.
 */
export type PreferenceFilterMetadata = {
  /** Libellé du filtre a afficher*/
  label: string;

  /**
   * Fonction de rendu permettant d'adapter la valeur de la cellule avant affichage.
   *
   * @param row ligne de données
   */
  renderFn?: (row: JSONObject) => string | JSONValue;
};
