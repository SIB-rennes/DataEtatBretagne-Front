import { Injectable } from "@angular/core";

/**
 * Utilitaires pour les fonctions d'authentification / authorization
 */
@Injectable({
    providedIn: 'root',
})
export class AuthUtils {

    /** Transforme une liste de rôle en majuscule */
    roles_to_uppercase(roles: any) {
        if (Array.isArray(roles))
        return roles.map(r => r.toUpperCase());

        return roles;
    }
}
