import { IsEmail, IsIn, IsNotEmpty, IsString, MaxLength, MinLength, Validate } from 'class-validator';
import { IsArabPhoneNumber } from 'src/common/validators/phone-number.validator';
export class SignUpDto {
  @IsNotEmpty()
  userName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @IsNotEmpty()
  @IsArabPhoneNumber({ message: 'Phone number must match the selected country format.' })
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @IsIn([
    'EG', 'SA', 'AE', 'KW', 'QA', 'BH', 'OM', 'JO', 'LB', 
    'IQ', 'MA', 'DZ', 'TN', 'SD', 'LY'
  ])
  countryCode: string;
}
