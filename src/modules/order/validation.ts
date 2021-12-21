import { check } from "express-validator";

export class OrderValidation {
  static addCartItem = () => {
    return [
      check("productId").notEmpty().withMessage("Product is required"),
      check("qty")
        .notEmpty()
        .withMessage("Qty  is required")
        .isNumeric()
        .withMessage("Qty  is must be number")
        .isInt({ min: 1 })
        .withMessage("Qty  is must be grather then 1"),
    ];
  };

  static updateCartItem = () => {
    return [
      check("productId").notEmpty().withMessage("Product is required"),
      check("_id").notEmpty().withMessage("ID is required"),
      check("qty")
        .notEmpty()
        .withMessage("Qty  is required")
        .isNumeric()
        .withMessage("Qty  is must be number")
        .isInt({ min: 1 })
        .withMessage("Qty  is must be grather then 1"),
    ];
  };

  static deleteCartItem = () => {
    return [
      check("productId").notEmpty().withMessage("Product is required"),
      check("_id").notEmpty().withMessage("ID is required"),
    ];
  };
  
}
