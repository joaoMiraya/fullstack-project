FROM node:22.11.0 
WORKDIR /app

COPY package*.json ./
RUN npm install && npm cache clean --force

COPY . .

RUN npm run build:ts

EXPOSE 8080
CMD ["npm", "start"]