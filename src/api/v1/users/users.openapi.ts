import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import {
  registerUserSchema,
  updateUserSchema,
  deleteUserSchema,
  getUserByEmailSchema,
} from './users.schema';

export function registerUsers(registry: OpenAPIRegistry) {
  const tag = ['Users'];

  registry.register('RegisterUser', registerUserSchema);
  registry.register('UpdateUser', updateUserSchema);
  registry.register('DeleteUserParams', deleteUserSchema);
  registry.register('GetUserByEmail', getUserByEmailSchema);

  registry.registerPath({
    method: 'post',
    path: '/api/users/register',
    tags: tag,
    request: {
      body: {
        content: {
          'application/json': { schema: registerUserSchema },
        },
      },
    },
    responses: {
      201: { description: 'User registered successfully' },
      400: { description: 'Validation failed' },
    },
  });

  registry.registerPath({
    method: 'put',
    path: '/api/users/{userId}',
    tags: tag,
    request: {
      params: deleteUserSchema,
      body: {
        content: {
          'application/json': { schema: updateUserSchema },
        },
      },
    },
    responses: {
      200: { description: 'User updated successfully' },
      400: { description: 'Validation failed' },
      404: { description: 'User not found' },
    },
  });

  registry.registerPath({
    method: 'delete',
    path: '/api/users/{userId}',
    tags: tag,
    request: {
      params: deleteUserSchema,
    },
    responses: {
      204: { description: 'User deleted' },
      404: { description: 'User not found' },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/users/{userId}',
    tags: tag,
    request: {
      params: deleteUserSchema,
    },
    responses: {
      200: { description: 'User details' },
      404: { description: 'User not found' },
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/api/users/by-email',
    tags: tag,
    request: {
      body: {
        content: {
          'application/json': { schema: getUserByEmailSchema },
        },
      },
    },
    responses: {
      200: { description: 'User found by email' },
      400: { description: 'Validation failed' },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/users',
    tags: tag,
    responses: {
      200: { description: 'List of users' },
    },
  });
}
