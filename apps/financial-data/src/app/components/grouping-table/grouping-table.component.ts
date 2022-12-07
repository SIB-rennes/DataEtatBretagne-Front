import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation
} from "@angular/core";
import { ColumnsMetaData, GroupingColumn, RootGroup, TableData } from "./group-utils";
import { GroupingTableContextService } from "./grouping-table-context.service";

@Component({
  selector: 'financial-grouping-table',
  templateUrl: './grouping-table.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [GroupingTableContextService],
  host: {
    class: 'container'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupingTableComponent implements OnChanges {
  @Input() tableData!: TableData;
  @Input() columnsMetaData!: ColumnsMetaData;
  @Input() groupingColumns: GroupingColumn[] = [];

  rootGroup?: RootGroup;
  context = inject(GroupingTableContextService);
  groupLevel = 0;
  private element = inject(ElementRef);

  ngOnChanges(changes: SimpleChanges) {
    if (
      'tableData' in changes
      || 'columnsMetaData' in changes
      || 'groupingColumns' in changes
    ) {
      // Si les paramètres en entrée changent, on les propage.
      // (on passe également ici au chargement du composant).
      this.context.setContext(this.tableData, this.columnsMetaData, this.groupingColumns);
      this.rootGroup = this.context.rootGroup;
      this.groupLevel = this.groupingColumns.length;
    }
  }

  @HostListener('scroll') onScroll() {
    const nativeElement = this.element.nativeElement;
    nativeElement.style.setProperty("--scroll-length", `${nativeElement.scrollLeft}px`);
  }
}
