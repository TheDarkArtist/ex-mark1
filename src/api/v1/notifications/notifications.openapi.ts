import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import {
  createNotificationSchema,
  updateNotificationSchema,
  notificationParamsSchema,
  listNotificationsQuerySchema,
} from "./notifications.schema"

const registry = new OpenAPIRegistry()
const tag = ["Notifications"]

export function registerNotifications(registry: OpenAPIRegistry) {
  registry.register("CreateNotification", createNotificationSchema)
  registry.register("UpdateNotification", updateNotificationSchema)
  registry.register("NotificationParams", notificationParamsSchema)
  registry.register("ListNotificationsQuery", listNotificationsQuerySchema)

  registry.registerPath({
    method: "post",
    path: "/api/notifications",
    tags: tag,
    request: {
      body: {
        content: {
          "application/json": { schema: createNotificationSchema },
        },
      },
    },
    responses: {
      201: { description: "Notification created" },
      400: { description: "Validation failed" },
    },
  })

  registry.registerPath({
    method: "get",
    path: "/api/notifications",
    tags: tag,
    request: {
      query: listNotificationsQuerySchema,
    },
    responses: {
      200: { description: "List of notifications" },
    },
  })

  registry.registerPath({
    method: "get",
    path: "/api/notifications/{id}",
    tags: tag,
    request: {
      params: notificationParamsSchema,
    },
    responses: {
      200: { description: "Notification found" },
      404: { description: "Not found" },
    },
  })

  registry.registerPath({
    method: "put",
    path: "/api/notifications/{id}",
    tags: tag,
    request: {
      params: notificationParamsSchema,
      body: {
        content: {
          "application/json": { schema: updateNotificationSchema },
        },
      },
    },
    responses: {
      200: { description: "Notification updated" },
      404: { description: "Not found" },
    },
  })

  registry.registerPath({
    method: "delete",
    path: "/api/notifications/{id}",
    tags: tag,
    request: {
      params: notificationParamsSchema,
    },
    responses: {
      204: { description: "Notification deleted" },
      404: { description: "Not found" },
    },
  })
}
export default registry
