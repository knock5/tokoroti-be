import { Injectable, NotFoundException } from '@nestjs/common';
import { PurchaseOrder, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderDto,
} from './dto/purchase-order.dto';
import { StockTransactionService } from 'src/stock-transaction/stock-transaction.service';

@Injectable()
export class PurchaseOrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stockTransactionService: StockTransactionService,
  ) {}

  async findAll(): Promise<PurchaseOrder[]> {
    return this.prisma.purchaseOrder.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<PurchaseOrder | null> {
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { id },
    });

    if (!po) {
      throw new NotFoundException('Purchase order tidak ditemukan');
    }

    return po;
  }

  async create(dto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    return this.prisma.purchaseOrder.create({
      data: {
        itemId: dto.itemId,
        qtyOrdered: new Prisma.Decimal(dto.qtyOrdered),
        createdById: dto.createdById ?? null,
        approvedById: dto.approvedById ?? null,
        note: dto.note ?? null,
        status: dto.status ?? undefined,
      },
    });
  }

  async update(
    id: number,
    dto: UpdatePurchaseOrderDto,
  ): Promise<PurchaseOrder> {
    const existing = await this.findOne(id);
    const newStatus = dto.status ?? existing?.status;

    if (existing?.status !== 'RECEIVED' && newStatus === 'RECEIVED') {
      return this.prisma.$transaction(async (tx) => {
        const item = await tx.item.findUnique({
          where: { id: dto.itemId ?? existing?.itemId },
        });

        if (!item) throw new NotFoundException('Item tidak ditemukan');

        const itemId = dto.itemId ?? existing?.itemId;
        if (!itemId) throw new NotFoundException('Item ID tidak ditemukan');

        const qty =
          dto.qtyOrdered !== undefined
            ? Number(String(dto.qtyOrdered))
            : Number(existing?.qtyOrdered);

        // check unit price
        const stockTx = await tx.stockTransaction.findFirst({
          where: { itemId },
          orderBy: { createdAt: 'desc' },
        });

        // buat stock transaction masuk
        await this.stockTransactionService.create({
          itemId: itemId,
          qty: String(qty),
          type: 'IN',
          unitPrice: stockTx?.unitPrice ? String(stockTx.unitPrice) : '0',
          note: `Diterima dari PO#${id}` + (dto.note ? ` - ${dto.note}` : ''),
          createdBy: dto.approvedById ?? existing?.approvedById ?? undefined,
        });

        // update item stock
        const newStock = Number(item.stock) + qty;
        await tx.item.update({
          where: { id: item.id },
          data: { stock: String(newStock) },
        });

        // update PO
        const payload: Partial<PurchaseOrder> = {};
        if (dto.itemId !== undefined) payload.itemId = dto.itemId;
        if (dto.qtyOrdered !== undefined)
          payload.qtyOrdered = new Prisma.Decimal(dto.qtyOrdered);
        if (dto.createdById !== undefined)
          payload.createdById = dto.createdById;
        if (dto.approvedById !== undefined)
          payload.approvedById = dto.approvedById;
        if (dto.note !== undefined) payload.note = dto.note;
        payload.status = 'RECEIVED';
        payload.resolvedAt = new Date();

        const updated = await tx.purchaseOrder.update({
          where: { id },
          data: payload,
        });
        return updated;
      });
    }

    // bukan update ke RECEIVED, biasa saja
    const payload: Partial<PurchaseOrder> = {};
    if (dto.itemId !== undefined) payload.itemId = dto.itemId;
    if (dto.qtyOrdered !== undefined)
      payload.qtyOrdered = new Prisma.Decimal(dto.qtyOrdered);
    if (dto.createdById !== undefined) payload.createdById = dto.createdById;
    if (dto.approvedById !== undefined) payload.approvedById = dto.approvedById;
    if (dto.note !== undefined) payload.note = dto.note;
    if (dto.status !== undefined) payload.status = dto.status;

    return this.prisma.purchaseOrder.update({ where: { id }, data: payload });
  }

  async approve(id: number, approvedById: number): Promise<PurchaseOrder> {
    await this.findOne(id);

    return this.prisma.purchaseOrder.update({
      where: { id },
      data: { status: 'APPROVED', approvedById },
    });
  }

  async markAsReceived(
    id: number,
    receivedById?: number,
  ): Promise<PurchaseOrder> {
    const existing = await this.findOne(id);

    if (!existing) {
      throw new NotFoundException('Purchase order tidak ditemukan');
    }

    return this.update(id, {
      status: 'RECEIVED',
      approvedById: receivedById ?? existing.approvedById ?? undefined,
    });
  }

  async remove(id: number): Promise<PurchaseOrder> {
    await this.findOne(id);

    return this.prisma.purchaseOrder.delete({
      where: { id },
    });
  }
}
