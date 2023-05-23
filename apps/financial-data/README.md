# Description

Front permettant de faire des recherches sur les données Financière de l'état en bretagne.  

Utilise les API de la [plateforme data éta en bretagne](https://github.com/SIB-rennes/DataEtatBretagne-back/blob/main/README.md)

## Utiliser l'application données financières depuis une autre application

Il est possible de diriger un utilisateur vers des données financières filtrèes en utilisant des paramètres d'url, exemple:

`http://localhost:4200/?programmes=101,102&niveau_geo=Epci&code_geo=200000172`

Voici les paramètres pris en charge:

- Programmes

| Paramètre  | Description                | Exemple              |
| ---------- | -------------------------- | -------------------- |
| Programmes | Codes programmes à inclure | `programmes=101,102` |
|            |                            |                      |

- Emplacement géographique

| Paramètre           | Description         | Valeurs acceptées                                                       | Exemple              |
| ------------------- | ------------------- | ----------------------------------------------------------------------- | -------------------- |
| Niveau géographique | Niveau géographique | `Département`,`Epci` et `Commune`                                       | `niveau_geo=Epci`    |
| code_geo            | Code géographique   | [COG](https://www.insee.fr/fr/recherche/recherche-geographique?debut=0) | `code_geo=200000172` |