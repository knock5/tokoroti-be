import { Module } from '@nestjs/common';
import { StockTransactionService } from './stock-transaction.service';
import { StockTransactionController } from './stock-transaction.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [StockTransactionService],
  controllers: [StockTransactionController],
  exports: [StockTransactionService],
})
export class StockTransactionModule {}
