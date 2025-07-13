import { Router } from "express"
import {
  registerUser,
  updateUser,
  deleteUser,
  getUserById,
  getUserByEmail,
  listUsers,
} from "./users.controller"
import {
  registerUserSchema,
  updateUserSchema,
  deleteUserSchema,
  getUserByEmailSchema,
} from "./users.schema"
import { validateRequest } from "../../../middlewares/validate-request"
import { authenticateUser } from "@/middlewares/authenticate-user"

const router = Router()

router.get("/:userId", getUserById)
router.get("/", authenticateUser, listUsers)
router.post(
  "/by-email",
  validateRequest({ body: getUserByEmailSchema }),
  getUserByEmail
)

router.post(
  "/register",
  validateRequest({ body: registerUserSchema }),
  registerUser
)

router.put(
  "/:userId",
  validateRequest({ params: deleteUserSchema, body: updateUserSchema }),
  updateUser
)

router.delete(
  "/:userId",
  validateRequest({ params: deleteUserSchema }),
  deleteUser
)

export default router
