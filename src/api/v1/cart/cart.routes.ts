import { Router } from "express"
import { CartController } from "./cart.controller"
import { authenticateUser } from "../../../middlewares/authenticate-user"
import { validateRequest } from "../../../middlewares/validate-request"
import { cartItemSchema, cartParamsSchema } from "./cart.schema"

const router = Router()
const cartController = new CartController()

router.get("/", authenticateUser, cartController.getCart)

router.post(
  "/",
  authenticateUser,
  validateRequest({ body: cartItemSchema }),
  cartController.addItem
)

router.put(
  "/:productId",
  authenticateUser,
  validateRequest({ params: cartParamsSchema, body: cartItemSchema.partial() }),
  cartController.updateItem
)

router.delete(
  "/:productId",
  authenticateUser,
  validateRequest({ params: cartParamsSchema }),
  cartController.removeItem
)

router.delete("/", authenticateUser, cartController.clearCart)

export default router
