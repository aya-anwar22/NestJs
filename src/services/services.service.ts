import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument } from './services.schema';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name) private ServicesModel: Model<ServiceDocument>, // ✅ استخدمي Document
  ) {}

  // Create Service
  async create(dto: CreateServiceDto): Promise<{ message: string }> {
    const slug = dto.serviceName
      .toLowerCase()
      .replace(/\s+/g, '-');

    const exist = await this.ServicesModel.findOne({ serviceSlug: slug });
    if (exist) {
      throw new BadRequestException('Service already exists');
    }

    const service = new this.ServicesModel({
      ...dto,
      serviceSlug: slug,
    });

    await service.save();
    return { message: 'Service Created Successfully' };
  }

  async findAll(): Promise<Service[]> {
    return this.ServicesModel.find().exec();
  }

  async findOneBySlug(slug: string): Promise<Service> {
    const service = await this.ServicesModel.findOne({ serviceSlug: slug }).exec();

    if (!service) {
      throw new NotFoundException(`Service with slug ${slug} not found`);
    }
    return service;
  }

  async updateBySlug(slug: string, updateServiceDto: UpdateServiceDto): Promise<{ message: string }> {
    if (updateServiceDto.serviceName) {
      updateServiceDto.serviceSlug = updateServiceDto.serviceName
        .toLowerCase()
        .replace(/\s+/g, '-');
    }

    const service = await this.ServicesModel.findOneAndUpdate(
      { serviceSlug: slug },
      { $set: updateServiceDto },
      { new: true },
    ).exec();

    if (!service) {
      throw new NotFoundException(`Service with slug "${slug}" not found`);
    }

    return { message: 'Service Updated Successfully' };
  }

  async softDeleteOrRestore(slug: string): Promise<{ message: string }> {
    const service = await this.ServicesModel.findOne({ serviceSlug: slug }).exec();
    if (!service) {
      throw new NotFoundException(`Service with slug "${slug}" not found`);
    }

    if (service.isDeleted) {
      service.deletedAt = null;
      service.isDeleted = false;
      await service.save();
      return { message: 'Service restored Successfully' };
    }

    service.deletedAt = new Date();
    service.isDeleted = true;
    await service.save();
    return { message: 'Service deleted Successfully' };
  }

  // -------- USER FUNCTIONS --------
  async findAllByUser(): Promise<Service[]> {
    return this.ServicesModel.find({ isDeleted: false })
      .select('-isDeleted -deletedAt -createdAt -updatedAt')
      .exec();
  }

  async findOneByUser(slug: string): Promise<Service> {
    const service = await this.ServicesModel.findOne({ serviceSlug: slug, isDeleted: false })
      .select('-isDeleted -deletedAt -createdAt -updatedAt')
      .exec();

    if (!service) {
      throw new NotFoundException(`Service with slug "${slug}" not found`);
    }
    return service;
  }
}
