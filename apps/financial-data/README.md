# Description

Front permettant de faire des recherches sur les données Financière de l'état en bretagne.  

Utilise les API de la [plateforme data éta en bretagne](https://github.com/SIB-rennes/DataEtatBretagne-back/blob/main/README.md)

## Utiliser l'application données financières depuis une autre application

Il est possible de diriger un utilisateur vers des données financières filtrèes en utilisant des paramètres d'url, exemple:

[https://budget.databretagne.fr/?programmes=101,102&niveau_geo=epci&code_geo=200000172](https://budget.databretagne.fr/?programmes=101,102&niveau_geo=epci&code_geo=200000172)

Voici les paramètres pris en charge:

- Programmes

| Paramètre  | Description                | Exemple                                                                    |
| ---------- | -------------------------- | -------------------------------------------------------------------------- |
| Programmes | Codes programmes à inclure | [`programmes=101,102`](https://budget.databretagne.fr/?programmes=101,102) |
|            |                            |                                                                            |

- Emplacement géographique

| Paramètre           | Description         | Valeurs acceptées                                                       | Exemple                                                                                    |
| ------------------- | ------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Niveau géographique | Niveau géographique | `departement`,`epci` et `commune`                                       | [`niveau_geo=epci`](https://budget.databretagne.fr/?niveau_geo=epci&code_geo=200000172)    |
| code_geo            | Code géographique   | [COG](https://www.insee.fr/fr/recherche/recherche-geographique?debut=0) | [`code_geo=200000172`](https://budget.databretagne.fr/?niveau_geo=epci&code_geo=200000172) |

- Années

| Paramètre     | Description | Valeurs acceptées       | Exemple                                                                           |
| ------------- | ----------- | ----------------------- | --------------------------------------------------------------------------------- |
| Année minimum | A partir de | Une année. (ie: `2019`) | [`annee_min=2021`](https://budget.databretagne.fr/?annee_min=2019&annee_max=2020) |
| Année maximum | jusqu'à     | Une année. (ie: `2020`) | [`annee_max=2023`](https://budget.databretagne.fr/?annee_min=2019&annee_max=2020) |

- Grouper par

| Paramètre   | Description         | Valeurs acceptées                                                                                                                             | Exemple                                                                                                                                             |
| ----------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Grouper par | Grouper par colonne | `beneficiaire`, `theme`, `programme`, `domaine_fonctionnel`, `referentiel_programmation`, `commune`, `type_etablissement`, `annee_engagement` | [`grouper_par=beneficiaire,theme`](https://budget.databretagne.fr/?programmes=101,102&annee_min=2019&annee_max=2019&grouper_par=beneficiaire,theme) |

- Plein écran

| Paramètre   | Description                                    | Valeurs acceptées | Exemple                                                                               |
| ----------- | ---------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------- |
| Plein écran | Affiche le tableau de résultats en plein écran | `true` ou `false` | [`plein_ecran=true`](https://budget.databretagne.fr/?programmes=107&plein_ecran=true) |


- Domaines fonctionnels

| Paramètre             | Description                                           | Valeurs acceptées                                               | Exemple                                                                                                                            |
| --------------------- | ----------------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Domaines fonctionnels | Les domaines fonctionnels à inclure dans la recherche | Code(s) de(s) domaine(s) fonctionnel(s) séparé par des virgules | [domaines_fonctionnels=0103-03-02](https://budget.databretagne.fr/?domaines_fonctionnels=0103-03-02&annee_min=2019&annee_max=2019) |
|                       |

- Referentiels de programmation

| Paramètre                  | Description                                                   | Valeurs acceptées                                                     | Exemple                                                                                                                                                                    |
| -------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Referentiels programmation | Les referentiels de programmation à inclure dans la recherche | Code(s) de(s) referentiel(s) de programmation séparé par des virgules | [referentiels_programmation=0119010101A9,010101040101](https://budget.databretagne.fr/?referentiels_programmation=0119010101A9,010101040101&annee_min=2019&annee_max=2019) |

- Source region

| Paramètre     | Description                                    | Valeurs acceptées    | Exemple                                                                                                             |
| ------------- | ---------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Source region | Les region sources à inclure dans la recherche | Code INSEE de region | [source_region=035](https://budget.databretagne.fr/?source_region=035&annee_min=2021&annee_max=2022&programmes=107) |

- Bénéficiaires

| Paramètre     | Description                             | Valeurs acceptées          | Exemple                                                                                                                    |
| ------------- | --------------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Bénéficiaires | Les sirets à inclure dans la rechercher | siret du/des bénéficiaires | [beneficiaires=19141687400011,34305956400959](https://budget.databretagne.fr/?beneficiaires=19141687400011,34305956400959) |