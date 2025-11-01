# ---- Étape 1 : Build ----
FROM node:20-alpine AS builder

# Crée le dossier de travail
WORKDIR /app

# Copie les fichiers nécessaires à l'installation
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie le reste du code
COPY . .

# Build du projet pour production
RUN npm run build


# ---- Étape 2 : Serveur de production ----
FROM node:20-alpine

WORKDIR /app

# Copie uniquement les fichiers nécessaires du build précédent
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Définit le port
EXPOSE 3000

# Démarre Next.js
CMD ["npm", "start"]
