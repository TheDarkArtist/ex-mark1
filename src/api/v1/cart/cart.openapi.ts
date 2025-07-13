import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import { cartSchema, cartParamsSchema, cartQuerySchema } from "./cart.schema"

export function registerCart(registry: OpenAPIRegistry) {
  registry.register("CartItem", cartSchema.shape.items.element)
  registry.register("CartItems", cartSchema.shape.items)
  registry.register("Cart", cartSchema)
  registry.register("CartParams", cartParamsSchema)
  registry.register("CartQuery", cartQuerySchema)

  const tag = ["Cart"]
  const bearerAuth = [{ BearerAuth: [] }]

  registry.registerPath({
    method: "post",
    path: "/api/cart",
    tags: tag,
    security: bearerAuth,
    request: {
      body: {
        content: {
          "application/json": { schema: cartSchema },
        },
      },
    },
    responses: {
      201: { description: "Cart created or updated" },
      400: { description: "Validation failed" },
      401: { description: "Unauthorized" },
    },
  })

  registry.registerPath({
    method: "get",
    path: "/api/cart/{userId}",
    tags: tag,
    security: bearerAuth,
    request: {
      params: cartParamsSchema,
    },
    responses: {
      200: { description: "Cart retrieved successfully" },
      404: { description: "Cart not found" },
      401: { description: "Unauthorized" },
    },
  })

  registry.registerPath({
    method: "delete",
    path: "/api/cart/{userId}/items/{productId}",
    tags: tag,
    security: bearerAuth,
    request: {
      params: cartParamsSchema.extend({
        productId: cartSchema.shape.items.element.shape.productId,
      }),
    },
    responses: {
      204: { description: "Item removed from cart" },
      404: { description: "Cart or item not found" },
      401: { description: "Unauthorized" },
    },
  })

  registry.registerPath({
    method: "get",
    path: "/api/cart",
    tags: tag,
    security: bearerAuth,
    request: {
      query: cartQuerySchema,
    },
    responses: {
      200: { description: "List of carts" },
      401: { description: "Unauthorized" },
    },
  })
}

export default registerCart
