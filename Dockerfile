FROM node:8


RUN npm config set proxy http://web-proxy.rose.hp.com:8080 \ 
    &&  npm config set https-proxy http://web-proxy.rose.hp.com:8080 

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install 
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
