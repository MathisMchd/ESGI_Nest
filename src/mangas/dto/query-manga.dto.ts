import { IsOptional, IsString, IsInt, Min, Max, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { MangaStatus } from '../manga-status.interface';

export class QueryMangaDto {
  @IsOptional()
  @Type(() => Number)  // transforme la string "1" du query param en nombre 1
  @IsInt() @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt() @Min(1) @Max(50)
  limit?: number;

  @IsOptional() @IsString()
  genre?: string;

  @IsOptional() @IsEnum(MangaStatus)
  status?: MangaStatus;
}