import { Router } from "express"
import * as v1Routes from "../api/v1"

const apiRouter = Router()

apiRouter.use("/auth", v1Routes.authRoutes)
apiRouter.use("/cart", v1Routes.cartRoutes)
apiRouter.use("/categories", v1Routes.categoriesRoutes)
apiRouter.use("/orders", v1Routes.ordersRoutes)
apiRouter.use("/payment", v1Routes.paymentRoutes)
apiRouter.use("/products", v1Routes.productsRoutes)
apiRouter.use("/reviews", v1Routes.reviewsRoutes)
apiRouter.use("/users", v1Routes.usersRoutes)
apiRouter.use("/notifications", v1Routes.notificationRoutes)

export default apiRouter
