import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ServicePackage, ServicePackageDocument } from './packages.schema';
import { Model } from 'mongoose';

@Injectable()
export class PackagesService {
  constructor(
    @InjectModel(ServicePackage.name) private PackageModel: Model<ServicePackageDocument>,
  ) {}

  async create(dto: CreatePackageDto): Promise<{ message: string }> {
    const slug = dto.packageName
      .toLowerCase()
      .replace(/\s+/g, '-');

    const exist = await this.PackageModel.findOne({ packageSlug: slug });
    if (exist) {
      throw new BadRequestException('Package already exists');
    }

    const newPackage = new this.PackageModel({
      ...dto,
      packageSlug: slug,
    });

    await newPackage.save();
    return { message: 'Service Package Created successfully' };
  }


  async findAll(): Promise<ServicePackage[]> {
    return this.PackageModel.find().exec();
  }

  // find by slug
async findOneBySlug(slug: string): Promise<ServicePackage> {
  const servicePackage = await this.PackageModel
    .findOne({ packageSlug: slug })
    .exec();

  if (!servicePackage) {
    throw new NotFoundException(`Service with slug "${slug}" not found`);
  }
  return servicePackage;
}


async updateBySlug(
slug: string,
updatePackageDto: UpdatePackageDto
): Promise<{ message: string }> {
  if (updatePackageDto.packageName) {
    updatePackageDto.packageSlug = updatePackageDto.packageName
      .toLowerCase()
      .replace(/\s+/g, '-');
  }

  const servicePackage = await this.PackageModel.findOneAndUpdate(
    { packageSlug: slug },          // ← هنا الشرط صح
    { $set: updatePackageDto },
    { new: true }
  ).exec();

  if (!servicePackage) {
    throw new NotFoundException(`Service Package with slug "${slug}" not found`);
  }

  return { message: 'Service Package Updated Successfully' };
}


async softDeleteOrRestore(slug: string): Promise<{ message: string}> {
  const servicePackage = await this.PackageModel.findOne({ packageSlug: slug}).exec();

  if(!servicePackage){
    throw new NotFoundException(`Package Service with slug "${slug}" not found`)
  }

  if(servicePackage.isDeleted){
    servicePackage.deletedAt = null;
    servicePackage.isDeleted = false;
    await servicePackage.save();
    return { message: 'Service Package restored successfully' };
  }

  servicePackage.deletedAt = new Date();
  servicePackage.isDeleted = true;
  await servicePackage.save();
    return { message: 'Service Package deleted successfully' };
}


// -------- USER FUNCTIONS --------
// find all (excluding deleted)

async findAllByUser(): Promise<ServicePackage[]>{
  return this.PackageModel
  .find({ isDeleted: false })
    .select('-isDeleted -deletedAt -createdAt -updatedAt') 
    .exec();
}


// find one (excluding deleted)
async findOneByUser(slug: string): Promise<ServicePackage> {
  const servicePackage = await this.PackageModel
    .findOne({ packageSlug: slug, isDeleted: false })
    .select('-isDeleted -deletedAt -createdAt -updatedAt') 
    .exec();

  if (!servicePackage) {
    throw new NotFoundException(`servicePackage with slug "${slug}" not found`);
  }

  return servicePackage;
}
}
