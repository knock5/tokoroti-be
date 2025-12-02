import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { StockTransactionService } from './stock-transaction.service';
import { StockTransaction } from '@prisma/client';
import {
  CreateStockTransactionSchema,
  type UpdateStockTransactionDto,
  UpdateStockTransactionSchema,
  type CreateStockTransactionDto,
} from './dto/stock-transaction.dto';

@Controller('stock-transactions')
export class StockTransactionController {
  constructor(
    private readonly stockTransactionService: StockTransactionService,
  ) {}

  @Get()
  async findAll(): Promise<{ message: string; data: StockTransaction[] }> {
    const res = await this.stockTransactionService.findAll();
    return {
      message: 'Berhasil mengambil data stock transaction',
      data: res,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id') idStr: string,
  ): Promise<{ message: string; data: StockTransaction }> {
    const res = await this.stockTransactionService.findOne(idStr);

    return {
      message: `Berhasil mengambil data stock transaction dengan id ${idStr}`,
      data: res,
    };
  }

  @Post()
  async create(
    @Body() body: CreateStockTransactionDto,
  ): Promise<{ message: string; data: StockTransaction }> {
    const parsed = CreateStockTransactionSchema.parse(body);
    const res = await this.stockTransactionService.create(parsed);

    return {
      message: 'Berhasil membuat stock transaction baru',
      data: res,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') idStr: string,
    @Body() body: UpdateStockTransactionDto,
  ): Promise<{ message: string; data: StockTransaction }> {
    const id = parseInt(idStr, 10);
    const parsed = UpdateStockTransactionSchema.parse(body);
    const res = await this.stockTransactionService.update(id, parsed);

    return {
      message: `Berhasil memperbarui stock transaction dengan id ${id}`,
      data: res,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id') idStr: string,
  ): Promise<{ message: string; data: StockTransaction }> {
    const id = parseInt(idStr, 10);
    const res = await this.stockTransactionService.remove(id);

    return {
      message: `Berhasil menghapus stock transaction dengan id ${id}`,
      data: res,
    };
  }
}
