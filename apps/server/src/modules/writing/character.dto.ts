import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateCharacterDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  aliases?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  appearance?: string;

  @IsOptional()
  @IsString()
  personality?: string;

  @IsOptional()
  @IsString()
  faction?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}

export class UpdateCharacterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  aliases?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  appearance?: string;

  @IsOptional()
  @IsString()
  personality?: string;

  @IsOptional()
  @IsString()
  faction?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}

export class CreateCharacterRelationDto {
  @IsString()
  fromId!: string;

  @IsString()
  toId!: string;

  @IsString()
  relationType!: string;
}

export class UpdateCharacterPositionDto {
  @IsNumber()
  x!: number;

  @IsNumber()
  y!: number;
}