import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './services.schema'; // ✅ مهم

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  // -------- USER ENDPOINTS --------

  @Get('all')
  findAllByUser(): Promise<Service[]> {
    return this.servicesService.findAllByUser();
  }

  @Get('/one/:slug')
  async findOneByUser(@Param('slug') slug: string): Promise<Service> {
    return this.servicesService.findOneByUser(slug);
  }

  // -------- ADMIN ENDPOINTS --------

  @Post()
  create(
    @Body() createServiceDto: CreateServiceDto,
  ): Promise<{ message: string }> {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  findAll(): Promise<Service[]> {
    return this.servicesService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string): Promise<Service> {
    return this.servicesService.findOneBySlug(slug);
  }

  @Patch(':slug')
  updateBySlug(
    @Param('slug') slug: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<{ message: string }> {
    return this.servicesService.updateBySlug(slug, updateServiceDto);
  }

  @Delete(':slug')
  softDeleteOrRestore(
    @Param('slug') slug: string,
  ): Promise<{ message: string }> {
    return this.servicesService.softDeleteOrRestore(slug);
  }
}
