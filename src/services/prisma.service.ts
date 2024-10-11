import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    async onModuleInit() {
        await this.$connect(); // 連接資料庫
    }

    async onModuleDestroy() {
        await this.$disconnect(); // 關閉資料庫連接
    }
}
