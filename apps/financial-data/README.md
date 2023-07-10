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

## Exemples concrets d'utilisation


- Scénario 1 : Je suis un élu cherchant des infomations sur le financement de ma commune

En tant qu'élu de la commune d'Artemare, j'ai besoin de connaître les fonds alloués par l'État à ma commune et de les comparer à ceux des communes voisines.

Je me rend sur [VisuTerritoire](https://geobretagne.fr/app/visuterritoire). Une fois connecté sur le site, je dois sélectionner un filtre sur la carte pour obtenir uniquement les données pertinentes à ma recherche. Je clique sur "Financement des collectivités", ce qui me propose une liste de filtres. Dans ce cas, je choisis "montant engagés" pour n'afficher que les données pertinentes. Le filtre est appliqué sur l'ensemble de la carte.

![Barre filtre](https://github.com/SIB-rennes/DataEtatBretagne-Front/assets/61988545/65b24c31-81fd-4a70-bebe-68558755ad90.png)

Je choisis l'échelle territoriale et la temporalité dans la barre latérale gauche nouvellement ouverte.

![barre temporalité](https://github.com/SIB-rennes/DataEtatBretagne-Front/assets/61988545/53c64b86-93b6-4678-9900-c8a73361cf67.png)

Ensuite, j'entre le nom de ma commune dans le champ de recherche situé en haut à droite de la page, ce qui me permet d'accéder instantanément à celle-ci sur la carte. En cliquant sur ma commune, j'obtiens rapidement les informations que je recherche grâce à des graphiques très explicites qui apparaissent sur la droite de mon écran. Je clique ensuite sur les communes adjacentes pour les comparer aux résultats obtenus précédemment.



- Scénario 2 : Je sonsulte des données publiques d'urbanisme

Je travaille dans un bureau d'études responsable de la construction de logements HLM. J'aimerais savoir s'il serait intéressant de développer le parc de logements HLM dans la commune Bretonne de Landudec.

En tant que particulier, je me rends directement sur [VisuTerritoire](https://geobretagne.fr/app/visuterritoire). Je recherche des informations sur l'habitat, donc je clique sur l'arborescence "Logement" accompagnée de son icône "maison" pour une visibilité rapide et ludique.

![Landudec 1](https://github.com/SIB-rennes/DataEtatBretagne-Front/assets/61988545/0e0de7af-a2b1-432a-9e9f-f1fb53587b74.png)


Je clique sur la poubelle en haut à gauche pour désélectionner les filtres qui ne m'intéressent pas.

Ensuite, je sélectionne le filtre permettant de visualiser la "Part de logements selon le statut d'occupation". Dans la barre de recherche en haut à droite, je saisis le nom de la commune et clique dessus.

![Landudec 2](https://github.com/SIB-rennes/DataEtatBretagne-Front/assets/61988545/d9940f69-243e-48ac-8310-f6e28db92e4b.png)

Puis je clique sur la carte, à l'emplacement indiqué pour afficher les résultats.

![Landudec 3](https://github.com/SIB-rennes/DataEtatBretagne-Front/assets/61988545/ab33f687-e0f5-4053-81cd-970849182eb5.png)

Je constate qu'en 2020, seuls 2,3 % des logements sont vacants dans cette zone. Des graphiques explicites et très visuels me permettent également de voir que l'habitat collectif ne représente que 6,4 % du parc contre 93.6% de logements individuels.

Pour compléter ma recherche, je clique sur le filtre "Part des logements HLM dans le parc de résidences principales". Je remarque que 10,2 % des résidences principales de 2020 sont des HLM, mais une autre statistique intéressante me permet de voir que dans la zone géographique de l'EPCI comprenant la commune, 6,6 % des logements sont de type HLM.

![Landudec 4](https://github.com/SIB-rennes/DataEtatBretagne-Front/assets/61988545/e7bd4a76-d281-4ea9-a898-4c96b342a5ad.png)

La carte interactive me permet de cliquer sur les communes avoisinantes afin de voir le taux de logements HLM au sein du parc de résidences principales de chaque commune, ce qui me permet de vérifier la cohérence d'un projet de construction d'HLM.

Cette centralisation des données et la pertinence dans le traitement de celles-ci me permettent de commencer des démarches auprès des organismes publics responsables de l'aménagement du territoire Breton.
​

- Scénario 3 : Je reçois, utilise et partage un filtre.

Je clique sur le [lien](https://geobretagne.fr/mviewer/?x=-347941&y=6150123&z=8&l=rp_menage_union_geom*rpmen_menpseul%40commune*level%20%3D%20%27Commune%27%2Crp_menage_union_geomdbl1**level%20%3D%20%27Commune%27%2Crp_struct_pop_geomdbl3**level%20%3D%20%27Commune%27&lb=positron&config=/apps/visuterritoire/config.xml&mode=d) que l’on m’a envoyé par mail et je me retrouve sur l'application VisuTerritoire. Trois filtres sont présents sur la gauche de mon écran, à savoir le "nombre d'habitants", le "nombre de ménages" ainsi que la "composition des ménages" d'une personne (%).

En maintenant mon clic entre le nom du filtre et la croix, je modifie l'ordre de superposition des filtres sur la carte. Cela me permet d'avoir une meilleure visibilité sur certaines informations.

Je déroule la case "nombre de ménages" en utilisant la flèche intitulée "option" située juste en bas de celle-ci. Je modifie l'opacité en maintenant mon clic sur la barre intitulée "opacité" et en déplaçant ma souris de droite à gauche. Cela me permet de bien différencier les informations entre le "nombre d'habitants" et le "nombre de ménages".

Enfin, je modifie l'échelle de temporalité pour visualiser l'évolution du "nombre de ménages" entre 2008 et 2020. Pour voir l'évolution chronologique en continu, je clique sur le bouton "play" situé à droite de l'option "temporalité". Je visualise graphiquement l'évolution des données entre 2008 et 2020 de manière automatique.

Je partage à mon tour la carte avec le filtre. Pour cela, je clique en haut à droite de la page sur la flèche intitulée "partager la carte". Ensuite, je choisis le mode d'affichage normal pour que la personne suivante ait accès aux mêmes paramètres que moi. J'aurais pu choisir l'un des modes simplifiés pour masquer les différents filtres et la barre de recherche. Enfin, je clique sur le bouton "lien permanent vers la carte" situé à gauche du QR code. Une nouvelle page s'ouvre et je peux copier l'URL de la carte depuis le haut de mon navigateur web.
