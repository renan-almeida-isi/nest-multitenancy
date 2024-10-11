import 'dotenv/config';
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TenantService } from 'src/domain/tenants/service';

@Injectable()
export class TenantProviderMiddleware implements NestMiddleware {
  constructor(
    @Inject(TenantService)
    private readonly tenantService: TenantService,
  ) { }

  async use(request: Request, response: Response, next: NextFunction) {
    if (!request.headers.origin)
      return response.status(400).send({
        message: 'No tenant informed',
      });

    const domain = request.headers.origin
      .replace('http://', '')
      .split(`.${process.env.APP_DOMAIN}`)[0];

    const subdomain = domain.includes(':') ? domain.split(':')[0] : domain;
    if (subdomain != process.env.APP_DOMAIN) {
      this.tenantService
        .getTenantBySubdomain(subdomain)
        .then(async (tenant) => {
          if (!tenant) {
            return response.status(404).send({
              message: 'Tenant not found',
            });
          }
          request.headers.database_name = `tenant-${tenant.id}`;
          next();
        })
        .catch((err) => {
          console.error('err', err);
          return response.status(500);
        });
    } else {
      request.headers.database_name = process.env.POSTGRES_DB;
      next();
    }
  }
}
