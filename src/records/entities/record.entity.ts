import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Category } from 'src/categories/entities/category.entity';
import { OperationType } from 'src/common/operation-type.enum';

@Entity()
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  summa: number;

  @Column({
    type: 'enum',
    enum: OperationType,
    default: OperationType.OUTCOME,
  })
  operationType: OperationType;

  @CreateDateColumn()
  createdDate: Date

  @UpdateDateColumn()
  updatedDate: Date

  @ManyToOne(() => Category, (category) => category.records, {eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
  category: Category;
}

