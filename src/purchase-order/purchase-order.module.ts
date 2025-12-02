import { Module } from '@nestjs/common';
import { PurchaseOrderService } from './purchase-order.service';
import { PurchaseOrderController } from './purchase-order.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StockTransactionService } from 'src/stock-transaction/stock-transaction.service';

@Module({
  imports: [PrismaModule],
  providers: [PurchaseOrderService, StockTransactionService],
  controllers: [PurchaseOrderController],
  exports: [PurchaseOrderService],
})
export class PurchaseOrderModule {}
