import { AggregatorFns, ColumnMetaDataDef } from "apps/grouping-table/src/lib/components/grouping-table/group-utils";

const moneyFormat = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
});

export const colonnes: ColumnMetaDataDef[] = [
    {
        name: 'siret',
        label: 'Bénéficiaire',
        renderFn: (row, col) =>
            row[col.name] ? row[col.name]['nom_beneficiare'] : ''
    },
    {
        name: 'montant_ae',
        label: 'Montant engagé',
        renderFn: (row, col) =>
            row[col.name] ? moneyFormat.format(row[col.name]) : row[col.name],
        aggregateReducer: AggregatorFns.sum,
        aggregateRenderFn: (aggregateValue) =>
            aggregateValue ? moneyFormat.format(aggregateValue) : aggregateValue,
        columnStyle: {
            'text-align': 'right',
            'min-width': '16ex',
            'flex-grow': '0',
        },
    },
    {
        name: 'montant_cp',
        label: 'Montant payé',
        renderFn: (row, col) =>
            row[col.name] > 0 ? moneyFormat.format(row[col.name]) : "",
        aggregateReducer: AggregatorFns.sum,
        aggregateRenderFn: (aggregateValue) =>
            aggregateValue ? moneyFormat.format(aggregateValue) : aggregateValue,
        columnStyle: {
            'text-align': 'right',
            'min-width': '16ex',
            'flex-grow': '0',
        },
    },
    {
        name: 'theme',
        label: 'Thème',
        renderFn: (row, _col) => row['programme']['theme'] ?? '',
    },
    {
        name: 'nom_programme',
        label: 'Programme',
        renderFn: (row, _col) => row['programme']['code'] + ' - ' + row['programme']['label'] ?? '',
    },
    {
        name: 'domaine',
        label: 'Domaine fonctionnel',
        renderFn: (row, _col) => row['domaine_fonctionnel'] ?
            row['domaine_fonctionnel']['code'] + ' - ' + row['domaine_fonctionnel']['label'] : '',
    },
    {
        name: 'ref_programmation',
        label: 'Ref Programmation',
        renderFn: (row, _col) =>
            row['referentiel_programmation']['code'] + ' - ' + (row['referentiel_programmation']['label'] ?? ''),
    },
    {
        name: 'label_commune',
        label: 'Commune',
        renderFn: (row, _col) => row['commune']['label'],
    },
    {
        name: 'siret',
        label: 'Siret',
        renderFn: (row, col) => row[col.name] ? row[col.name]['code'] : '',
        columnStyle: {
            'min-width': '16ex',
            'flex-grow': '0',
        },
    },
    {
        name: 'type_etablissement',
        label: `Type d'établissement`,
        renderFn: (row, _col) =>
            row['siret']['categorie_juridique'] !== null ? row['siret']['categorie_juridique'] : 'Non renseigné',
    },
    {
        name: 'date_cp',
        label: 'Date dernier paiement',
        renderFn: (row, col) =>
            row[col.name] ? new Date(row[col.name]).toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric' }) : '',
    },
    {
        name: 'annee',
        label: 'Année d\'engagement',
        columnStyle: {
            'min-width': '18ex',
            'flex-grow': '0',
        },
    },
]