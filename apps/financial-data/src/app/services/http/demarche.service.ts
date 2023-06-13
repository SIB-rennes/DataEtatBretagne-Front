import { Injectable } from '@angular/core';

import { Observable, concatMap, map, of } from 'rxjs';

import { Apollo, gql } from 'apollo-angular';
import {
  Demarche,
  Dossier,
  PersonneMorale,
} from '@models/demarche_simplifie/demarche-graphql';
import { ApolloQueryResult } from '@apollo/client';
import { renderToStringWithData } from '@apollo/client/react/ssr';

@Injectable({
  providedIn: 'root',
})
export class DemarcheHttpService {
  constructor(private apollo: Apollo) {}

  public getDemarcheLight(id: number): Observable<Demarche | null> {
    const demarche = gql`
      query getDemarche($demarcheNumber: Int!) {
        demarche(number: $demarcheNumber) {
          title
          id
        }
      }
    `;

    return this.apollo
      .watchQuery<{ demarche: Demarche }>({
        query: demarche,
        variables: {
          demarcheNumber: id,
        },
      })
      .valueChanges.pipe(
        map((appoloResult: ApolloQueryResult<{ demarche: Demarche }>) => {
          const d = appoloResult.data;
          if (d.demarche && d.demarche !== null) return d.demarche;
          return null;
        })
      );
  }

  /**
   * Avec un numéro de démarche, recherche le dossier
   * @param id id de la démarche
   * @param siret: code siret de la structure
   * @param montantAe: montant engagé
   * @returns
   */
  public foundDossierWithDemarche(
    id: number,
    siret: string,
    montantAe: number
  ): Observable<Dossier | null> {

    const getDossiers = (
      after: string | undefined = undefined
    ): Observable<Dossier | null> => {
      return this._getDemarche(id, after).pipe(
        concatMap((demarcheWidthDossier) => {
          if (demarcheWidthDossier !== null) {
            const pageInfo = demarcheWidthDossier.dossiers.pageInfo;
            const dossiers = demarcheWidthDossier.dossiers
              .nodes as Array<Dossier>;

            // POC pour DEBUG/analyse en preprod/prod
            const dossierSiretFilter = dossiers.filter((dossier) => {
              const siret_dossier = (dossier.demandeur as PersonneMorale)?.siret;
              if (siret === siret_dossier) {
                return true;
              }
              return false;
            });
            // On refiltre sur le siret
            const dossierSiret = dossierSiretFilter.find(
              (dossier) => {
                const montant_dossier = dossier.annotations.find(champ=> champ.label === 'Montant de la subvention accordée' )?.stringValue;
                return (
                  montant_dossier === undefined ||
                  (montant_dossier as String) === montantAe.toString()
                );
              }
            );

            if (dossierSiret) {
              return of(dossierSiret);
            }

            if (pageInfo.hasNextPage === true && pageInfo.endCursor) {
              return getDossiers(pageInfo.endCursor);
            }
          }
          return of(null);
        })
      );
    };

    return getDossiers();
  }

  private _getDemarche(
    id: number,
    after?: string
  ): Observable<Demarche | null> {
    const demarche = gql`
      query getDemarche(
        $demarcheNumber: Int!
        $state: DossierState
        $after: String
      ) {
        demarche(number: $demarcheNumber) {
          title
          id
          dossiers(state: $state, first: 100, after: $after) {
            pageInfo {
              endCursor
              hasNextPage
            }
            nodes {
              number
              id
              state
              champs {
                label
                stringValue
              }
              annotations {
                label
                stringValue
              }
              demandeur {
                ... on PersonneMorale {
                  siret
                }
              }
            }
          }
        }
      }
    `;

    const r = this.apollo
      .watchQuery<{ demarche: Demarche }>({
        query: demarche,
        variables: {
          demarcheNumber: id,
          state: 'accepte',
          after: after ?? '',
        },
      })
      .valueChanges.pipe(
        map((appoloResult: ApolloQueryResult<{ demarche: Demarche }>) => {
          const d = appoloResult.data;
          if (d.demarche && d.demarche !== null) return d.demarche;
          return null;
        })
      );
    return r;
  }
}
