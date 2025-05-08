import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class RootEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
