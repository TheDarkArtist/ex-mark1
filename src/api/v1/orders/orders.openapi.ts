import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import {
  createOrderSchema,
  updateOrderSchema,
  orderParamsSchema,
  listOrdersQuerySchema,
} from './orders.schema';

export function registerOrders(registry: OpenAPIRegistry) {
  const tag = ['Orders'];

  registry.register('CreateOrder', createOrderSchema);
  registry.register('UpdateOrder', updateOrderSchema);
  registry.register('OrderParams', orderParamsSchema);
  registry.register('ListOrdersQuery', listOrdersQuerySchema);

  registry.registerPath({
    method: 'post',
    path: '/api/orders',
    tags: tag,
    request: {
      body: {
        content: {
          'application/json': { schema: createOrderSchema },
        },
      },
    },
    security: [{ BearerAuth: [] }],
    responses: {
      201: { description: 'Order created' },
      400: { description: 'Validation failed' },
      401: { description: 'Unauthorized' },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/orders',
    tags: tag,
    request: {
      query: listOrdersQuerySchema,
    },
    security: [{ BearerAuth: [] }],
    responses: {
      200: { description: 'List of orders' },
      401: { description: 'Unauthorized' },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/orders/{id}',
    tags: tag,
    request: {
      params: orderParamsSchema,
    },
    security: [{ BearerAuth: [] }],
    responses: {
      200: { description: 'Order details' },
      404: { description: 'Order not found' },
      401: { description: 'Unauthorized' },
    },
  });

  registry.registerPath({
    method: 'put',
    path: '/api/orders/{id}',
    tags: tag,
    request: {
      params: orderParamsSchema,
      body: {
        content: {
          'application/json': { schema: updateOrderSchema },
        },
      },
    },
    security: [{ BearerAuth: [] }],
    responses: {
      200: { description: 'Order updated' },
      400: { description: 'Validation failed' },
      404: { description: 'Order not found' },
      401: { description: 'Unauthorized' },
    },
  });

  registry.registerPath({
    method: 'delete',
    path: '/api/orders/{id}',
    tags: tag,
    request: {
      params: orderParamsSchema,
    },
    security: [{ BearerAuth: [] }],
    responses: {
      204: { description: 'Order deleted' },
      404: { description: 'Order not found' },
      401: { description: 'Unauthorized' },
      403: { description: 'Forbidden - Admin only' },
    },
  });
}
