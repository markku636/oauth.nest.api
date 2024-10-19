$imageName = "nestjs-oauth-api"
$containerName = $imageName
$imageNameWithVersion = $imageName + ":latest"
$containerUrl = "tcp://192.168.50.52:2376"
$dockerfile = "./Dockerfile"
$outputPath = "E:\VisualStudioProject\"
$imageFilePath = $outputPath + $imageName + ".tar"
$port="33090:3000"

# 本地建置映像檔
docker build -t $imageName -f $dockerfile .

docker save -o $imageFilePath $imageName # save 映像檔為 .tar 格式

# 停用容器
$containerIds = docker --tls -H="$containerUrl" ps -a -q -f name=$containerName
if ($containerIds) {
    $containerIds | ForEach-Object { docker --tls -H="$containerUrl" stop $_ }
} else {
    Write-Host "No containers to stop."
}

# 移除容器
$containerIds = docker --tls -H="$containerUrl" ps -a -q -f name=$containerName
if ($containerIds) {
    $containerIds | ForEach-Object { docker --tls -H="$containerUrl" rm -f $_ }
} else {
    Write-Host "No containers to remove."
}

# 移除映像檔
$existingImages = docker --tls -H="$containerUrl" images -q $imageName
if ($existingImages) {
    Write-Host "[Removing image] Removing the existing image.."
    docker --tls -H="$containerUrl" rmi -f $imageName
} else {
    Write-Host "[Removing image] The image does not exist"
}

# 將本地的映像檔匯入 Docker 主機
docker --tls -H="$containerUrl" load --input $imageFilePath

# 建立及啟動容器應用
docker --tls -H="$containerUrl" run -d --name $containerName --restart=always -p $port $imageName

pause 

