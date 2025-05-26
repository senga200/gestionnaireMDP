# Gestionnaire de Mots de Passe

## Stack Technique

- **Backend** : Express.js  
- **Base de données** : PostgreSQL (via Docker)  
- **ORM** : Sequelize  
- **Sécurité** : bcrypt, jsonwebtoken  
- **Chiffrement** : AES (via clé `ENCRYPTION_KEY`)

---

## Installation

```
npm init -y
npm install express sequelize pg pg-hstore bcrypt jsonwebtoken dotenv
npm install cookie-parser
docker compose up -d
```
## Configuration 
Créer un fichier .env à la racine du projet avec les variables suivantes :
```
# .env
PORT=3000
JWT_SECRET=<à générer>
DB_HOST=localhost
DB_USER=<nom_utilisateur_bdd>
DB_PASSWORD=<mot_de_passe_bdd>
DB_NAME=gestionnaire
DB_PORT=5432
ENCRYPTION_KEY=<à générer>
```
## Lancer le serveur

```
node server.js
```

## Accès au container PostgreSQL

```
docker exec -it gestionnaire_postgres
se connecter  : 
psql -U admin -d gestionnaire
voir les tables :
\dt
puis la requete sql :
SELECT * FROM "Users";
Sequelize crée les colonnes createdAt et updatedAt, donc à remplir.
INSERT INTO "Users" (email, password, "createdAt", "updatedAt") 
VALUES ('testFromInsertInto', '123456', NOW(), NOW());
MAIS attention, le mot de passe est en clair, il faut le hasher avant de l’insérer dans la base de données.
on peut le faire via node.js :
const bcrypt = require("bcrypt");
bcrypt.hash("123456", 10).then(console.log);
ce qui va renvoyer un hash du mot de passe, qu’on peut ensuite insérer dans la base de données.

```

**travail sur le chiffrement** :
bcrypt Sert à hasher des mots de passe. Irréversible, on l’utilise pour authentifier un utilisateur.
On fait un bcrypt.compare(...) pour vérifier si l’utilisateur s’est bien connecté.

ENCRYPTION_KEY Sert à chiffrer/déchiffrer des données. Réversible, on l’utilise pour stocker des secrets utilisables. 
pour générer une ENCRYPTION_KEY en hexadécimal  (32 bytes pour AES-256) (fonctionne aussi pour le JWT): 
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
C’est une clé secrète utilisée pour chiffrer et déchiffrer les mots de passe stockés dans la base de données (ici PostgreSQL). C'est ce qui permet de convertir un mot de passe lisible (ex: motDePasse123) en texte chiffré (ex: 9a6fbd2c98d02e...) que seul le serveur peut déchiffrer.
Utiliser un chiffrement symétrique comme AES-256-CBC permet de chiffrer le mot de passe avant de l’enregistrer puis de le déchiffrer pour le montrer ou l’utiliser

## Routes
- Auth 
route /me : 
création d’un middleware pour gérer et sécuriser la route /me : seul un utilisateur authentifié accède à ses infos. Il vérifie que l’utilisateur est connecté via un JWT stocké dans un cookie, et fournit à la suite de la requête (req.userId) l’ID de l’utilisateur authentifié.
(nb module.exports pour exporter le middleware)

POST /register
enregistre un nouvel utilisateur 
récupère l’email et le password et le hash avec bcrypt
.

POST /login
connexion de l'utilisateur 
récupère l’email et le password
recherche si l’utilisateur existe par l’email (puisque le mdp est hashé)
bcrypt.compare() pour vérifier si le mot de passe fourni = hash stocké.
Émettre un token JWT uniquement si les identifiants sont valides
(   const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {expiresIn: "1d", }); ) => 1 jour mais on peut modifier (cf https://github.com/auth0/node-jsonwebtoken?tab=readme-ov-file#readme) 
     -	Envoie le token dans un cookie HttpOnly


- passwords
GET /passwords
récupère tous les mots de passe de l’utilisateur authentifié
POST /passwords
crée un nouveau mot de passe pour l’utilisateur authentifié
PUT /passwords/:id
met à jour un mot de passe existant pour l’utilisateur authentifié
DELETE /passwords/:id
récupère un mot de passe spécifique de l’utilisateur authentifié



