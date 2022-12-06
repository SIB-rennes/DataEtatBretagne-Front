import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { GroupingTableComponent } from "./grouping-table.component";
import { GroupingTableHeaderComponent } from "./grouping-table-header.component";
import { TableGroupComponent } from "./table-group.component";
import { TableGroupHeaderComponent } from "./table-group-header.component";
import { TableBodyComponent } from "./table-body.component";
import { TableRowsComponent } from "./table-rows.component";
import { FinancialGroupAggregatePipe } from "./group-aggregate.pipe";

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
