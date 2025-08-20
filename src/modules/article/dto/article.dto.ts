import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsNumber, IsBoolean } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagNames?: string[];
}

export class UpdateArticleDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  published?: boolean;
}

export class GetAllDto {
  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagIds?: string[];
}