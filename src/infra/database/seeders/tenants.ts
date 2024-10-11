import { Inject, Injectable, Logger } from '@nestjs/common';
import { Tenant } from 'src/domain/tenants/entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { createDatabase, configureDataSource } from '../connections';
import { UserSeeder } from './users';
import { User } from 'src/domain/users/entity';

@Injectable()
export class TenantSeeder {
  private readonly logger = new Logger(TenantSeeder.name);
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    @Inject(UserSeeder)
    private userSeeder: UserSeeder,
  ) { }

  async seed(): Promise<void> {
    this.createDefaultUser();


    const countTenants = await this.tenantRepository.count();
    if (countTenants != 0) {
      this.logger.log('Tenant table is not empty, skipping seed.');
      return;
    }

    for (let i = 1; i <= 2; i++) await this.createTenant(i);

    this.logger.log('Seed finished');
    return;
  }

  async createTenant(index: number): Promise<void> {
    let tenant = this.tenantRepository.create({
      name: `Tenant ${index}`,
      subdomain: `tenant${index}`,
    });

    tenant = await this.tenantRepository.save(tenant);

    await createDatabase(`tenant-${tenant.id}`)

    let connection = new DataSource(configureDataSource(`tenant-${tenant.id}`));

    connection = await connection.initialize();

    await connection.synchronize();
    const repository = connection.getRepository(User)
    await this.userSeeder.seed(repository, `user-tenant${index}`);
  }

  async createDefaultUser() {
    let connection = new DataSource(configureDataSource('postgres'));
    connection = await connection.initialize();
    const repository = connection.getRepository(User)
    const countUsers = await repository.count();
    if (countUsers == 0) {
      await this.userSeeder.seed(repository, 'user');
    } else {
      this.logger.log('Default users not empty, skipping seed.');
    }
  }
}
