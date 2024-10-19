## 此次採用的技術架構是
* 前端(電商網站) - (Next.JS、Eslint、Pritter、React、Redux toolkit) - [程式碼](https://github.com/markku636/oauth.nextjs)
* 後端(OAuth 服務) -( Nest JS、Mysql、Prisma 、 Swagger 、 class-validator做資料驗證、並用Guard 做JWT的API驗證) - [程式碼](https://github.com/markku636/oauth.nest.api)
* 資料庫 MYsql

## Demo 
* [EC site](https://oauth-nextjs.letgo.com.tw)
* [Auth service api](https://oauth-nestjs-api.letgo.com.tw)
* [Swagger Url](https://oauth-nestjs-api.letgo.com.tw/docs) -  admin / 123

## Demo
* [影片Url](https://www.loom.com/share/fdac0b89ace64bc3b3ad5a85098d0499)

## 佈署環境
* 使用Powerhsell 佈署到Nas 
* GCP 反向代理 + 個人 Nas 伺服器伺服器

測試
*Jest
*Rest Clinet 

## Local debug
```
npm run start:dev
```