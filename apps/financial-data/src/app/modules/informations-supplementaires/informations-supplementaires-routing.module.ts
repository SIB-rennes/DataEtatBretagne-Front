import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { resolveInformationsSupplementaires } from "../../resolvers/informations-supplementaires-resolver";
import { InformationsSupplementairesComponent } from "./informations-supplementaires.component";
import { _path_full } from "./routes";

const routes: Routes = [
    {
        path: '',
        component: InformationsSupplementairesComponent,
        runGuardsAndResolvers: 'always',
        resolve: {
            financial_data: resolveInformationsSupplementaires
        }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InformationsSupplementairesRoutingModule {}
