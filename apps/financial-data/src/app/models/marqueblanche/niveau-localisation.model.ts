import { TypeLocalisation } from "apps/common-lib/src/public-api"

const synonymes: { [key in TypeLocalisation]: string[] } = {
    [TypeLocalisation.DEPARTEMENT]: ['departement'],
    [TypeLocalisation.ARRONDISSEMENT]: ['arrondissement'],
    [TypeLocalisation.COMMUNE]: ['commune'],
    [TypeLocalisation.CRTE]: ['crte'],
    [TypeLocalisation.EPCI]: ['epci'],
};

export function synonymes_from_types_localisation(types: TypeLocalisation[]): string[] {
    return types.flatMap(type => synonymes[type]);
}

export function to_type_localisation(name: string): TypeLocalisation {
    for (const key in synonymes) {
        const k = key as TypeLocalisation;
        const elements = synonymes[k];
        if (elements.includes(name)) {
            return k;
        }
    }

    throw new Error(`Impossible de convertir ${name} en niveau de localisation.`);
}
