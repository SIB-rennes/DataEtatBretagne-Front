import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { GroupingTableComponent } from "./grouping-table.component";
import { GroupingTableHeaderComponent } from "./grouping-table-header.component";
import { TableGroupComponent } from "./table-group.component";
import { TableGroupHeaderComponent } from "./table-group-header.component";
import { TableBodyComponent } from "./table-body.component";
import { TableRowsComponent } from "./table-rows.component";
import { FinancialGroupAggregatePipe } from "./group-aggregate.pipe";

/**
 * ### Hiérarchie des composants pour le tableau avec groupes
 *
 * ```
 * - grouping-table          // Composant englobant le tableau
 *   - grouping-table-header // En-tête global des colonnes
 *   - table-body            // Contenu du tableau, qui contient les sous-groupes
 *
 * table-body peut contenir soit une liste de table-group, soit un table-rows
 *
 * - table-body       // Contenu d'un tableau
 *   - table-group    // Sous-groupe
 *   - table-group...
 *
 * ou
 *
 * - table-body
 *   - table-rows // Affichage des lignes de données
 *
 * Un table-group contient un table-group-header et un table-body
 *
 * - table-group          // Sous-groupe
 *   - table-group-header // Header de sous-groupe (peut-être plié ou déplié).
 *                        // Il affiche des valeurs calculées pour les lignes contenues (par ex. des sommes)
 *   - table-body         // Contenu du sous-groupe
 * ```
 */
@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    GroupingTableComponent,
    GroupingTableHeaderComponent,
    TableBodyComponent,
    TableGroupComponent,
    TableGroupHeaderComponent,
    TableRowsComponent,
    FinancialGroupAggregatePipe
  ],
  exports: [
    GroupingTableComponent
  ],
})
export class GroupingTableModule {
}
