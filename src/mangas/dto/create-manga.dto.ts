import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  IsEnum,
  IsInt,
  Min,
  Max,
  MaxLength
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MangaStatus } from '../manga-status.interface';

export class CreateMangaDto {

  @ApiProperty({
    example: 'Naruto',
    maxLength: 200,
    description: 'Titre du manga'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;


  @ApiProperty({
    example: 'Masashi Kishimoto',
    maxLength: 200,
    description: 'Auteur du manga'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  author: string;


  @ApiProperty({
    example: ['Action', 'Aventure', 'Shōnen'],
    description: 'Liste des genres',
    type: [String]
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  genres: string[];


  @ApiProperty({
    example: 'ongoing',
    enum: MangaStatus,
    description: 'Statut du manga'
  })
  @IsEnum(MangaStatus, {
    message: 'status must be one of: ongoing, completed, hiatus'
  })
  status: MangaStatus;


  @ApiProperty({
    example: 72,
    minimum: 1,
    description: 'Nombre total de volumes'
  })
  @IsInt()
  @Min(1)
  volumes: number;


  @ApiProperty({
    example: 1999,
    minimum: 1900,
    maximum: new Date().getFullYear(),
    description: 'Année de début de publication'
  })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  startYear: number;


  @ApiProperty({
    example: 'Shueisha',
    maxLength: 200,
    description: 'Maison d’édition'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  publisher: string;


  @ApiProperty({
    example: 'Un jeune ninja rêve de devenir Hokage...',
    maxLength: 2000,
    description: 'Résumé du manga'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  synopsis: string;
}