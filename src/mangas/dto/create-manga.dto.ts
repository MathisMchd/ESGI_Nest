import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty,
         IsEnum, IsInt, Min, Max, MaxLength } from 'class-validator';
import { MangaStatus } from '../manga-status';



export class CreateMangaDto {
  @IsString() @IsNotEmpty() @MaxLength(200)
  title: string;

  @IsString() @IsNotEmpty() @MaxLength(200)
  author: string;

  @IsArray() @ArrayNotEmpty() @IsString({ each: true })
  genres: string[];

  @IsEnum(MangaStatus, { message: 'status must be one of: ongoing, completed, hiatus' })
  status: MangaStatus;

  @IsInt() @Min(1)
  volumes: number;

  @IsInt() @Min(1900) @Max(new Date().getFullYear())
  startYear: number;

  @IsString() @IsNotEmpty() @MaxLength(200)
  publisher: string;

  @IsString() @IsNotEmpty() @MaxLength(2000)
  synopsis: string;
}