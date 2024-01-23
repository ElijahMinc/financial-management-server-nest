import { Category } from 'src/category/entities/category.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity() // для сущностей
export class User {
  @PrimaryGeneratedColumn() // когда бдует создаваться какой-то пользовать, автоматически создай для него айди
  id: number;

  @Column() //просто отдельная колонка
  email: string;

  @Column() //просто отдельная колонка
  password: string;

  @OneToMany(
    () => Category, // мы привязываемся к категориями
    (category) => category.user, // из категорий указываем взаимосвязь
    {
      onDelete: 'CASCADE', // CASCADE - удаляем пользователся, а значит и удаляем категорию
      // указываем, что будет сделано с Category в случае, если User будет удален
    },
  )
  // связь один ко многим.
  // То есть пользователь может иметь множество категорий
  categories: Category[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @CreateDateColumn() // дата создания пользователя
  createdAt: Date;

  @UpdateDateColumn() // дата обновления пользователя
  updatedAt: Date;
}
