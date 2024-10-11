import { Module } from '@nestjs/common';
import { TenantModule } from './domain/tenants/module';
import { DatabaseModule } from './infra/database/module';
import { UserModule } from './domain/users/module';

@Module({
  imports: [
    UserModule,
    TenantModule,
    DatabaseModule,
  ],
})
export class AppModule { }
