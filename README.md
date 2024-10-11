# Nest Multitenancy

Barebones of a multitenancy app, on top of NestJS, TypeORM and PostrgreSQL.

## Getting started

To start the backend application and database, run the following command:

``` sh
docker compose up -d backend db
```
The backend will be available on port 3000.

## Explanation

The core logic of this repository is to create a database for each tenant and define a database connection based on the headers of each request received by the backend.

In [src/infra/database/middleware.ts](src/infra/database/middleware.ts), the `origin` of the request is analyzed. If it contains a subdomain (**subdomain**.localhost:3000), a new header (`database_name`) containing the database name is added to the request.

In [src/infra/database/provider.ts](src/infra/database/provider.ts), a provider for `'CONNECTION'` is defined, which takes into account the database_name to create a connection that is then injected into [src/domain/users/module.ts](src/domain/users/module.ts).
## Database structure

For the central database (named postgres), two tables are created: users and tenants. The tenants table holds the data to identify the connection (subdomain) and a unique ID, which is used as part of the name of the database.

For each tenant, a table named user is created.

## Considerations

Some functions provided by NestJS will not work for modules that are request-scoped, like `onInitModule`.

Certain components cannot be request-scoped, such as event listeners or queues. For these, a new connection must be created within the component logic.

## Seeders

For testing purposes, two tenants with one user each are created when the application starts. Tenant1 has a user named `user-tenant1` and a subdomain named `tenant1`, the same goes for Tenant2.

## Testing

Request to default database:
``` sh
curl --location --request GET "localhost:3000/users" 
--header "origin: localhost:3000/users" 
--header "Content-Type: application/json" 
```
Expected output: 
``` JSON
{
  "id": 1,
  "name": "user"
}
```

Request to tenant 1:
``` sh
curl --location --request GET "tenant1.localhost:3000/users" 
--header "origin: tenant1.localhost:3000/users" 
--header "Content-Type: application/json" 
```
Expected output: 
``` JSON
{
  "id": 1,
  "name": "user-tenant1"
}
```

Request to tenant 2:
``` sh
curl --location --request GET "tenant2.localhost:3000/users" 
--header "origin: tenant2.localhost:3000/users" 
--header "Content-Type: application/json" 
```
Expected output: 
``` JSON
{
  "id": 1,
  "name": "user-tenant2"
}
```