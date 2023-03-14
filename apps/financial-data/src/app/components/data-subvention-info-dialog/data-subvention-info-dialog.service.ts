import { inject } from "@angular/core";
import { DataSubventionsService, RepresentantLegal, RepresentantsLegaux, Subvention } from "apps/clients/ds-client";
import { Observable, of, zip  } from "rxjs";
import { catchError, map } from "rxjs/operators";

const PRESIDENT_ROLE = 'Président';

export interface DataSubventionInfoDialogInternalData {
    subvention: Subvention | null
    president: RepresentantLegal | null
}

export class DataSubventionInfoDialogService {

    private ds: DataSubventionsService = inject(DataSubventionsService);

    load_informations(siret: string, ej: string): Observable<DataSubventionInfoDialogInternalData> {

        let subvention$ = this.ds.getSubventionsCtrl(siret, ej)
        .pipe(catchError(this._handle404))

        let president$ = this.ds.getRepresentantLegauxCtrl(siret)
        .pipe(
            map(representants => this._find_president(representants)),
            catchError(this._handle404),
        )

        let result = zip(subvention$, president$)
        .pipe(
            map(([sub, pres]) => {
                return {
                    subvention: sub,
                    president: pres,
                }
            })
        );

        return result;
    }

    _find_president(representants: RepresentantsLegaux | null) {
        if (representants == null)
            return null;

        let president = representants.representants_legaux?.find(
            representant => representant.role == PRESIDENT_ROLE
        );

        if (!president)
            return null;

        return president;
    }

    _handle404(err: any) {
        if (err?.status && err?.status == 404)
            return of(null)
        else
            throw err
    }

}