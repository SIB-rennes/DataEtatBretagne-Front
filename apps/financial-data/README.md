# Description

Front permettant de faire des recherches sur les données Financière de l'état en bretagne.  

Utilise les API de la [plateforme data éta en bretagne](https://github.com/SIB-rennes/DataEtatBretagne-back/blob/main/README.md)

## Utiliser l'application données financières depuis une autre application

Il est possible de diriger un utilisateur vers des données financières filtrèes en utilisant des paramètres d'url, exemple:

[https://budget.databretagne.fr/?programmes=101,102&niveau_geo=Epci&code_geo=200000172](https://budget.databretagne.fr/?programmes=101,102&niveau_geo=Epci&code_geo=200000172)

Voici les paramètres pris en charge:

- Programmes

| Paramètre  | Description                | Exemple                                                                    |
| ---------- | -------------------------- | -------------------------------------------------------------------------- |
| Programmes | Codes programmes à inclure | [`programmes=101,102`](https://budget.databretagne.fr/?programmes=101,102) |
|            |                            |                                                                            |

- Emplacement géographique

| Paramètre           | Description         | Valeurs acceptées                                                       | Exemple                                                                                    |
| ------------------- | ------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Niveau géographique | Niveau géographique | `Département`,`Epci` et `Commune`                                       | [`niveau_geo=Epci`](https://budget.databretagne.fr/?niveau_geo=Epci&code_geo=200000172)    |
| code_geo            | Code géographique   | [COG](https://www.insee.fr/fr/recherche/recherche-geographique?debut=0) | [`code_geo=200000172`](https://budget.databretagne.fr/?niveau_geo=Epci&code_geo=200000172) |

- Années

| Paramètre     | Description | Valeurs acceptées       | Exemple                                                                           |
| ------------- | ----------- | ----------------------- | --------------------------------------------------------------------------------- |
| Année minimum | A partir de | Une année. (ie: `2019`) | [`annee_min=2021`](https://budget.databretagne.fr/?annee_min=2019&annee_max=2020) |
| Année maximum | jusqu'à     | Une année. (ie: `2020`) | [`annee_max=2023`](https://budget.databretagne.fr/?annee_min=2019&annee_max=2020) |

- Group by

| Paramètre   | Description         | Valeurs acceptées                                                                                                                                                 | Exemple                                                                                                                         |
| ----------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Grouper par | Grouper par colonne | `siret`, `montant_ae`, `montant_cp`, `theme`, `nom_programme`, `domaine`, `ref_programmation`, `label_commune`, `siret`, `type_etablissement`, `date_cp`, `annee` | [`group_by=siret,theme`](https://budget.databretagne.fr/?programmes=101,102&annee_min=2019&annee_max=2019&group_by=siret,theme) |

- Plein écran

| Paramètre   | Description                                    | Valeurs acceptées | Exemple                                                                               |
| ----------- | ---------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------- |
| Plein écran | Affiche le tableau de résultats en plein écran | `true` ou `false` | [`plein_ecran=true`](https://budget.databretagne.fr/?programmes=107&plein_ecran=true) |