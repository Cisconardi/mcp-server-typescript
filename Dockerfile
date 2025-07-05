FROM node:22.12-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --ignore-scripts
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build
EXPOSE 3000
ENV NODE_ENV=production
ENTRYPOINT ["node", "build/cli.js"]
CMD ["http", "--port", "3000", "--host", "0.0.0.0"]
