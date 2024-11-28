FROM node:22.11.0 AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .

ARG VITE_API_URL
ARG VITE_GOOGLE_API_KEY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GOOGLE_API_KEY=$VITE_GOOGLE_API_KEY

RUN npm run build

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
