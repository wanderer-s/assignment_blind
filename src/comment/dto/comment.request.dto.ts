import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';

export class FindCommentRequest {
  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @IsPositive()
  limit: number = 10;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPositive()
  beforeId?: number;
}
