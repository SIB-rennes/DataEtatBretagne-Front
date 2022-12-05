import { Component, inject } from "@angular/core";
import { GroupingTableContextService } from "./grouping-table-context.service";

@Component({
  selector: 'financial-grouping-table-header',
  templateUrl: './grouping-table-header.component.html',
  host: {
    class: 'header group'
  },
})
export class GroupingTableHeaderComponent {
  context = inject(GroupingTableContextService);
}
