import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Keyword } from '../entity/keyword.entity';

@Injectable()
export class KeywordRepository extends Repository<Keyword> {
  constructor(dataSource: DataSource) {
    super(Keyword, dataSource.createEntityManager());
  }
}
