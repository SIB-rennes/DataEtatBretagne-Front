import { ColumnMetaDataDef } from "apps/grouping-table/src/lib/components/grouping-table/group-utils";
import { GroupByFieldname } from "./groupby-fieldname.enum";

export type GroupByMapping = { [key in GroupByFieldname]: string }

/** 
 * Mapping liant les nom de champ de grouping de la marque blanche 
 * vers les noms de colonne du tableau
 * Voir {@link ColumnMetaDataDef}'s name
 */
export const groupby_mapping: GroupByMapping = {
    [GroupByFieldname.Beneficiaire]: 'siret',
    [GroupByFieldname.Theme]: 'theme',
    [GroupByFieldname.Programme]: 'nom_programme',
    [GroupByFieldname.DomaineFonctionnel]: 'domaine',
    [GroupByFieldname.ReferentielProgrammation]: 'ref_programmation',
    [GroupByFieldname.Commune]: 'label_commune',
    [GroupByFieldname.TypeEtablissement]: 'type_etablissement',
    [GroupByFieldname.Annee_engagement]: 'annee',
}