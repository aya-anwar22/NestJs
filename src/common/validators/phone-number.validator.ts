import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsArabPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isArabPhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const obj = args.object as any;
          const country = obj.countryCode;

          const regexByCountry: { [key: string]: RegExp } = {
            EG: /^01[0-9]{9}$/,    
            SA: /^05[0-9]{8}$/,
            AE: /^05[0-9]{8}$/,
            KW: /^[569][0-9]{7}$/,
            QA: /^[3-7][0-9]{7}$/,
            BH: /^3[0-9]{7}$/,
            OM: /^9[0-9]{7}$/,
            JO: /^07[789][0-9]{7}$/,
            LB: /^03[0-9]{6}$/,
            IQ: /^07[3-9][0-9]{8}$/,
            MA: /^0[5-7][0-9]{8}$/,
            DZ: /^0[567][0-9]{8}$/,
            TN: /^[2459][0-9]{7}$/,
            SD: /^09[0-9]{8}$/,
            LY: /^09[1-9][0-9]{7}$/
          };

          return country && regexByCountry[country] && regexByCountry[country].test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `Phone number does not match the format for the selected country (${(args.object as any).countryCode}).`;
        },
      },
    });
  };
}
