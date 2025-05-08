import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, IsString } from 'class-validator';

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

export class CreateCommentRequest {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsString()
  writer: string;
}
