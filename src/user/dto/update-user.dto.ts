import { IsOptional, IsString } from 'class-validator';
import { IsArabPhoneNumber } from 'src/common/validators/phone-number.validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  countryCode?: string;

  @IsOptional()
  @IsArabPhoneNumber({ message: 'Invalid phone number for selected country' })
  phoneNumber?: string;

  
}
