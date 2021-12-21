import express from "express";
import { OrderController } from "../modules/order/orderController";
import { OrderValidation } from "../modules/order/validation";

const router = express.Router();
const orderContoller = new OrderController();

router.post(
  "/order",
  OrderValidation.addCartItem(),
  orderContoller.addUpdateOrder
);
router.put(
  "/order",
  OrderValidation.updateCartItem(),
  orderContoller.updateQty
);
router.delete(
  "/order",
  OrderValidation.deleteCartItem(),
  orderContoller.removeOrderProduct
);
router.get("/order/product", orderContoller.listProduct);

router.get("/order/:id", orderContoller.getOrderDetails);

router.post(
  "/order/checkout/:id",
  orderContoller.checkout
);

export default router;
