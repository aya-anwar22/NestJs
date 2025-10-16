import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { ServicePackage } from './packages.schema';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  // user
  @Get('all')
    async findAllByUser(): Promise<ServicePackage[]> {
      return this.packagesService.findAllByUser();
    }

  @Get('/one/:slug')
    async findOneByUser(@Param('slug') slug: string): Promise<ServicePackage> {
      return this.packagesService.findOneByUser(slug);
    }

  @Post()
  create(@Body() createPackageDto: CreatePackageDto) : Promise<{message: string}>{
    return this.packagesService.create(createPackageDto);
  }

  @Get()
  findAll(): Promise<ServicePackage[]> {
    return this.packagesService.findAll();
  }

  @Get(':slug')
  findOneBySlug(@Param('slug') slug: string) {
    return this.packagesService.findOneBySlug(slug);
  }

  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() updatePackageDto: UpdatePackageDto) {
    return this.packagesService.updateBySlug(slug, updatePackageDto);
  }

  @Delete(':slug')
  async softDeleteOrRestore(@Param('slug') slug: string): Promise<{ message: string }> {
    return this.packagesService.softDeleteOrRestore(slug);
  }
}
