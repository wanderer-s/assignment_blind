import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponse<T> {
  @ApiProperty()
  items: T[];

  @ApiProperty()
  count: number;

  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  totalPage: number;

  constructor(items: T[], totalCount: number, page: number, limit: number) {
    this.items = items;
    this.count = items.length;
    this.page = page;
    this.totalCount = totalCount;
    this.totalPage = Math.ceil(totalCount / limit);
  }
}
