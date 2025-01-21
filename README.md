# Lamanager

## Description
Lamanager est une application web basée sur Laravel et React, utilisant Inertia.js pour créer une expérience utilisateur fluide.

## Prérequis
- Docker
- Docker Compose
- Git

## Structure Docker
Le projet utilise trois services Docker :
- **app** : PHP 8.2 avec Apache
- **db** : MariaDB 10.6


## Accès à l'application
Une fois l'installation terminée, l'application est accessible à :
- Application : http://localhost:8000
- Base de données MariaDB :
  - Host: localhost
  - Port: 3306
  - Database: lamanager
  - Username: lamanager
  - Password: password


## Installation

1. Cloner le projet
git clone <url-du-repo>
cd lamanager

2. Copier le fichier d'environnement
cp .env.example .env

# Sous macos :

### Lancer les conteneurs Docker
docker-compose build
docker-compose up -d

docker exec -it lamanager-app composer install
docker exec -it lamanager-app npm i

### Installer les dépendances et configurer l'application

Générer la clé d'application
docker-compose exec app php artisan key:generate

Exécuter les migrations
docker-compose exec app php artisan migrate

### Lancer le serveur React
docker exec -it lamanager-app npm run dev

# Sous windows :

## Utiliser Docker sous Ubuntu
Installez Ubuntu depuis le Windows Store puis tapez wsl --install sous Powershell windows
sur Docker Desktop : Paramètres > Ressources > WSL Integration > Activer Ubuntu
lancer le logiciel Ubuntu > Créer son utilisateur si ce n'est pas déjà fait
Toujours sous Ubuntu :
mkdir projet
cp -r /mnt/c/Users/utilisateur/<votre>/<dossier>/Lamanager projet (prendre le dossier avec le .git)

Dans le projet :
docker-compose build
docker-compose up -d
docker-compose exec app npm run dev

Aller sur le conteneur app et executer
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache


## Commandes utiles

### Docker

Démarrer les conteneurs
docker-compose up -d

Arrêter les conteneurs
docker-compose down

Voir les logs
docker-compose logs -f

Reconstruire les conteneurs
docker-compose build --no-cache

### Laravel
Exécuter les migrations
docker-compose exec app php artisan migrate

Réinitialiser la base de données
docker-compose exec app php artisan migrate:fresh

Créer un nouveau contrôleur
docker-compose exec app php artisan make:controller NomController

Vider le cache
docker-compose exec app php artisan cache:clear


### NPM (si nécessaire)

Installer les dépendances
docker-compose exec app npm install

Compiler les assets
docker-compose exec app npm run build

Mode développement
docker-compose exec app npm run dev

Exécuter seeder
docker exec -it lamanager-app php artisan migrate:fresh --seed

---------------------------------------------
Installation serveur
git
curl
libpng-dev
libonig-dev
libxml2-dev
zip
unzip
nodejs
php-mysql
php-mbstring
php-exif
php-pcntl
phpbc-math
php-gd
