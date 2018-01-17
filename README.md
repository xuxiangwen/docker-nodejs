it's a simple nodejs sample from https://nodejs.org/en/docs/guides/nodejs-docker-webapp/.

git clone 

**build image**
docker build -t xxw/node-web-app .

**run**
docker run -p 3000:3000 --rm  xxw/node-web-app
