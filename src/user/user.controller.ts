import { Body, Controller, Delete, Get, Param, Patch, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './user.schema';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Request } from 'express';
import { UpdateProfileDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('me')
  async getProfile(@Req() req: Request) {
    const { userId } = req.user as any; 
    return this.userService.getProfile(userId);
  }

  @Patch('me')
  async updateProfile(
    @Req() req: Request,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<{ message: string; user: UserResponseDto }> {
    const { userId } = req.user as any; 
    return this.userService.updateProfile(userId, updateProfileDto);
  }

  

  @Delete('me')
async deleteProfile(@Req() req: Request): Promise<{ message: string }> {
  const { userId } = req.user as any; 
  return this.userService.softDeleteUserById(userId);
}


  // ADMIN
  @Get()
  @Roles('admin')
  async getAllUsers(): Promise<UserResponseDto[]> {
    return this.userService.getAllUsers();
  }

  @Get(':email')
  @Roles('admin')
  async getUserByEmail(@Param('email') email: string): Promise<UserResponseDto> {
    return this.userService.findByEmail(email);
  }

  @Patch(':email')
  @Roles('admin')
  async updateByEmail(
    @Param('email') email: string,
    @Body('role') role: string,
  ): Promise<{ message: string }> {
    return this.userService.updateByEmail(email, { role });
  }

  @Delete(':email')
@Roles('admin')
async toggleSoftDeleteUser(
  @Param('email') email: string,
): Promise<{ message: string }> {
  return this.userService.toggleSoftDeleteUser(email);
}


}
