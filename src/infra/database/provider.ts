import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { DataSource } from 'typeorm';
import { configureDataSource } from './connections';

export const TenantConnectionProvider = {
  provide: 'CONNECTION',
  useFactory: async (request: Request) => {
    if (request.headers) {
      const connection: DataSource = new DataSource(
        configureDataSource(
          request.headers.database_name as string
        ),
      );
      try {
        if (!connection.isInitialized) {
          await connection.initialize();
        }
      } catch (error) {
        console.error(error?.message);
      }
      return connection;
    }
  },
  inject: [REQUEST, DataSource],
};
