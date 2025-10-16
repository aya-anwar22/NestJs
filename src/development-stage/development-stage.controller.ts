import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DevelopmentStageService } from './development-stage.service';
import { CreateDevelopmentStageDto } from './dto/create-development-stage.dto';
import { UpdateDevelopmentStageDto } from './dto/update-development-stage.dto';

@Controller('development-stage')
export class DevelopmentStageController {
  constructor(private readonly stageService: DevelopmentStageService) {}

  // -------- USER FUNCTIONS (EXCLUDING DELETED) --------

  @Get('all')
  findAllByUser() {
    return this.stageService.findAllByUser();
  }

  @Get('one/:slug')
  findOneByUser(@Param('slug') slug: string) {
    return this.stageService.findOneByUser(slug);
  }



  // -------- ADMIN / FULL CRUD --------

  @Post()
  create(@Body() createStageDto: CreateDevelopmentStageDto) {
    return this.stageService.create(createStageDto);
  }

  @Get()
  findAll() {
    return this.stageService.findAll();
  }

  @Get(':slug')
  findOneBySlug(@Param('slug') slug: string) {
    return this.stageService.findOneBySlug(slug);
  }

  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() updateStageDto: UpdateDevelopmentStageDto) {
    return this.stageService.updateBySlug(slug, updateStageDto);
  }

  @Delete(':slug')
  softDeleteOrRestore(@Param('slug') slug: string) {
    return this.stageService.softDeleteOrRestore(slug);
  }

  
}
