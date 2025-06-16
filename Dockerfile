# Usa l'immagine Node.js ufficiale
FROM node:20

# Crea directory di lavoro
WORKDIR /app

# Copia tutti i file nel container
COPY . .

# Installa le dipendenze, incluse quelle da GitHub
RUN npm install

# Compila TypeScript
RUN npm run build

# Espone la porta HTTP MCP
EXPOSE 5678

# Comando di avvio: esegue il server MCP in modalità HTTP
CMD ["npm", "run", "http"]
