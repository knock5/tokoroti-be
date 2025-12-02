import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StockOpname } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateStockOpnameDto,
  UpdateStockOpnameDto,
  UpdateStockOpnameItemDto,
} from './dto/stock-opname.dto';

@Injectable()
export class StockOpnameService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<StockOpname[]> {
    return this.prisma.stockOpname.findMany({
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: number): Promise<StockOpname | null> {
    const res = await this.prisma.stockOpname.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!res) throw new NotFoundException('Stock opname tidak ditemukan');

    return res;
  }

  // tambah stock opname dengan auto adjust stok di gudang
  async createWithAutoAdjust(data: CreateStockOpnameDto): Promise<StockOpname> {
    const { date, createdBy, note, items, autoAdjust = true } = data;

    return this.prisma.$transaction(async (tx) => {
      // create stock opname record
      const opname = await tx.stockOpname.create({
        data: {
          date: date || new Date(),
          createdBy: createdBy || null,
          note: note || null,
        },
      });

      // create stock opname items
      const createdItems = await Promise.all(
        (items || []).map((it) =>
          tx.stockOpnameItem.create({
            data: {
              stockOpnameId: opname.id,
              itemId: it.itemId,
              qtyPhysical: String(it.qtyPhysical),
              note: it.note || null,
            },
          }),
        ),
      );

      if (!autoAdjust) {
        const result = await tx.stockOpname.findUnique({
          where: { id: opname.id },
          include: { items: true },
        });
        if (!result)
          throw new NotFoundException('Stock opname tidak ditemukan');
        return result;
      }

      // lakukan penyesuaian stok berdasarkan hasil stock opname
      for (const createdItem of createdItems) {
        // ambil data item terkait
        const item = await tx.item.findUnique({
          where: { id: createdItem.itemId },
        });

        if (!item) throw new NotFoundException('Item tidak ditemukan');

        const currentStock = Number(item.stock);
        const phys = Number(String(createdItem.qtyPhysical));
        const diff = phys - currentStock; // selisih antara fisik dan sistem

        if (diff === 0) continue; // tidak ada selisih, skip adjust

        if (diff > 0) {
          // diff > 0 = penambahan stok
          await tx.stockTransaction.create({
            data: {
              itemId: createdItem.itemId,
              qty: String(diff),
              type: 'IN',
              note: `Opname#${opname.id} koreksi (physical ${phys} vs system ${currentStock})`,
              createdBy: createdBy ?? null,
            },
          });

          await tx.item.update({
            where: { id: createdItem.itemId },
            data: {
              stock: String(currentStock + diff),
            },
          });
        } else {
          // diff < 0 = pengurangan stok
          const outQty = Math.abs(diff);

          if (currentStock < outQty) {
            throw new BadRequestException(
              `Tidak dapat melakukan pengurangan stok item ID ${createdItem.itemId} sebesar ${outQty} karena stok saat ini hanya ${currentStock}`,
            );
          }

          await tx.stockTransaction.create({
            data: {
              itemId: createdItem.itemId,
              qty: String(outQty),
              type: 'OUT',
              note: `Opname#${opname.id} koreksi (physical ${phys} vs system ${currentStock})`,
              createdBy: createdBy ?? null,
            },
          });

          await tx.item.update({
            where: { id: createdItem.itemId },
            data: {
              stock: String(currentStock - outQty),
            },
          });
        }
      }

      // return opname dengan items
      const result = await tx.stockOpname.findUnique({
        where: { id: opname.id },
        include: { items: true },
      });
      if (!result) throw new NotFoundException('Stock opname tidak ditemukan');
      return result;
    });
  }

  async update(id: number, data: UpdateStockOpnameDto): Promise<StockOpname> {
    const existing = await this.prisma.stockOpname.findUnique({
      where: { id },
    });

    if (!existing)
      throw new NotFoundException(`StockOpname ${id} tidak ditemukan`);

    const { date, createdBy, note, items, autoAdjust } = data;

    return this.prisma.$transaction(async (tx) => {
      // 1) update header
      const payload: Partial<StockOpname> = {};

      if (date !== undefined) payload.date = date;
      if (createdBy !== undefined) payload.createdBy = createdBy;
      if (note !== undefined) payload.note = note;

      await tx.stockOpname.update({ where: { id }, data: payload });

      // 2) jika tidak ada item yg diupdate, return saja
      if (!items) {
        const result = await tx.stockOpname.findUnique({
          where: { id },
          include: { items: true },
        });

        if (!result)
          throw new NotFoundException('Stock opname tidak ditemukan');

        return result;
      }

      // 3) delete old items and recreate
      await tx.stockOpnameItem.deleteMany({ where: { stockOpnameId: id } });

      const createdItems = await Promise.all(
        (items as UpdateStockOpnameItemDto[]).map((it) => {
          if (!it.itemId) {
            throw new BadRequestException(
              'itemId wajib diisi untuk setiap item',
            );
          }

          return tx.stockOpnameItem.create({
            data: {
              stockOpnameId: id,
              itemId: it.itemId,
              qtyPhysical: String(it.qtyPhysical),
              note: it.note ?? null,
            },
          });
        }),
      );

      // 4) jika autoAdjust = false, return saja tanpa penyesuaian stok
      if (autoAdjust === false) {
        const result = await tx.stockOpname.findUnique({
          where: { id },
          include: { items: true },
        });

        if (!result)
          throw new NotFoundException('Stock opname tidak ditemukan');

        return result;
      }

      // 5
      for (const createdItem of createdItems) {
        const item = await tx.item.findUnique({
          where: { id: createdItem.itemId },
        });

        if (!item) {
          throw new NotFoundException(
            `Item ${createdItem.itemId} not found during opname update`,
          );
        }

        const currentStock = Number(String(item.stock));
        const phys = Number(String(createdItem.qtyPhysical));
        const diff = phys - currentStock;

        if (diff === 0) continue;

        if (diff > 0) {
          // create IN and update stock
          await tx.stockTransaction.create({
            data: {
              itemId: createdItem.itemId,
              qty: String(diff),
              type: 'IN',
              note: `Opname#${id} koreksi (update) physical ${phys} vs system ${currentStock}`,
              createdBy: (createdBy as number | null | undefined) ?? null,
            },
          });

          await tx.item.update({
            where: { id: createdItem.itemId },
            data: { stock: String(currentStock + diff) },
          });
        } else {
          // OUT
          const outQty = Math.abs(diff);

          if (currentStock < outQty) {
            throw new BadRequestException(
              `Tidak dapat melakukan koreksi OUT untuk item ${createdItem.itemId} selama update: stok sistem ${currentStock} < koreksi ${outQty}`,
            );
          }

          await tx.stockTransaction.create({
            data: {
              itemId: createdItem.itemId,
              qty: String(outQty),
              type: 'OUT',
              note: `Opname#${id} koreksi (update) physical ${phys} vs system ${currentStock}`,
              createdBy: (createdBy as number | null | undefined) ?? null,
            },
          });

          await tx.item.update({
            where: { id: createdItem.itemId },
            data: { stock: String(currentStock - outQty) },
          });
        }
      }

      const result = await tx.stockOpname.findUnique({
        where: { id },
        include: { items: true },
      });
      if (!result) throw new NotFoundException('Stock opname tidak ditemukan');

      return result;
    });
  }

  async remove(id: number, revertAdjustment = false): Promise<StockOpname> {
    const existing = await this.prisma.stockOpname.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existing)
      throw new NotFoundException(`StockOpname ${id} tidak ditemukan`);
    if (!revertAdjustment) {
      // langsung hapus tanpa revert penyesuaian stok
      return this.prisma.$transaction(async (tx) => {
        await tx.stockOpnameItem.deleteMany({ where: { stockOpnameId: id } });

        return tx.stockOpname.delete({ where: { id } });
      });
    }

    // lakukan revert penyesuaian stok sebelum hapus
    return this.prisma.$transaction(async (tx) => {
      // cari semua item terkait di note
      const relatedTxs = await tx.stockTransaction.findMany({
        where: {
          note: { contains: `Opname#${id} koreksi` },
        },
        orderBy: { createdAt: 'desc' },
      });

      // setiap transaksi stok, lakukan revert
      for (const st of relatedTxs) {
        const item = await tx.item.findUnique({ where: { id: st.itemId } });

        if (!item)
          throw new NotFoundException(`Item ${st.itemId} tidak ditemukan`);

        const currentStock = Number(String(item.stock));
        const qty = Number(String(st.qty));

        if (st.type === 'IN') {
          // revert IN = kurangi stok
          const newStock = currentStock - qty;

          if (newStock < 0)
            throw new BadRequestException(
              `Tidak dapat mengurangi stok item ${st.itemId} sebesar ${qty} selama revert hapus opname ${id} karena stok saat ini hanya ${currentStock}`,
            );

          // buat transaksi OUT untuk revert
          await tx.stockTransaction.create({
            data: {
              itemId: st.itemId,
              qty: String(qty),
              type: 'OUT',
              note: `Revert hapus Opname#${id} dari transaksi ${st.id}`,
              createdBy: null,
            },
          });

          await tx.item.update({
            where: { id: st.itemId },
            data: { stock: String(newStock) },
          });
        } else {
          // revert OUT = tambah stok
          await tx.stockTransaction.create({
            data: {
              itemId: st.itemId,
              qty: String(qty),
              type: 'IN',
              note: `Revert hapus Opname#${id} dari transaksi ${st.id}`,
              createdBy: null,
            },
          });

          await tx.item.update({
            where: { id: st.itemId },
            data: { stock: String(currentStock + qty) },
          });
        }
      }

      // hapus semua item opname
      await tx.stockOpnameItem.deleteMany({ where: { stockOpnameId: id } });

      // hapus stock opname
      return tx.stockOpname.delete({ where: { id } });
    });
  }
}
