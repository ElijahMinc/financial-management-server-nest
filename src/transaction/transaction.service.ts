import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionService: Repository<Transaction>, // private jwtService: JwtService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, id: number) {
    const newTransaction = {
      title: createTransactionDto.title,
      amount: createTransactionDto.amount,
      type: createTransactionDto.type,
      user: { id },
      category: {
        id: +createTransactionDto.category,
      },
    };

    if (!newTransaction)
      throw new BadRequestException('Something went wrong...');

    return await this.transactionService.save(newTransaction);
  }

  async findAll(id: number) {
    return await this.transactionService.find({
      where: {
        user: {
          id,
        },
      },
      relations: {
        category: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(transactionId: number) {
    return await this.transactionService.findOne({
      where: {
        id: transactionId,
      },
      relations: {
        user: true,
      },
    });
  }

  async remove(id: number) {
    const transaction = await this.transactionService.findOne({
      where: {
        id,
      },
    });

    if (!transaction) throw new BadRequestException('Something went wrong...');

    return await this.transactionService.remove(transaction);
  }

  async findAllWithPagination(id: number, page: number, limit: number) {
    const transactions = await this.transactionService.find({
      where: {
        user: {
          id,
        },
      },
      relations: {
        category: true,
        user: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    return transactions;
  }

  async findAllByType(userId: number, type: string) {
    const transactions = await this.transactionService.find({
      where: {
        user: { id: userId },
        type,
      },
    });

    const total = transactions.reduce((acc, obj) => acc + obj.amount, 0);

    return total;
  }
}
