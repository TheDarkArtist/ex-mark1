import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { createPaymentSchema, paymentIdParamsSchema } from './payment.schema';

export function registerPayment(registry: OpenAPIRegistry) {
  const tag = ['Payment'];

  registry.register('CreatePayment', createPaymentSchema);
  registry.register('PaymentIdParams', paymentIdParamsSchema);

  registry.registerPath({
    method: 'post',
    path: '/api/payment',
    tags: tag,
    request: {
      body: {
        content: {
          'application/json': { schema: createPaymentSchema },
        },
      },
    },
    security: [{ BearerAuth: [] }],
    responses: {
      201: { description: 'Payment initiated successfully' },
      400: { description: 'Validation failed' },
      401: { description: 'Unauthorized' },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/payment/{paymentId}',
    tags: tag,
    request: {
      params: paymentIdParamsSchema,
    },
    security: [{ BearerAuth: [] }],
    responses: {
      200: { description: 'Payment status retrieved' },
      400: { description: 'Invalid paymentId' },
      401: { description: 'Unauthorized' },
      404: { description: 'Payment not found' },
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/api/payment/webhook',
    tags: tag,
    request: {
      body: {
        description: 'Stripe or other provider webhook payload',
        content: {
          'application/json': { schema: {} },
        },
      },
    },
    responses: {
      200: { description: 'Webhook received successfully' },
      400: { description: 'Invalid payload' },
    },
  });
}
