import { Injectable, Logger } from '@nestjs/common';
import { User } from 'src/domain/users/entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserSeeder {
  private readonly logger = new Logger(UserSeeder.name);
  constructor() { }

  async seed(repository: Repository<User>, name: string = 'user'): Promise<void> {
    const count = await repository.count();

    if (count == 0) {
      await repository.save({ name: name });
      this.logger.log('Users seeded finished');
      return;
    }
    this.logger.log('Users table is not empty, skipping seed.');
  }
}
