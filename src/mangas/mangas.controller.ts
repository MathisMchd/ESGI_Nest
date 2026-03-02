import { BadRequestException, Body, Controller, Delete, Get, Head, HttpCode, Param, ParseIntPipe, Patch, Post, Put, Query, Res } from "@nestjs/common";
import { MangasService } from "./mangas.service";
import { QueryMangaDto } from "./dto/query-manga.dto";
import type { Response } from "express";
import { CreateMangaDto } from "./dto/create-manga.dto";
import { UpdateMangaDto } from "./dto/update-manga.dto";
import { AdminGuard } from "src/common/guards/admin/admin.guard";
import { AdminOnly } from "src/common/decorators/admin.decorator";

@Controller('mangas')
export class MangasController {
  constructor(private readonly mangasService: MangasService) { }

  @Get()
  findAll(@Query() query: QueryMangaDto) {
    return this.mangasService.findAll(query);
  }

  @Get('search')                         // ← déclaré AVANT :id pour éviter le conflit de routing
  search(@Query('q') q: string) {
    if (!q?.trim()) throw new BadRequestException('Query param "q" is required');
    return this.mangasService.search(q.trim());
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {  // ParseIntPipe → 400 si non-entier
    return this.mangasService.findOne(id);
  }

  @Head(':id')
  @HttpCode(200)
  headOne(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    this.mangasService.findOne(id); // lève 404 si absent
    res.status(200).send();         // HEAD : statut uniquement, pas de body
  }

  @AdminOnly()
  @Post()
  @HttpCode(201)
  create(@Body() body: CreateMangaDto) {
    return this.mangasService.create(body);
  }

  @AdminOnly()
  @Put(':id')    // remplacement complet — body doit contenir TOUS les champs
  replace(@Param('id', ParseIntPipe) id: number, @Body() body: CreateMangaDto) {
    return this.mangasService.replace(id, body);
  }

  @AdminOnly()
  @Patch(':id')  // mise à jour partielle — seuls les champs fournis sont modifiés
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateMangaDto) {
    return this.mangasService.update(id, body);
  }

  @AdminOnly()
  @Delete(':id')
  @HttpCode(204)  // pas de body en réponse
  remove(@Param('id', ParseIntPipe) id: number) {
    this.mangasService.remove(id);
  }

}