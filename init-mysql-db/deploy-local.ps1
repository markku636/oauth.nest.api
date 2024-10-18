$dockerfile = './Dockerfile'
$imageName = "oauth-db:latest"
$containerName="oauth-db"
$port="33067:3306"

docker build -t $imageName . -f $dockerfile
docker run -d --name $containerName --restart=always -p $port $imageName 
PAUSE

