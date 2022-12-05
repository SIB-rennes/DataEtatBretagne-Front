import { Component, inject, Input } from "@angular/core";
import { Group } from "./group-utils";
import { GroupingTableContextService } from "./grouping-table-context.service";

@Component({
  selector: 'financial-table-rows',
  templateUrl: './table-rows.component.html',
})
export class TableRowsComponent {
  @Input() group!: Group;
  context = inject(GroupingTableContextService);
}
