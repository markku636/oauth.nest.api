import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('get-hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
