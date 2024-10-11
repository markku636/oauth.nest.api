import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Oauth api')
        .setDescription('The cats API description')
        .setVersion('1.0')
        .addTag('hello world!')
        .build();

    const swaggerDefaultUrl = '/docs';

    app.use(
        [swaggerDefaultUrl], // Swagger 文檔的路徑
        basicAuth({
            users: { admin: '123' }, // 設置用戶名和密碼
            challenge: true, // 會自動彈出認證提示
        }),
    );

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup(swaggerDefaultUrl, app, document);

    app.setViewEngine('ejs');
    app.setBaseViewsDir(join(__dirname, '..', '/src/views'));

    await app.listen(3000);
}
bootstrap();
