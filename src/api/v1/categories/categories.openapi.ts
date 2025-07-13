import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryParamsSchema,
  listCategoriesQuerySchema,
} from './categories.schema';

export function registerCategories(registry: OpenAPIRegistry) {
  const tag = ['Categories'];

  registry.register('CreateCategory', createCategorySchema);
  registry.register('UpdateCategory', updateCategorySchema);
  registry.register('CategoryParams', categoryParamsSchema);
  registry.register('ListCategoriesQuery', listCategoriesQuerySchema);

  registry.registerPath({
    method: 'post',
    path: '/api/categories',
    tags: tag,
    request: {
      body: {
        content: {
          'application/json': { schema: createCategorySchema },
        },
      },
    },
    responses: {
      201: { description: 'Category created' },
      400: { description: 'Validation failed' },
      401: { description: 'Unauthorized' },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/categories',
    tags: tag,
    request: {
      query: listCategoriesQuerySchema,
    },
    responses: {
      200: { description: 'List of categories' },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/categories/{id}',
    tags: tag,
    request: {
      params: categoryParamsSchema,
    },
    responses: {
      200: { description: 'Category found' },
      404: { description: 'Category not found' },
    },
  });

  registry.registerPath({
    method: 'put',
    path: '/api/categories/{id}',
    tags: tag,
    request: {
      params: categoryParamsSchema,
      body: {
        content: {
          'application/json': { schema: updateCategorySchema },
        },
      },
    },
    responses: {
      200: { description: 'Category updated' },
      400: { description: 'Validation failed' },
      401: { description: 'Unauthorized' },
      404: { description: 'Category not found' },
    },
  });

  registry.registerPath({
    method: 'delete',
    path: '/api/categories/{id}',
    tags: tag,
    request: {
      params: categoryParamsSchema,
    },
    responses: {
      204: { description: 'Category deleted' },
      401: { description: 'Unauthorized' },
      404: { description: 'Category not found' },
    },
  });
}
