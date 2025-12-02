import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PurchaseOrderService } from './purchase-order.service';
import { PurchaseOrder } from '@prisma/client';
import {
  type CreatePurchaseOrderDto,
  PurchaseOrderSchema,
  type UpdatePurchaseOrderDto,
  UpdatePurchaseOrderSchema,
} from './dto/purchase-order.dto';

@Controller('purchase-order')
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  @Get()
  async findAll(): Promise<{ message: string; data: PurchaseOrder[] }> {
    const res = await this.purchaseOrderService.findAll();
    return { message: 'Berhasil mengambil data purchase order', data: res };
  }

  @Get(':id')
  async findOne(
    @Param('id') idStr: string,
  ): Promise<{ message: string; data: PurchaseOrder | null }> {
    const id = parseInt(idStr, 10);
    const res = await this.purchaseOrderService.findOne(id);
    return {
      message: `Berhasil mengambil purchase order dengan id ${id}`,
      data: res,
    };
  }

  @Post()
  async create(
    @Body() body: CreatePurchaseOrderDto,
  ): Promise<{ message: string; data: PurchaseOrder }> {
    const parsed = PurchaseOrderSchema.parse(body);
    const res = await this.purchaseOrderService.create(parsed);

    return { message: 'Berhasil membuat purchase order', data: res };
  }

  @Patch(':id')
  async update(
    @Param('id') idStr: string,
    @Body() body: UpdatePurchaseOrderDto,
  ): Promise<{ message: string; data: PurchaseOrder }> {
    const id = parseInt(idStr, 10);
    const parsed = UpdatePurchaseOrderSchema.parse(body);
    const res = await this.purchaseOrderService.update(id, parsed);

    return {
      message: `Berhasil memperbarui purchase order dengan id ${id}`,
      data: res,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id') idStr: string,
  ): Promise<{ message: string; data: PurchaseOrder }> {
    const id = parseInt(idStr, 10);
    const res = await this.purchaseOrderService.remove(id);

    return {
      message: `Berhasil menghapus purchase order dengan id ${id}`,
      data: res,
    };
  }

  // convenience endpoints
  @Post(':id/approve')
  async approve(
    @Param('id') idStr: string,
    @Body() body: { approverId: number },
  ): Promise<{ message: string; data: PurchaseOrder }> {
    const id = parseInt(idStr, 10);
    const res = await this.purchaseOrderService.approve(id, body.approverId);

    return { message: `Berhasil approve purchase order ${id}`, data: res };
  }

  @Post(':id/receive')
  async receive(
    @Param('id') idStr: string,
    @Body() body: { receivedById?: number },
  ): Promise<{ message: string; data: PurchaseOrder }> {
    const id = parseInt(idStr, 10);
    const res = await this.purchaseOrderService.markAsReceived(
      id,
      body.receivedById,
    );

    return { message: `Berhasil menerima purchase order ${id}`, data: res };
  }
}
