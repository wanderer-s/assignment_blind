import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsEnum, IsString, ValidateIf } from 'class-validator';
import { PaginationRequest } from '../../global/dto/request.dto';

export class CreatePostRequest {
  @ApiProperty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsString()
  content: string;
  @ApiProperty()
  @IsString()
  password: string;
  @ApiProperty()
  @IsString()
  writer: string;
}

export class UpdatePostRequest extends PartialType(
  OmitType(CreatePostRequest, ['writer', 'password'] as const),
) {
  @ApiProperty()
  @IsString()
  password: string;
}

export class DeletePostRequest {
  @ApiProperty()
  @IsString()
  password: string;
}

export enum KeywordType {
  TITLE = 'title',
  WRITER = 'writer',
}

export class FindPostRequest extends PaginationRequest {
  @ApiProperty({ required: false, enum: KeywordType })
  @ValidateIf(
    (o: FindPostRequest) =>
      o.keyword !== undefined && o.keyword !== null && o.keyword !== '',
  )
  @IsEnum(KeywordType)
  keywordType: KeywordType;

  @ApiProperty({ required: false })
  @ValidateIf(
    (o: FindPostRequest) =>
      o.keywordType !== undefined && o.keywordType !== null,
  )
  @IsString()
  keyword: string;
}
