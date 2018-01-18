it's a simple nodejs sample from https://nodejs.org/en/docs/guides/nodejs-docker-webapp/.

**clone**  
*git clone git@github.com:xuxiangwen/docker-nodejs.git*  
*cd docker-nodejs*

**build image**  
*docker build -t xxw/node-web-app .*

**run**  
*docker run --name node-web-app  -p 3000:3000 --rm  xxw/node-web-app*

**go into the container**  
*docker exec -it  node-web-app bash*

**test**  
*curl -i localhost:3000*
