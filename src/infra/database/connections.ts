import SnakeNamingStrategy from 'typeorm-naming-strategy';
import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Tenant } from 'src/domain/tenants/entity';
import { DataSource } from 'typeorm';
import { User } from 'src/domain/users/entity';

const baseConnectionOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
};

const tenantConnectionOptions: DataSourceOptions = {
  ...baseConnectionOptions,
  ...{
    database: '',
    entities: [User]
  }
};

const connectionOptions: DataSourceOptions = {
  ...baseConnectionOptions,
  ...{
    database: process.env.POSTGRES_DB,
    entities: [Tenant, User],
  }
};

function configureDataSource(database: string): DataSourceOptions {
  return {
    ...tenantConnectionOptions,
    ...{
      database: database
    },
  } as PostgresConnectionOptions;
}

async function createDatabase(database: string): Promise<void> {
  let connection = new DataSource(connectionOptions);

  connection = await connection.initialize();
  await connection.query(`CREATE DATABASE "${database}"`);
  await connection.synchronize();
  await connection.destroy();
}

export { configureDataSource, createDatabase, tenantConnectionOptions, connectionOptions };
