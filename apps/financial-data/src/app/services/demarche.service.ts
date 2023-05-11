import { Injectable } from '@angular/core';

import { Observable, map } from 'rxjs';

import { Apollo, gql } from 'apollo-angular';
import { Demarche } from '@models/demarche_simplifie/demarche-graphql';
import { ApolloQueryResult } from '@apollo/client';

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

  public getDemarcheWithDossier(
    id: number,
    after?: string
  ): Observable<Demarche | null> {
    //DETR filtre ref programmation

    const demarche = gql`
      query getDemarche(
        $demarcheNumber: Int!
        $state: DossierState
        $after: String
      ) {
        demarche(number: $demarcheNumber) {
          title
          dossiers(state: $state, first: 100, after: $after) {
            pageInfo {
              endCursor
              hasNextPage
            }
            nodes {
              number
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
