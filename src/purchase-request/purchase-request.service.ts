import { Injectable } from '@nestjs/common';
import { PurchaseRequest } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreatePurchaseRequestDto,
  UpdatePurchaseRequestDto,
} from './dto/purchase-request.dto';

@Injectable()
export class PurchaseRequestService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<PurchaseRequest[]> {
    return this.prisma.purchaseRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<PurchaseRequest | null> {
    const po = await this.prisma.purchaseRequest.findUnique({
      where: { id },
    });

    if (!po) throw new Error('Purchase Request tidak ditemukan');

    return po;
  }

  async create(data: CreatePurchaseRequestDto): Promise<PurchaseRequest> {
    return this.prisma.purchaseRequest.create({
      data,
    });
  }

  async update(
    id: number,
    data: Partial<UpdatePurchaseRequestDto>,
  ): Promise<PurchaseRequest> {
    return this.prisma.purchaseRequest.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<PurchaseRequest> {
    const target = await this.findOne(id);

    if (!target) throw new Error('Purchase Request tidak ditemukan');

    return this.prisma.purchaseRequest.delete({
      where: { id: target.id },
    });
  }
}
