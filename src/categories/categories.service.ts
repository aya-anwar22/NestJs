import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './categories.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  // Create category
async create(dto: CreateCategoryDto): Promise<{ message: string }> {
  const slug = dto.categoryName
    .toLowerCase()
    .replace(/\s+/g, '-');

  const exist = await this.categoryModel.findOne({ categorySlug: slug });
  if (exist) {
    throw new BadRequestException('Category already exists');
  }

  const category = new this.categoryModel({
    ...dto,
    categorySlug: slug,
  });

  await category.save();
  return { message: 'Category Created Successfully' };
} 

// Find all 
async findAll(): Promise<Category[]> {
  return this.categoryModel.find().exec();
}

  // Find one by Slug
async findOneBySlug(slug: string): Promise<Category> {
  const category = await this.categoryModel
    .findOne({ categorySlug: slug })
    .exec();

  if (!category) {
    throw new NotFoundException(`Category with slug "${slug}" not found`);
  }

  return category;
}

  // Update category
async updateBySlug(slug: string, updateCategoryDto: UpdateCategoryDto): Promise<{ message: string }>{
  if (updateCategoryDto.categoryName) {
    updateCategoryDto.categorySlug = updateCategoryDto.categoryName
      .toLowerCase()
      .replace(/\s+/g, '-');
  }

  const category = await this.categoryModel.findOneAndUpdate(
    { categorySlug: slug },
    { $set: updateCategoryDto },   
    { new: true },
  ).exec();

  if (!category) {
    throw new NotFoundException(`Category with slug "${slug}" not found`);
  }
  return { message: 'Category Updated Successfully' };
}

  // Soft delete
  async softDeleteOrRestore(slug: string): Promise<{ message: string }> {
    const category = await this.categoryModel.findOne({ categorySlug: slug }).exec();

    if (!category) {
      throw new NotFoundException(`Category with slug "${slug}" not found`);
    }

    // لو محذوف → نعمله restore
    if (category.isDeleted) {
      category.deletedAt = null;
      category.isDeleted = false;
      await category.save();
      return { message: 'Category restored successfully' };
    }

    // لو مش محذوف → نعمله soft delete
    category.deletedAt = new Date();
    category.isDeleted = true
    await category.save();
    return { message: 'Category deleted successfully' };
  }


  // -------- USER FUNCTIONS --------
  // find all (excluding deleted)
  async findAllByUser(): Promise<Category[]> {
  return this.categoryModel
    .find({ isDeleted: false })
    .select('-isDeleted -deletedAt -createdAt -updatedAt') 
    .exec();
}

// find one (excluding deleted)
async findOneByUser(slug: string): Promise<Category> {
  const category = await this.categoryModel
    .findOne({ categorySlug: slug, isDeleted: false })
    .select('-isDeleted -deletedAt -createdAt -updatedAt') 
    .exec();

  if (!category) {
    throw new NotFoundException(`Category with slug "${slug}" not found`);
  }

  return category;
}
}
