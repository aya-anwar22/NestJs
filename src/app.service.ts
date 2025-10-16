// Service أساسي فيه Method واحدة، بيحتوي الـ Business Logic البسيط.
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
