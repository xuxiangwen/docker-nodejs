# ElasticSearch Question Sample
# Installation
1. git clone git@github.com:xuxiangwen/docker-nodejs.git
2. cd docker-nodejs/question-elasticsearch
3. abe install abecms/abe-elasticsearch   
make sure your have install abecms are not installed. see also
https://github.com/abecms/abecms
4. abe serve  --port 3003
5. open <http://localhost:3003/abe/plugin/abe-elasticsearch/console> and index the blog with your elasticsearch
6. Enjoy ! (go to the site on <http://localhost:3000/autocomplete.html> or <http://localhost:3000/livesearch.html> to see elasticsearch in action)

# Reference
- https://github.com/abecms/recipe-elasticsearch