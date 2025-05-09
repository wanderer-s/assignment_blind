import { Column, Entity } from 'typeorm';
import { RootEntity } from '../../global/entity/root.entity';

@Entity()
export class Keyword extends RootEntity {
  @Column()
  keyword: string;
  @Column()
  writer: string;
}
