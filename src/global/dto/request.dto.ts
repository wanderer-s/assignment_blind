import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationRequest {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsPositive()
  page: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @IsPositive()
  limit: number = 10;

  get skip() {
    return (this.page - 1) * this.limit;
  }
}
