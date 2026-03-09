import { IsString, IsOptional, IsInt, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOutlineNodeDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsString()
  chapterId?: string;
}

export class UpdateOutlineNodeDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsString()
  chapterId?: string;
}

export class ReorderOutlineNodeDto {
  @IsString()
  id!: string;

  @IsOptional()
  @IsString()
  parentId?: string | null;

  @IsInt()
  order!: number;
}

export class ReorderOutlineDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderOutlineNodeDto)
  nodes!: ReorderOutlineNodeDto[];
}

export class OutlineNodeResponseDto {
  id!: string;
  title!: string;
  content: string | null = null;
  order!: number;
  parentId: string | null = null;
  chapterId: string | null = null;
  children?: OutlineNodeResponseDto[];
  createdAt!: Date;
  updatedAt!: Date;
}

export class OutlineTreeResponseDto {
  workId!: string;
  roots!: OutlineNodeResponseDto[];
}
