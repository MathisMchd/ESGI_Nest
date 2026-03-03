import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Head,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Res
} from "@nestjs/common";
import { MangasService } from "./mangas.service";
import { QueryMangaDto } from "./dto/query-manga.dto";
import type { Response } from "express";
import { CreateMangaDto } from "./dto/create-manga.dto";
import { UpdateMangaDto } from "./dto/update-manga.dto";
import { AdminOnly } from "src/common/decorators/admin.decorator";
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
  ApiParam,
  ApiBody
} from "@nestjs/swagger";

@ApiTags('Mangas')
@ApiSecurity('api-key')
@Controller('mangas')
export class MangasController {
  constructor(private readonly mangasService: MangasService) {}


  @ApiOperation({ summary: 'Liste paginée des mangas' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Liste retournée avec pagination' })
  @ApiResponse({ status: 401, description: 'Header X-API-Key absent ou invalide' })
  @Get()
  findAll(@Query() query: QueryMangaDto) {
    return this.mangasService.findAll(query);
  }


  @ApiOperation({ summary: 'Recherche de mangas par mot-clé' })
  @ApiQuery({ name: 'q', required: true, type: String, example: 'naruto' })
  @ApiResponse({ status: 200, description: 'Résultats de recherche' })
  @ApiResponse({ status: 400, description: 'Paramètre q manquant' })
  @Get('search')
  search(@Query('q') q: string) {
    if (!q?.trim()) throw new BadRequestException('Query param "q" is required');
    return this.mangasService.search(q.trim());
  }


  @ApiOperation({ summary: 'Récupérer un manga par son ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Manga trouvé' })
  @ApiResponse({ status: 404, description: 'Manga introuvable' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mangasService.findOne(id);
  }


  @ApiOperation({ summary: 'Vérifier l’existence d’un manga (HEAD)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Manga existe' })
  @ApiResponse({ status: 404, description: 'Manga introuvable' })
  @Head(':id')
  @HttpCode(200)
  headOne(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    this.mangasService.findOne(id);
    res.status(200).send();
  }


  @ApiOperation({ summary: 'Créer un manga (Admin uniquement)' })
  @ApiBody({ type: CreateMangaDto })
  @ApiResponse({ status: 201, description: 'Manga créé avec succès' })
  @ApiResponse({ status: 403, description: 'Accès réservé aux admins' })
  @AdminOnly()
  @Post()
  @HttpCode(201)
  create(@Body() body: CreateMangaDto) {
    return this.mangasService.create(body);
  }


  @ApiOperation({ summary: 'Remplacer complètement un manga (Admin uniquement)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: CreateMangaDto })
  @ApiResponse({ status: 200, description: 'Manga remplacé' })
  @ApiResponse({ status: 404, description: 'Manga introuvable' })
  @AdminOnly()
  @Put(':id')
  replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateMangaDto
  ) {
    return this.mangasService.replace(id, body);
  }


  @ApiOperation({ summary: 'Mettre à jour partiellement un manga (Admin uniquement)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: UpdateMangaDto })
  @ApiResponse({ status: 200, description: 'Manga mis à jour' })
  @ApiResponse({ status: 404, description: 'Manga introuvable' })
  @AdminOnly()
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateMangaDto
  ) {
    return this.mangasService.update(id, body);
  }

  @ApiOperation({ summary: 'Supprimer un manga (Admin uniquement)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 204, description: 'Manga supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Manga introuvable' })
  @AdminOnly()
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    this.mangasService.remove(id);
  }
}