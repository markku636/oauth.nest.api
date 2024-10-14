import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from 'src/services/app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    @Render('index')
    getHello(): object {
        return {
            title: 'nest oauth api',
            subtitle: 'Wwagger 帳號:admin 密碼: 123 ',
        };
    }
}
