# Kontoj

![Logo](../src/images/logo-corners-h100.png)

[![Faire un don PayPal.Me](https://img.shields.io/badge/Faire_un_don-PayPal.Me-8bd7bc?style=for-the-badge&logo=paypal)](https://www.paypal.me/AntoineTURMEL)

Un outil web facilitant la création de comptes sur des services web, en se basant sur un fichier JSON.

## Documentation Language:
- [English](../README.md)
- [Français](README-fr.md)

## Comment utiliser Kontoj v1.5 :
### Charger votre liste de services :
- Copiez [src/services.example.json](../src/services.example.json) à partir du projet
- Remplissez les détails de vos services à l'intérieur du fichier (Vous pouvez valider votre fichier en utilisant ce schéma : [src/services.schema.json](../src/services.schema.json), vous pouvez aussi éditer ce fichier en utilisant [web json-editor](https://pmk65.github.io/jedemov2/dist/demo.html))
- Dans Kontoj, sélectionnez votre fichier services.json pour charger la liste des services.

💡 **NOTE : Dans une future version, il sera possible d'enregistrer le fichier JSON dans le navigateur.**

### Auto-complétion
À partir de la version v1.1, vous pouvez auto-compléter les champs en utilisant les sélecteurs jQuery, vous pouvez voir un exemple dans le fichier services.example.json & voir la liste des champs possibles dans le fichier services.schema.json.

L'auto-complétion fonctionne grâce à un « Userscript », il est nécessaire d'installer une extension de navigateur comme [Violentmonkey](https://violentmonkey.github.io/get-it/) ou [Tampermonkey](https://www.tampermonkey.net/) pour installer le [Companion Kontoj](../src/js/kontoj_companion.user.js).

### Générer et remplir les adresses e-mail/mots de passe
- Dans la barre du haut, vous pouvez remplir le Nom/Prénom, adresse e-mail de la personne
- Vous pouvez choisir manuellement chaque service, choisir un groupe de services ou sélectionner un groupe utilisateur dans la barre du haut
- Vous pouvez utiliser le bouton « Remplir » 🪄 pour copier l'adresse e-mail dans chaque champ e-mail des services sélectionnés et générer un mot de passe (basé sur les règles définies dans le fichier JSON) pour chaque service sélectionné
- Vous pouvez utiliser le bouton « Générer le mail » 📨 pour générer le contenu du mail à envoyer avec tous les identifiants
- Vous pouvez utiliser le bouton « Générer le mot de passe » 🔑 pour générer let mot de passe (basé sur les règles définies dans le fichier JSON) pour le service sélectionné
- Vous pouvez choisir la génération de mail entre "body" (Généralement compatible avec tous les services/logiciels) ou "html-body" (Compatible avec Mozilla Thunderbird) en utilisant le bouton « Paramètres » 🛠️.

### Connexion & Création de compte
- Vous pouvez accéder à la page de connexion d'un service en cliquant sur le nom du service ou son logo
- En utilisant le bouton « Créer un compte » 👤 vous pouvez accéder à la page de création de compte de votre service

💡 **NOTE : Si vous avez le Companion Kontoj d'installé & que le service contient des champs auto-complété, cliquer sur « Créer un compte » 👤 remplira automatiquement les champs.**

### Démonstration

Chargement des services & remplissage des adresses mail/mots de passe
![Demo](../src/images/demo_v1.gif)

Génération du mail
![Mail body](../src/images/demo_mail_v1.png)

## Instructions développeur :
- Installez nodejs/npm
- npm install
- npx serve src

## Licence

Kontoj est sous licence [MIT Licence](../LICENSE)