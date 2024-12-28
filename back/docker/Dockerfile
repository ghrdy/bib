# Utiliser une image de base officielle Node.js
FROM node:18-alpine

# Installer les dépendances nécessaires pour compiler bcrypt
RUN apk add --no-cache make gcc g++ python3

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Copier le script de création d'admin
COPY createAdmin.js .

# Exposer le port sur lequel l'application écoute
EXPOSE 5001

# Démarrer l'application et créer l'utilisateur admin
CMD ["sh", "-c", "node createAdmin.js && npm start"]