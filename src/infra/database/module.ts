import { Global, MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantModule } from 'src/domain/tenants/module';
import { TenantProviderMiddleware } from './middleware';
import { TenantConnectionProvider } from './provider';
import { connectionOptions } from './connections';

@Global()
@Module({
  imports: [
    TenantModule,
    TypeOrmModule.forRoot(connectionOptions),
  ],
  providers: [TenantConnectionProvider],
  exports: [TypeOrmModule, TenantConnectionProvider],
})
export class DatabaseModule {
  configure(app: MiddlewareConsumer) {
    app.apply(TenantProviderMiddleware).forRoutes('*');
  }
}
