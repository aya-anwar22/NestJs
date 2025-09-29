import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  private toResponseDto(user: UserDocument): UserResponseDto{
    return{
       id: user._id.toString(),
      userName: user.userName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      countryCode: user.countryCode,
      role: user.role,
      isVerified: user.isVerified,
    }
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userModel.find().exec();
    return users.map(user => this.toResponseDto(user))
  }

async findByEmail(email: string): Promise<UserResponseDto> {
  const user = await this.userModel.findOne({ email, isDeleted: false }).exec();
  if (!user) {
    throw new NotFoundException(`User with email ${email} not found`);
  }
  return this.toResponseDto(user);
}


  async updateByEmail(
    email: string,
    updateDate: Partial<User>
  ): Promise<{ message: string }> {
    const user = await this.userModel.findOneAndUpdate(
      { email },
      updateDate,
      { new: true }
    ).exec();

    if (!user) {
      throw new NotFoundException(`User with Email ${email} not found`);
    }

    return { message: 'Role User Update Successfully' };
  }

  async toggleSoftDeleteUser(email: string): Promise<{ message: string }> {
  const user = await this.userModel.findOne({ email }).exec();

  if (!user) {
    throw new NotFoundException(`User with email ${email} not found`);
  }

  if (user.isDeleted) {
    user.isDeleted = false;
    user.deletedAt = undefined;
    await user.save();
    return { message: 'User Restored Successfully' };
  } else {
    user.isDeleted = true;
    user.deletedAt = new Date();
    await user.save();
    return { message: 'User Deleted Successfully' };
  }
}



async softDeleteUserById(userId: string): Promise<{ message: string }> {
  const user = await this.userModel.findOneAndUpdate(
    { _id: userId, isDeleted: false },
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  ).exec();

  if (!user) {
    throw new NotFoundException(`User with id ${userId} not found`);
  }

  return { message: 'User Deleted Successfully' };
}



// -------- USER FUNCTIONS --------
  async getProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.userModel
      .findOne({ _id: userId, isDeleted: false })
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toResponseDto(user);
  }

  async updateProfile(
    userId: string,
    updateData: Partial<User>,
  ): Promise<{ message: string; user: UserResponseDto }> {
    const user = await this.userModel
      .findOneAndUpdate({ _id: userId, isDeleted: false }, updateData, {
        new: true,
      })
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'Profile updated successfully',
      user: this.toResponseDto(user),
    };
  }


}




