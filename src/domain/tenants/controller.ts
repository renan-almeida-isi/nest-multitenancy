import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TenantService } from './service';
import { Tenant } from './entity';

@Controller('tenants')
export class TenantController {
  constructor(
    private readonly tenantService: TenantService,
  ) { }

  @Post()
  async create(@Body() tenant: Tenant) {
    return this.tenantService.create(tenant);
  }

  @Get()
  findAll() {
    return this.tenantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.tenantService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() tenant: Tenant) {
    return this.tenantService.update(id, tenant);
  }
}
