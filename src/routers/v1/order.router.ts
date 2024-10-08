import { Router } from "express";
import validationMiddleware from "../../middleware/validation.middleware";
import { newOrderSchema } from "../../validation/order.validation";
import { UserRoles } from "../../util/constant";
import {
	verifyRole,
	verifyToken,
} from "../../middleware/access-control.middleware";
import * as orderController from "../../controllers/order.controller";

const orderRouter = Router();

orderRouter.post(
	"/initiate_transaction",
	verifyToken,
	verifyRole([UserRoles.Attendee]),
	validationMiddleware(newOrderSchema),
	orderController.initiateTransaction
);

orderRouter.get("/paystack/success", orderController.verifyOrder);

orderRouter.post("/paystack/callback", orderController.updateOrder);

orderRouter.get(
	"/",
	verifyToken,
	verifyRole([UserRoles.Attendee]),
	orderController.getUserOrders
);

orderRouter.get("/:orderId", verifyToken, orderController.getOrder);

orderRouter.get(
	"/payment_verification/:orderId",
	verifyToken,
	orderController.getPaymentInfo
);

export default orderRouter;
