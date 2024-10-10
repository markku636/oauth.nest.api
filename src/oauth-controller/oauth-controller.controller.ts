import { Controller, Get } from '@nestjs/common';

@Controller('oauth')
export class OauthControllerController {
  @Get('test')
  getHello(): string {
    return 'Hello World!111';
  }
}
