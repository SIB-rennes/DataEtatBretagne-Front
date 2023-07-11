import { SourceFinancialData } from "@models/financial/common.models";
import { FinancialDataModel } from "@models/financial/financial-data.models";
import { DemarcheHttpService } from "@services/http/demarche.service";
import { ModelError } from "apps/clients/apis-externes";
import { Observable, of, throwError } from "rxjs";
import { catchError, map } from 'rxjs/operators';

export class DemarchesSimplifieesViewService {

    constructor(
        private demarcheService: DemarcheHttpService,
        private financial: FinancialDataModel,
    ) { }


    api_demarche_light$(): Observable<{
        has_more_info: boolean;
        title?: string;
    }> {
        console.log(this.financial);
        const code_depart = this.financial.commune.code.substring(0, 2);
        const annee = this.financial.annee;
        const code_ref = this.financial.referentiel_programmation.code;

        // FIXME - POC API DEMARCHE_SIMPLIFIE
        // DEMARCHE 49721 pour le 29, Annee 2022 sur programmation DTER
        if (code_depart === '29' && annee === 2022 && code_ref === '0119010101A6') {
            return this.demarcheService.getDemarcheLight(49721).pipe(
                map((demarche) => {
                    return { has_more_info: true, title: demarche?.title };
                })
            );
        }
        return of({ has_more_info: false });
    }

    api_demarche_error: ModelError | null = null;
    api_find_dossier_demarche_simplifie$() {
        if (this.financial.source !== SourceFinancialData.CHORUS) {
            const err = {
                code: 'NOT_FOUND',
                message: "Aucun dossier correspondant n'a été trouvé dans la démarche",
            } as ModelError;
            this.api_demarche_error = err;
            throwError(() => err);
        }

        const montant = this.financial.montant_ae;
        const siret = this.financial.siret.code;

        // FIXME - POC API DEMARCHE_SIMPLIFIE
        // DEMARCHE 49721 pour le 29, Annee 2022 sur programmation DTER
        return this.demarcheService
            .foundDossierWithDemarche(49721, siret, montant)
            .pipe(
                map((dossier) => {
                    if (dossier === null) {
                        const err = {
                            code: 'NOT_FOUND',
                            message: "Aucun dossier correspondant n'a été trouvé dans la démarche",
                        } as ModelError;
                        this.api_demarche_error = err;
                        throw err;
                    }
                    return dossier;
                }),
                catchError((_) => {
                    const view_error = {
                        code: 'NOT_FOUND',
                        message: "Aucun dossier correspondant n'a été trouvé dans la démarche",
                    } as ModelError;
                    this.api_demarche_error = view_error;
                    throw view_error;
                })
            );
    }
}