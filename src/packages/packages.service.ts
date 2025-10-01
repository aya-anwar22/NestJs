import { BadRequestException, Injectable } from '@nestjs/common';
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


  findAll() {
    return `This action returns all packages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} package`;
  }

  update(id: number, updatePackageDto: UpdatePackageDto) {
    return `This action updates a #${id} package`;
  }

  remove(id: number) {
    return `This action removes a #${id} package`;
  }
}
