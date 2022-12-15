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
    class: 'grouping-table-container'
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
  private scrollLeft?: number;

  ngOnChanges(changes: SimpleChanges) {
    if (
      'tableData' in changes
      || 'columnsMetaData' in changes
      || 'groupingColumns' in changes
    ) {
      // Si les paramètres en entrée changent, on les propage.
      // (on passe également ici au chargement du composant).
      this.context.initContext(this.tableData, this.columnsMetaData, this.groupingColumns);
      this.rootGroup = this.context.rootGroup;
      this.groupLevel = this.groupingColumns.length;
    }
  }

  @HostListener('scroll', ['$event.target']) onScroll(target: HTMLElement) {
    const scrollLeft = target.scrollLeft;
    // On évite de mettre à jour la propriété CSS si la position de défilement horizontal n'a pas changé.
    // Pour ce faire on garde la position sur un attribut de la classe.
    if (this.scrollLeft !== scrollLeft) {
      this.scrollLeft = scrollLeft;
      target.style.setProperty("--scroll-length", `${scrollLeft}px`);
    }
  }
}
