import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoryService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './categories.schema';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoryService) {}


  //// user ////
  @Get('all')
  async findAllByUser(): Promise<Category[]> {
    return this.categoriesService.findAllByUser();
  }

  @Get('/one/:slug')
  async findOneByUser(@Param('slug') slug: string): Promise<Category> {
    return this.categoriesService.findOneByUser(slug);
  }

  // admin
  @Post()
  async create(@Body() dto: CreateCategoryDto): Promise<{ message: string }> {
    return this.categoriesService.create(dto);
  }


  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string): Promise<Category> {
    return this.categoriesService.findOneBySlug(slug);
  }

  @Patch(':slug')
  async update(
    @Param('slug') slug: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<{ message: string }> {
    return this.categoriesService.updateBySlug(slug, updateCategoryDto);
  }


  @Delete(':slug')
  async softDeleteOrRestore(@Param('slug') slug: string): Promise<{ message: string }> {
    return this.categoriesService.softDeleteOrRestore(slug);
  }

 
  
}
