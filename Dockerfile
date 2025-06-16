FROM node:20

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5678

CMD ["npm", "run", "http"]
