FROM node:20

WORKDIR /app

COPY . .

# Installa il pacchetto dal repo GitHub
RUN npm install @modelcontextprotocol/sdk@github:modelcontextprotocol/typescript-sdk

# Installa le restanti dipendenze
RUN npm install

# Compila il progetto
RUN npm run build

# Espone la porta per l'HTTP MCP
EXPOSE 5678

# Avvia il server MCP in modalità HTTP
CMD ["npm", "run", "http"]
