import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { StockOpnameService } from './stock-opname.service';
import { StockOpname } from '@prisma/client';
import {
  type CreateStockOpnameDto,
  CreateStockOpnameSchema,
  type UpdateStockOpnameDto,
  UpdateStockOpnameSchema,
} from './dto/stock-opname.dto';

@Controller('stock-opname')
export class StockOpnameController {
  constructor(private readonly stockOpnameService: StockOpnameService) {}

  @Get()
  async findAll(): Promise<{ message: string; data: StockOpname[] }> {
    const res = await this.stockOpnameService.findAll();

    return { message: 'Berhasil mengambil data stock opname', data: res };
  }

  @Get(':id')
  async findOne(
    @Param('id') idStr: string,
  ): Promise<{ message: string; data: StockOpname | null }> {
    const id = parseInt(idStr, 10);
    const res = await this.stockOpnameService.findOne(id);

    return {
      message: `Berhasil mengambil stock opname dengan id ${id}`,
      data: res,
    };
  }

  @Post()
  async create(
    @Body() body: CreateStockOpnameDto,
  ): Promise<{ message: string; data: StockOpname }> {
    const parsed = CreateStockOpnameSchema.parse(body);
    const res = await this.stockOpnameService.createWithAutoAdjust(parsed);

    return { message: 'Berhasil membuat stock opname', data: res };
  }

  @Patch(':id')
  async update(
    @Param('id') idStr: string,
    @Body() body: UpdateStockOpnameDto,
  ): Promise<{ message: string; data: StockOpname }> {
    const id = parseInt(idStr, 10);
    const parsed = UpdateStockOpnameSchema.parse(body);
    const res = await this.stockOpnameService.update(id, parsed);

    return {
      message: `Berhasil memperbarui stock opname dengan id ${id}`,
      data: res,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id') idStr: string,
    @Query('revert') revertStr?: string,
  ): Promise<{ message: string; data: StockOpname }> {
    const id = parseInt(idStr, 10);
    const revert = revertStr === 'true';
    const res = await this.stockOpnameService.remove(id, revert);

    return {
      message: `Berhasil menghapus stock opname dengan id ${id}`,
      data: res,
    };
  }
}
