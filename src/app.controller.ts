import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/constants/constants';

@Controller('')
export class AppController {
  @Public()
  @Get()
  main() {
    return 'up';
  }
}
