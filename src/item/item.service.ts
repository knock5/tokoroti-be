import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateItemDto, UpdateItemDto } from './dto/item.dto';
import { Item } from '@prisma/client';

@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.item.findMany();
  }

  async findOne(id: number): Promise<Item> {
    const item = await this.prisma.item.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Item with id ${id} not found`);
    return item;
  }

  async create(data: CreateItemDto): Promise<Item> {
    const payload: {
      name: string;
      unit: string;
      minStock?: string;
      stock?: string;
    } = {
      name: data.name,
      unit: data.unit,
    };

    if (data.minStock !== undefined)
      payload.minStock = data.minStock.toString();
    if (data.stock !== undefined) payload.stock = data.stock.toString();

    return this.prisma.item.create({ data: payload });
  }

  async update(id: number, data: UpdateItemDto): Promise<Item> {
    await this.findOne(id);

    const payload: {
      name?: string;
      unit?: string;
      minStock?: string;
      stock?: string;
    } = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.unit !== undefined) payload.unit = data.unit;
    if (data.minStock !== undefined)
      payload.minStock = data.minStock.toString();
    if (data.stock !== undefined) payload.stock = data.stock.toString();

    return this.prisma.item.update({
      where: { id },
      data: payload,
    });
  }

  async remove(id: number): Promise<Item> {
    await this.findOne(id);
    return this.prisma.item.delete({ where: { id } });
  }
}
