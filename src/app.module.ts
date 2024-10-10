import { Module } from '@nestjs/common';

import { AppController } from './controllers/app.controller';
import { OauthControllerController } from './controllers/oauth-controller.controller';
import { AppService } from './services/app.service';

@Module({
    imports: [],
    controllers: [AppController, OauthControllerController],
    providers: [AppService],
})
export class AppModule {}
