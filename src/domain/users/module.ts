import { Module } from '@nestjs/common';
import { UserService } from './service';
import { UserController } from './controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity';
import { UserSeeder } from 'src/infra/database/seeders/users';
import { DataSource, Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserSeeder,
    {
      provide: Repository<User>,
      useFactory: (database: DataSource) => database.getRepository(User),
      inject: ['CONNECTION'],
    },
  ],
  exports: [UserService],
})
export class UserModule { }
