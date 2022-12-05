import { Component, inject, Input } from "@angular/core";
import { Group } from "./group-utils";
import { GroupingTableContextService } from "./grouping-table-context.service";

@Component({
  selector: 'financial-table-group-header',
  templateUrl: './table-group-header.component.html',
  host: {
    class: 'header clickable'
  },
})
export class TableGroupHeaderComponent {
  @Input() group!: Group;
  @Input() groupLevel = 0;
  @Input() folded = false;

  context = inject(GroupingTableContextService);
}
