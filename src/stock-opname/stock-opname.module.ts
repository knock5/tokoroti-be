import { Module } from '@nestjs/common';
import { StockOpnameService } from './stock-opname.service';
import { StockOpnameController } from './stock-opname.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [StockOpnameService],
  controllers: [StockOpnameController],
  exports: [StockOpnameService],
})
export class StockOpnameModule {}
