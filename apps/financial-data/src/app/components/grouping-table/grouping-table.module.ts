import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { GroupingTableComponent } from "./grouping-table.component";
import { GroupingTableHeaderComponent } from "./grouping-table-header.component";
import { TableGroupComponent } from "./table-group.component";
import { TableGroupHeaderComponent } from "./table-group-header.component";
import { TableBodyComponent } from "./table-body.component";
import { TableRowsComponent } from "./table-rows.component";

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
    TableRowsComponent
  ],
  exports: [
    GroupingTableComponent
  ],
})
export class GroupingTableModule {
}
