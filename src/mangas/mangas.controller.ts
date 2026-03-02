import { BadRequestException, Controller, Get, Head, HttpCode, Param, ParseIntPipe, Query, Res } from "@nestjs/common";
import { MangasService } from "./mangas.service";
import { QueryMangaDto } from "./dto/query-manga.dto";
import type { Response } from "express";

@Controller('mangas')
export class MangasController {
  constructor(private readonly mangasService: MangasService) {}

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
}