import {
  Injectable
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { configureDataSource, createDatabase } from 'src/infra/database/connections';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { TenantSeeder } from '../../infra/database/seeders/tenants';
import { Tenant } from './entity';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private repository: Repository<Tenant>,
    private seeder: TenantSeeder,
  ) { }

  async onModuleInit() {
    console.log("This onModuleInit will run");
    this.seeder.seed();
  }

  async create(tenant: Tenant): Promise<Tenant> {
    const tenantCreate = await this.repository.save(tenant);

    await createDatabase(`tenant-${tenantCreate.id}`);

    let connection = new DataSource(
      configureDataSource(`tenant-${tenantCreate.id}`),
    );

    connection = await connection.initialize();
    await connection.synchronize();
    await connection.destroy();

    return tenantCreate;
  }

  async findAll(): Promise<Tenant[]> {
    return await this.repository.find();
  }

  async findOne(id: number): Promise<Tenant | null> {
    return await this.repository.findOneBy({ id });
  }

  update(id: number, tenant: Tenant): Promise<UpdateResult> {
    return this.repository.update(id, tenant);
  }

  getTenantBySubdomain(subdomain: string): Promise<Tenant | null> {
    return this.repository.findOneBy({ subdomain: subdomain });
  }
}
