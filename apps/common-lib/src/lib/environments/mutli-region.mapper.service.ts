import { Injectable } from "@angular/core";
import { HostnameClientIdMappings } from "./settings";

@Injectable({ providedIn: 'root' })
export class MultiRegionClientIdMapper {

    /**
     * Récupère le client ID keycloak à utiliser selon le 
     * hostname courant.
     */
    kc_client_id_from_hostname(setup_mappings: HostnameClientIdMappings) {
        const hostname = window.location.hostname;

        if (hostname in setup_mappings)
            return setup_mappings[hostname]

        return hostname;
    }
}