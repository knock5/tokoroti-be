import { Module } from '@nestjs/common';
import { PurchaseRequestService } from './purchase-request.service';
import { PurchaseRequestController } from './purchase-request.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PurchaseRequestService],
  controllers: [PurchaseRequestController],
  exports: [PurchaseRequestService],
})
export class PurchaseRequestModule {}
