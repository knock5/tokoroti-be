import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { ItemModule } from './item/item.module';
import { StockTransactionModule } from './stock-transaction/stock-transaction.module';
import { PurchaseRequestModule } from './purchase-request/purchase-request.module';
import { PurchaseOrderModule } from './purchase-order/purchase-order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    PrismaModule,
    AuthModule,
    CommonModule,
    ItemModule,
    StockTransactionModule,
    PurchaseRequestModule,
    PurchaseOrderModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
