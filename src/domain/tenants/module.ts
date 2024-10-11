import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantController } from './controller';
import { Tenant } from './entity';
import { TenantService } from './service';
import { TenantSeeder } from 'src/infra/database/seeders/tenants';
import { UserSeeder } from 'src/infra/database/seeders/users';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant]),
  ],
  exports: [TenantService],
  controllers: [TenantController],
  providers: [
    TenantService,
    TenantSeeder,
    UserSeeder
  ],
})
export class TenantModule { }

