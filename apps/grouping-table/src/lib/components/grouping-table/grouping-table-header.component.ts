import { Component, inject } from '@angular/core';
import { GroupingTableContextService } from './grouping-table-context.service';

@Component({
  selector: 'lib-grouping-table-header',
  templateUrl: './grouping-table-header.component.html',
  host: {
    class: 'header',
  },
})
export class GroupingTableHeaderComponent {
  context = inject(GroupingTableContextService);
}
