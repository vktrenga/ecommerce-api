import express from "express";
import { AuthController } from "../middleware/auth";
import { ProductController } from "../modules/product/productController";
import { ProductValidation } from "../modules/product/validation";

const router = express.Router();
const productController = new ProductController();

router.post(
  "/product/",
  AuthController.authenticate,
  ProductValidation.prodcutAddEdit(),
  productController.addProduct
);

router.put(
  "/product/:id",
  AuthController.authenticate,
  ProductValidation.prodcutAddEdit(),
  productController.editProduct
);

router.get(
  "/product/:id",
  AuthController.authenticate,
  productController.getProduct
);

router.get(
  "/product/",
  AuthController.authenticate,
  productController.listProduct
);

router.delete(
  "/product/:id",
  AuthController.authenticate,
  productController.deleteProduct
);


export default router;
