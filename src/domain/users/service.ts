import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserSeeder } from 'src/infra/database/seeders/users';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './entity';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    private repository: Repository<User>,
    private seeder: UserSeeder,
  ) { }

  async onModuleInit() {
    console.log("This onModuleInit won't run");
  }

  async create(user: User) {
    return this.repository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.repository.find();
  }


  async findOne(id: number): Promise<User> {
    return this.repository.findOneBy({ id: id });
  }

  async update(id: number, user: User): Promise<UpdateResult> {
    return this.repository.update(id, user);
  }
}
