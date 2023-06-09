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
import { Qualification } from './qualification';


export interface CertificationRge { 
    date_attribution: string;
    date_expiration: string;
    domaine: string;
    meta_domaine: string;
    nom_certificat: string;
    organisme: string;
    qualification: Qualification;
    url: string;
}

