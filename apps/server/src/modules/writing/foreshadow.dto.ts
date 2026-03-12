import { IsString, IsOptional, IsBoolean, IsIn } from 'class-validator';

export class CreateForeshadowDto {
  @IsString()
  description!: string;

  @IsString()
  plantedChapterId!: string;

  @IsOptional()
  @IsString()
  expectedResolveChapterId?: string;

  @IsOptional()
  @IsIn(['high', 'medium', 'low'])
  priority?: 'high' | 'medium' | 'low';

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateForeshadowDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  plantedChapterId?: string;

  @IsOptional()
  @IsString()
  expectedResolveChapterId?: string;

  @IsOptional()
  @IsBoolean()
  isResolved?: boolean;

  @IsOptional()
  @IsIn(['high', 'medium', 'low'])
  priority?: 'high' | 'medium' | 'low';

  @IsOptional()
  @IsString()
  notes?: string;
}