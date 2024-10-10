$tag=":latest"
$imageShortName="de-pickbazar"
$imageName = $imageShortName + $tag
$containerName = $imageShortName + "-2"
$containerUrl = "192.168.0.99:2376"
$dockerfile = "./Dockerfile"
$port="20001:5000"
# $imageFilePath="D:\test\temp.tar"
# 本地建置映像檔

# # docker build -t $imageName . -f $dockerfile
# docker save -o $imageFilePath $imageShortName


# # # 將本地的映像檔匯入 Docker 主機
# docker -H="$containerUrl" load --input  $imageFilePath


# # # 停用容器
docker  -H="$containerUrl" ps -a -f ancestor=$containerName --no-trunc -q | foreach-object { docker  -H="$containerUrl" stop $_ }
docker  -H="$containerUrl" ps -a -f name=$containerName --no-trunc -q | foreach-object { docker  -H="$containerUrl" stop $_ }

# # # 移除容器
docker -H="$containerUrl" ps -a -f ancestor=$containerName* --no-trunc -q | foreach-object { docker  -H="$containerUrl" rm -f $_ }
docker -H="$containerUrl" ps -a -f name=$containerName* --no-trunc -q | foreach-object { docker  -H="$containerUrl" rm -f $_ }

# # # 移除映像檔

 $existingImages = docker  -H="$containerUrl" images $imageName
 If ($existingImages.count -gt 1) {
 write-host "[Removing image]Removing the existing image.."
 docker  -H="$containerUrl" rmi -f $imageName
 } else {
 write-host "[Removing image]The image does not exist"
 }

# # # 遠端建置映像檔 (nas 比本機電腦慢，這個就不建議了)
docker  -H="$containerUrl" build -t $imageName . -f $dockerfile

# # 建立及啟動容器應用
docker  -H="$containerUrl" run -d --name $containerName --restart=always -p $port $imageShortName

 pause

