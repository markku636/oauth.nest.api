import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OauthControllerController } from './oauth-controller/oauth-controller.controller';

@Module({
  imports: [],
  controllers: [AppController, OauthControllerController],
  providers: [AppService],
})
export class AppModule {}
