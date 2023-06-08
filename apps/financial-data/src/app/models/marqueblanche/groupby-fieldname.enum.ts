export enum GroupByFieldname {
    Beneficiaire = "beneficiaire",
    Theme = "theme",
    Programme = "programme",
    DomaineFonctionnel = "domaine_fonctionnel",
    ReferentielProgrammation = "referentiel_programmation",
    Commune = "commune",
    TypeEtablissement = "type_etablissement",
    Annee_engagement = "annee_engagement",
}

export function assert_is_a_GroupByFieldname(v: any): asserts v is GroupByFieldname {
    const values = Object.values(GroupByFieldname);
    const isIn = values.includes(v);
    if (!isIn)
      throw new Error(`${v} n'est pas un membre de ${values.join(', ')}`);
}