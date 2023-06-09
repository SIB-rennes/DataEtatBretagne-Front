import { GroupingColumn } from "apps/grouping-table/src/lib/components/grouping-table/group-utils";
import { TOrError } from "./t-or-error.model";

/** Paramètres commun des marque blanches */
export interface MarqueBlancheParsedParams {

    /** Nom des champs de grouping tel que reçu par la route*/
    p_group_by: string[],

    /** Nom des champs de grouping pour le composant tableau*/
    group_by: GroupingColumn[],

    fullscreen: boolean,
    has_marqueblanche_params: boolean,
}

export type MarqueBlancheParsedParamsResolverModel<T extends MarqueBlancheParsedParams> = TOrError<T | null>