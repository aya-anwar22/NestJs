import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDevelopmentStageDto } from './dto/create-development-stage.dto';
import { UpdateDevelopmentStageDto } from './dto/update-development-stage.dto';
import { DevelopmentStage, DevelopmentStageDocument } from './development-stage.schema';

@Injectable()
export class DevelopmentStageService {
constructor(
@InjectModel(DevelopmentStage.name)
private stageModel: Model<DevelopmentStageDocument>,
) {}

// Create new stage
async create(dto: CreateDevelopmentStageDto): Promise<{ message: string }> {
  const slug = dto.stageName
  .toLowerCase()
  .replace(/\s+/g, '-');

const exist = await this.stageModel.findOne({ stageSlug: slug});


if (exist) {
  throw new BadRequestException(
    `Stage ${dto.stageName} already exists for this service`,
  );
}

const newStage = new this.stageModel({
  ...dto,
  stageSlug: slug,
});
await newStage.save();
return { message: 'Development stage created successfully' };

}

// Find all
async findAll(): Promise<DevelopmentStage[]> {
return this.stageModel.find().exec();
}

// Find one by id
async findOneBySlug(slug: string): Promise<DevelopmentStage> {
const stage = await this.stageModel.findOne({stageSlug : slug}).exec();

if (!stage) {
  throw new NotFoundException(`Development stage with slug "${slug}" not found`);
}
return stage;
}

// Update stage
async updateBySlug(
slug: string,
updateDto: UpdateDevelopmentStageDto,
): Promise<{ message: string }> {
  if(updateDto.stageName){
    updateDto.stageSlug = updateDto.stageName
    .toLowerCase()
    .replace(/\s+/g, '-');
  }
const stage = await this.stageModel
  .findOneAndUpdate({ stageSlug: slug }, { $set: updateDto }, { new: true })
  .exec();



if (!stage) {
  throw new NotFoundException(`Development stage with slug "${slug}" not found`);
}

return { message: 'Development stage updated successfully' };


}

// Soft delete / restore
async softDeleteOrRestore(slug: string): Promise<{ message: string }> {
const stage = await this.stageModel.findOne({ stageSlug: slug }).exec();

if(!stage){
  throw new NotFoundException(`Development stage with slug "${slug}" not found`);
}

// Soft delete or restore logic
if(stage.isDeleted){
  stage.isDeleted = false;
  stage.deletedAt = null;
} else {
  stage.isDeleted = true;
  stage.deletedAt = new Date();
}

await stage.save();
return { message: stage.isDeleted ? 'Development stage deleted' : 'Development stage restored' };


}


// -------- USER FUNCTIONS --------

// Find all stages (excluding deleted)
async findAllByUser(): Promise<DevelopmentStage[]> {
  return this.stageModel
    .find({ isDeleted: false })
    .select('-isDeleted -deletedAt -createdAt -updatedAt') // نخفي الحقول الداخلية
    .exec();
}

// Find one stage by id (excluding deleted)
async findOneByUser(slug: string): Promise<DevelopmentStage> {
  const stage = await this.stageModel
    .findOne({ stageSlug: slug, isDeleted: false })
    .select('-isDeleted -deletedAt -createdAt -updatedAt')
    .exec();

  if (!stage) {
    throw new NotFoundException(`Development stage with slug "${slug}" not found`);
  }

  return stage;
}


}
