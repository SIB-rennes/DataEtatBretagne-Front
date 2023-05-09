import { Injectable, Inject } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class DemarcheHttpService {
  constructor(private apollo: Apollo) {}

  public getDemarche(id: number): Observable<any> {
    //DETR filtre ref programmation

    const demarche = gql`
      query getDemarche(
        $demarcheNumber: Int!
        $state: DossierState
        $after: String
      ) {
        demarche(number: $demarcheNumber) {
          id
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

    const r = this.apollo.watchQuery({
      query: demarche,
      variables: {
        demarcheNumber: id,
        state: 'accepte',
      },
    }).valueChanges;

    return r;
  }

  public get client() {
    return this.apollo.client;
  }
}
