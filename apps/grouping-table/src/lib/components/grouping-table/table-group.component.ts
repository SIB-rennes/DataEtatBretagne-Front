import { Component, HostBinding, inject, Input, OnInit } from '@angular/core';
import { Group } from './group-utils';
import { GroupingTableContextService } from './grouping-table-context.service';

@Component({
  selector: 'lib-table-group',
  templateUrl: './table-group.component.html',
})
export class TableGroupComponent implements OnInit {
  @Input() group!: Group;
  @Input() groupLevel = 0;

  context = inject(GroupingTableContextService);
  folded = false;

  @HostBinding('class') get cssClasses() {
    const containsGroup = this.group?.groups?.length ?? 0 > 0;
    return `table level-${this.groupLevel} ${
      containsGroup ? 'has-group' : ''
    } ${this.folded ? 'folded' : ''}`;
  }

  ngOnInit() {
    this.folded = this.context.isFolded(this.group);
  }
}
