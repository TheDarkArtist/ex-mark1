import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import {
  createReviewSchema,
  updateReviewSchema,
  reviewParamsSchema,
  listReviewsQuerySchema,
} from './reviews.schema';

export function registerReviews(registry: OpenAPIRegistry) {
  const tag = ['Reviews'];

  registry.register('CreateReview', createReviewSchema);
  registry.register('UpdateReview', updateReviewSchema);
  registry.register('ReviewParams', reviewParamsSchema);
  registry.register('ListReviewsQuery', listReviewsQuerySchema);

  registry.registerPath({
    method: 'post',
    path: '/api/reviews',
    tags: tag,
    request: {
      body: {
        content: {
          'application/json': { schema: createReviewSchema },
        },
      },
    },
    security: [{ BearerAuth: [] }],
    responses: {
      201: { description: 'Review created' },
      400: { description: 'Validation failed' },
      401: { description: 'Unauthorized' },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/reviews',
    tags: tag,
    request: {
      query: listReviewsQuerySchema,
    },
    responses: {
      200: { description: 'List of reviews' },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/reviews/{id}',
    tags: tag,
    request: {
      params: reviewParamsSchema,
    },
    responses: {
      200: { description: 'Review details' },
      404: { description: 'Review not found' },
    },
  });

  registry.registerPath({
    method: 'put',
    path: '/api/reviews/{id}',
    tags: tag,
    request: {
      params: reviewParamsSchema,
      body: {
        content: {
          'application/json': { schema: updateReviewSchema },
        },
      },
    },
    security: [{ BearerAuth: [] }],
    responses: {
      200: { description: 'Review updated' },
      400: { description: 'Validation failed' },
      401: { description: 'Unauthorized' },
      404: { description: 'Review not found' },
    },
  });

  registry.registerPath({
    method: 'delete',
    path: '/api/reviews/{id}',
    tags: tag,
    request: {
      params: reviewParamsSchema,
    },
    security: [{ BearerAuth: [] }],
    responses: {
      204: { description: 'Review deleted' },
      401: { description: 'Unauthorized' },
      404: { description: 'Review not found' },
    },
  });
}
