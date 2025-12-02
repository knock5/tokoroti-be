import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { Item } from '@prisma/client';
import { ItemSchema, type CreateItemDto } from './dto/item.dto';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  async findAll(): Promise<{ message: string; data: Item[] }> {
    const res = await this.itemService.findAll();

    return {
      message: 'Berhasil mengambil data item',
      data: res,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id') idStr: string,
  ): Promise<{ message: string; data: Item }> {
    const id = parseInt(idStr, 10);
    const res = await this.itemService.findOne(id);

    return {
      message: `Berhasil mengambil data item dengan id ${id}`,
      data: res,
    };
  }

  @Post()
  async create(
    @Body() body: CreateItemDto,
  ): Promise<{ message: string; data: Item }> {
    const parsed = ItemSchema.parse(body);
    const res = await this.itemService.create(parsed);

    return {
      message: 'Berhasil membuat item baru',
      data: res,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') idStr: string,
    @Body() body: Partial<CreateItemDto>,
  ): Promise<{ message: string; data: Item }> {
    const id = parseInt(idStr, 10);
    const parsed = ItemSchema.partial().parse(body);
    const res = await this.itemService.update(id, parsed);

    return {
      message: `Berhasil memperbarui item dengan id ${id}`,
      data: res,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id') idStr: string,
  ): Promise<{ message: string; data: Item }> {
    const id = parseInt(idStr, 10);
    const res = await this.itemService.remove(id);

    return {
      message: `Berhasil menghapus item dengan id ${id}`,
      data: res,
    };
  }
}
