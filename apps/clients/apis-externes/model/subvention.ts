/**
 * API
 * API proxy de data subventions
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ActionProposee } from './actionProposee';


export interface Subvention { 
    actions_proposees: Array<ActionProposee>;
    dispositif: string;
    ej: string;
    montant_accorde: number;
    montant_demande: number;
    service_instructeur: string;
    sous_dispositif: string;
}

