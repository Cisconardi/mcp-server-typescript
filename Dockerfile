FROM node:20

WORKDIR /app

COPY . .

RUN npm install

RUN npm install dotenv

RUN npm run build

EXPOSE 5678

CMD ["npm", "run", "http"]
