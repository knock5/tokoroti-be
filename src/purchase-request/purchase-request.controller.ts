import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PurchaseRequestService } from './purchase-request.service';
import { PurchaseRequest } from '@prisma/client';
import type {
  CreatePurchaseRequestDto,
  UpdatePurchaseRequestDto,
} from './dto/purchase-request.dto';
import {
  PurchaseRequestSchema,
  UpdatePurchaseRequestSchema,
} from './dto/purchase-request.dto';

@Controller('purchase-request')
export class PurchaseRequestController {
  constructor(
    private readonly purchaseRequestService: PurchaseRequestService,
  ) {}

  @Get()
  async findAll(): Promise<{ message: string; data: PurchaseRequest[] }> {
    const res = await this.purchaseRequestService.findAll();

    return {
      message: 'Berhasil mengambil data purchase request',
      data: res,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id') idStr: string,
  ): Promise<{ message: string; data: PurchaseRequest | null }> {
    const id = parseInt(idStr, 10);
    const res = await this.purchaseRequestService.findOne(id);

    return {
      message: `Berhasil mengambil data purchase request dengan id ${id}`,
      data: res,
    };
  }

  @Post()
  async create(
    @Body() body: CreatePurchaseRequestDto,
  ): Promise<{ message: string; data: PurchaseRequest }> {
    const parsed = PurchaseRequestSchema.parse(body);
    const res = await this.purchaseRequestService.create(parsed);

    return {
      message: 'Berhasil membuat purchase request',
      data: res,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') idStr: string,
    @Body() body: UpdatePurchaseRequestDto,
  ): Promise<{ message: string; data: PurchaseRequest }> {
    const id = parseInt(idStr, 10);
    const parsed = UpdatePurchaseRequestSchema.parse(body);
    const res = await this.purchaseRequestService.update(id, parsed);

    return {
      message: `Berhasil memperbarui purchase request dengan id ${id}`,
      data: res,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id') idStr: string,
  ): Promise<{ message: string; data: PurchaseRequest }> {
    const id = parseInt(idStr, 10);
    const res = await this.purchaseRequestService.remove(id);

    return {
      message: `Berhasil menghapus purchase request dengan id ${id}`,
      data: res,
    };
  }
}
