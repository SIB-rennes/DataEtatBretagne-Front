<h1 align="center" style="border-bottom: none">
    <div>
        Front plateforme état en bretagne
    </div>
</h1>

<p align="center">
    Contient les différents front pour la plateforme data état en bretagne<br/>
</p>

<div align="center">
 
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-green.svg)](https://conventionalcommits.org)
[![Angular](https://img.shields.io/badge/angular-14-blue)](https://angular.io/)
[![Docker build](https://img.shields.io/badge/docker-automated-informational)](https://docs.docker.com/compose/)

</div>


# Liste des fronts

* [Financial data](./apps/financial-data/README.md)

# Test e2e

Créer un fichier '.env' à la racine du projet [e2e](./e2e) et mettre les identifiants d'un utilisateur pour passer l'authentification :  

```
TEST_USERNAME=csm@sib.fr
TEST_PASSWORD=<PASSWORD>
```

Pour lancer les tests sur l'environnement d'intégration
```
npx playwright test
```

Pour lancer les tests depuis votre environnement locale
```
npx playwright test --config=playwright.dev.config.ts
```

# Clients générés automatiquement

Le dossier [apps/clients](./apps/clients/) contient des clients d'api, ces derniers peuvent être générées automatiquement.

**Les exemples sont données avec les URL de l'environnement d'intégration**

## Data subventions

 - url api: [https://api.nocode.csm.ovh/data_subventions/swagger.json](https://api.nocode.csm.ovh/data_subventions/swagger.json)
 - Commande de génération:
```
docker run --rm -v "<PRJ_FOLDER>/apps/clients:/local" openapitools/openapi-generator-cli generate \        
  -i https://api.nocode.csm.ovh/data_subventions/swagger.json \
  -g typescript-angular \
  -o /local/ds-client \
  --additional-properties npmName=ds-client,npmVersion=1.0.0,snapshot=false,ngVersion="15.0.1",apiModulePrefix=ds,configurationPrefix=ds
```