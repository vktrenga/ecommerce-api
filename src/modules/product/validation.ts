import { check } from "express-validator";

export class ProductValidation {
  static prodcutAddEdit = () => {
    return [
      check("name").notEmpty().withMessage("Name is required"),
      check("code").notEmpty().withMessage("Prodcut code is required"),
      check("price")
        .notEmpty()
        .withMessage("Price is required")
        .isNumeric()
        .withMessage("Price Must be Numeric")
        .isInt({ min: 1 })
        .withMessage("Price Must be greater than 1")
    ];
  };
}
