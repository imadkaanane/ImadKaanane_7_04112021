# Groupomania - Formation Développeur Web d'Openclassrooms
Projet 7 : création d'un réseau social d'entreprise.

## Technologies :

  ### Frontend
  - React : Version 17.0.2
  - Bootstrap : Version 5.1.3
  - React-router-dom : 6.2.1
  - Axios : Version 0.26.0
  
  ### Backend
  - MySQL2 : Version 2.3.3
  - Sequelize : Version 6.14.1
  - Node.js : Version 14.17.1
  - Express : Version 4.17.2
  
## Prérequis :

- Installer NodeJs et MySql.
- Cloner le projet sur votre machine.

## Importation de la base de données :

- Dans un serveur MySql, entrez la commande suivante pour créer une nouvelle base de donnéees :
  #### `CREATE DATABASE groupomania;`
  
- Pour importer le contenu du fichier groupomania.sql (backend > config > groupomania.sql) dans cette nouvelle base de données, entrez la commande suivante, 
  en remplaçant "user" et "password" :

  #### `mysql -u user -p password groupomania < groupomania.sql`

## Lancement de l'application :

- Allez dans le dossier backend de l'application :

  - installez les dépendances avec la commande suivante :
    #### `npm install`
  - lancez le serveur avec la commande suivante :
    #### `nodemon server` (http://localhost:3300/)
    
- Allez dans le dossier frontend de l'application :
  - installez yarn sur votre machine avec la commande suivante :
    #### `npm install -g yarn`
  - installez les dépendances avec la commande suivante :
    #### `yarn install`
  - lancez l'application avec la commande suivante :
    #### `yarn start` (http://localhost:3000/)

## Fonctionnement de l'application :

- Créez un compte sur la page d'inscription en renseignant un nom, un prénom, une adresse mail et un mot de passe. 
  Chacun de ses paramètres doit répondre à des conditions de validité qui apparaissent sous les champs lorsque ses conditions ne sont pas remplies.

- Adresse mail utilisateur unique et personnalisée à celle de l’entreprise : mail@groupomania.com

- Connectez vous ensuite sur la page de connexion en renseignant l'adresse mail et le mot de passe précédemment enregistrés.

- Une fois sur la page d'accueil, vous avez accès à la totalité des articles déjà publiés par les autres utilisateurs. 
Les articles sont affichés du plus récent au plus anciens.

- Vous pourrez accéder à un article, le commenter. 

- Vous pourrez également publier des articles, accéder à toutes vos publications et les supprimer si vous le souhaitez.

- Vous pourrez aussi accéder à votre profil et le modifier, notamment en changeant l'avatar par défaut qui vous a été attribué lors de votre inscription.

- Vous pouvez également modifier votre mot de passe.

- Vous pourrez enfin vous déconnecter de l'application.

- Le modérateur du site possède des droits supplémentaires : supprimer n'importe quel article et/ou commentaire de n'importe quel utilisateur.

- Pour définir un utilisateur en tant qu'administrateur
  Rendez-vous dans la base de données groupomania :

  #### `USE groupomania`

- Modifier la donnée is_admin en renseignant l'adresse email de votre inscription :

  #### `UPDATE users SET is_admin = 1 WHERE email = 'votre adresse email'`
