import { Transaction } from 'src/transaction/entities/transaction.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn({
    name: 'category_id',
  })
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => User, (user) => user.categories)
  // связь много к одному.
  // То есть категория может иметь множество пользователей
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions: Transaction[];

  @CreateDateColumn() // дата создания пользователя
  createdAt: Date;

  @UpdateDateColumn() // дата обновления пользователя
  updatedAt: Date;
}
