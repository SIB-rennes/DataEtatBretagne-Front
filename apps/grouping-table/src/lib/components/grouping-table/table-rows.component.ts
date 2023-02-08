import { Component, inject, Input } from '@angular/core';
import { RowData } from './group-utils';
import { GroupingTableContextService } from './grouping-table-context.service';

@Component({
  selector: 'lib-table-rows',
  templateUrl: './table-rows.component.html',
})
export class TableRowsComponent {
  @Input() rows!: RowData[];
  context = inject(GroupingTableContextService);
}
