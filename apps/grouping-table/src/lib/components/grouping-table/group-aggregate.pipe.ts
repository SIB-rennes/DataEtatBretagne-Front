import { Pipe, PipeTransform } from "@angular/core";
import { ColumnMetaDataDef, Group } from "./group-utils";

/**
 * Affichage des valeurs d'aggrégats (pour les headers de groupes).
 *
 * Utilisation: `{{group | financialGroupAggregate: column}}`
 */
@Pipe({
  name: 'financialGroupAggregate',
  pure: true
})
export class FinancialGroupAggregatePipe implements PipeTransform {
  transform(group: Group, column: ColumnMetaDataDef | undefined): string {
    if (!column) {
      return '';
    }
    const aggregateValue = group.aggregates?.[column.name];
    return column.aggregateRenderFn
      && column.aggregateRenderFn(aggregateValue, group, column)
      || aggregateValue || '';
  }

}
