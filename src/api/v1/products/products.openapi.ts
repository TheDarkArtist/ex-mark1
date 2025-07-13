import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import {
  createProductSchema,
  updateProductSchema,
  productParamsSchema,
  listProductsQuerySchema,
} from './products.schema';

export function registerProducts(registry: OpenAPIRegistry) {
  const tag = ['Products'];

  registry.register('CreateProduct', createProductSchema);
  registry.register('UpdateProduct', updateProductSchema);
  registry.register('ProductParams', productParamsSchema);
  registry.register('ListProductsQuery', listProductsQuerySchema);

  registry.registerPath({
    method: 'post',
    path: '/api/products',
    tags: tag,
    request: {
      body: {
        content: {
          'application/json': {
            schema: createProductSchema,
          },
        },
      },
    },
    security: [{ BearerAuth: [] }],
    responses: {
      201: { description: 'Product created' },
      400: { description: 'Validation failed' },
      401: { description: 'Unauthorized' },
      403: { description: 'Admin privileges required' },
    },
  });

  registry.registerPath({
    method: 'put',
    path: '/api/products/{id}',
    tags: tag,
    request: {
      params: productParamsSchema,
      body: {
        content: {
          'application/json': {
            schema: updateProductSchema,
          },
        },
      },
    },
    security: [{ BearerAuth: [] }],
    responses: {
      200: { description: 'Product updated' },
      400: { description: 'Validation failed' },
      401: { description: 'Unauthorized' },
      403: { description: 'Admin privileges required' },
      404: { description: 'Product not found' },
    },
  });

  registry.registerPath({
    method: 'delete',
    path: '/api/products/{id}',
    tags: tag,
    request: {
      params: productParamsSchema,
    },
    security: [{ BearerAuth: [] }],
    responses: {
      204: { description: 'Product deleted' },
      401: { description: 'Unauthorized' },
      403: { description: 'Admin privileges required' },
      404: { description: 'Product not found' },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/products/{id}',
    tags: tag,
    request: {
      params: productParamsSchema,
    },
    responses: {
      200: { description: 'Product details' },
      404: { description: 'Product not found' },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/products',
    tags: tag,
    request: {
      query: listProductsQuerySchema,
    },
    responses: {
      200: { description: 'List of products' },
    },
  });
}
