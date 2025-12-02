import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type {
  CreateStockTransactionDto,
  UpdateStockTransactionDto,
} from './dto/stock-transaction.dto';
import { StockTransaction } from '@prisma/client';

@Injectable()
export class StockTransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<StockTransaction[]> {
    return this.prisma.stockTransaction.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<StockTransaction> {
    const transaction = await this.prisma.stockTransaction.findUnique({
      where: { id: parseInt(id) },
    });

    if (!transaction)
      throw new NotFoundException(`StockTransaction ${id} tidak ditemukan`);
    return transaction;
  }

  async create(data: CreateStockTransactionDto): Promise<StockTransaction> {
    const qty = parseFloat(String(data.qty));
    const unitPrice =
      data.unitPrice !== undefined ? String(data.unitPrice) : undefined;

    return this.prisma.$transaction(async (tx) => {
      const item = await tx.item.findUnique({ where: { id: data.itemId } });
      if (!item)
        throw new NotFoundException(`Item ${data.itemId} tidak ditemukan`);

      const currentStock = Number(item.stock);
      let newStock = currentStock;

      if (data.type === 'IN') {
        newStock = currentStock + qty;
      } else {
        // OUT
        if (currentStock < qty) {
          throw new BadRequestException(
            `Tidak dapat mengurangi stock item ${data.itemId} sebanyak ${qty}, stock saat ini ${currentStock}`,
          );
        }
        newStock = currentStock - qty;
      }

      // create transaction and update item
      const created = await tx.stockTransaction.create({
        data: {
          itemId: data.itemId,
          qty: String(qty),
          type: data.type,
          unitPrice: unitPrice ? String(unitPrice) : undefined,
          note: data.note,
          createdBy: data.createdBy ?? null,
        },
      });

      await tx.item.update({
        where: { id: data.itemId },
        data: {
          stock: String(newStock),
        },
      });

      return created;
    });
  }

  async update(
    id: number,
    data: UpdateStockTransactionDto,
  ): Promise<StockTransaction> {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.stockTransaction.findUnique({ where: { id } });
      if (!existing)
        throw new NotFoundException(`StockTransaction ${id} tidak ditemukan`);

      const oldItemId = existing.itemId;
      const oldQty = Number(existing.qty);
      const oldType = existing.type;

      const newItemId = data.itemId ?? oldItemId;
      const newQty = data.qty !== undefined ? Number(String(data.qty)) : oldQty;
      const newType = data.type ?? oldType;

      const oldItem = await tx.item.findUnique({ where: { id: oldItemId } });
      if (!oldItem)
        throw new NotFoundException(
          `Item ${oldItemId} tidak ditemukan ketika memperbarui transaksi`,
        );

      let intermediateStockOld = Number(oldItem.stock);
      if (oldType === 'IN') {
        intermediateStockOld = intermediateStockOld - oldQty;
        if (intermediateStockOld < 0) {
          throw new BadRequestException(
            `Tidak cukup stock untuk item ${oldItemId} untuk membalikkan IN lama (stok saat ini=${String(oldItem.stock)}, permintaan out=${oldQty})`,
          );
        }
      } else {
        intermediateStockOld = intermediateStockOld + oldQty;
      }

      if (newItemId === oldItemId) {
        let finalStock = intermediateStockOld;
        if (newType === 'IN') finalStock = finalStock + newQty;
        else {
          if (finalStock < newQty) {
            throw new BadRequestException(
              `Tidak cukup stock untuk item ${newItemId} untuk melakukan OUT baru (stok saat ini setelah pembalikan=${finalStock}, permintaan out=${newQty})`,
            );
          }
          finalStock = finalStock - newQty;
        }

        await tx.item.update({
          where: { id: newItemId },
          data: { stock: String(finalStock) },
        });
      } else {
        await tx.item.update({
          where: { id: oldItemId },
          data: { stock: String(intermediateStockOld) },
        });

        const newItem = await tx.item.findUnique({ where: { id: newItemId } });

        if (!newItem)
          throw new NotFoundException(
            `Item ${newItemId} tidak ditemukan ketika memperbarui transaksi`,
          );
        let newItemStock = Number(newItem.stock);
        if (newType === 'IN') {
          newItemStock = newItemStock + newQty;
        } else {
          if (newItemStock < newQty) {
            throw new BadRequestException(
              `Tidak cukup stock untuk item ${newItemId} untuk melakukan OUT baru (stok saat ini setelah pembalikan=${newItemStock}, permintaan out=${newQty})`,
            );
          }
          newItemStock = newItemStock - newQty;
        }
        await tx.item.update({
          where: { id: newItemId },
          data: { stock: String(newItemStock) },
        });
      }

      // finally update the transaction row
      const updated = await tx.stockTransaction.update({
        where: { id },
        data: {
          itemId: newItemId,
          qty: String(newQty),
          type: newType,
          unitPrice:
            data.unitPrice !== undefined
              ? String(data.unitPrice)
              : existing.unitPrice,
          note: data.note !== undefined ? data.note : existing.note,
          createdBy:
            data.createdBy !== undefined ? data.createdBy : existing.createdBy,
        },
      });

      return updated;
    });
  }

  async remove(id: number): Promise<StockTransaction> {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.stockTransaction.findUnique({ where: { id } });
      if (!existing)
        throw new NotFoundException(`StockTransaction ${id} tidak ditemukan`);

      const item = await tx.item.findUnique({ where: { id: existing.itemId } });
      if (!item)
        throw new NotFoundException(
          `Item ${existing.itemId} tidak ditemukan when sebutin tx`,
        );

      let newStock = Number(item.stock);
      if (existing.type === 'IN') {
        newStock = newStock - Number(existing.qty);
        if (newStock < 0) {
          throw new BadRequestException(
            `Tidak cukup stock untuk item ${existing.itemId} untuk menghapus transaksi IN (stok saat ini=${String(item.stock)}, permintaan out=${String(existing.qty)})`,
          );
        }
      } else {
        newStock = newStock + Number(existing.qty);
      }

      const deleted = await tx.stockTransaction.delete({ where: { id } });

      await tx.item.update({
        where: { id: existing.itemId },
        data: { stock: String(newStock) },
      });

      return deleted;
    });
  }
}
