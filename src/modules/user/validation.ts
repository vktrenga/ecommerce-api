import { check, param } from "express-validator";

export class UserValidation {
  static signUpValidation = () => {
    return [
      check("name").notEmpty().withMessage("name is required"),
      check("emailId")
        .notEmpty()
        .withMessage("Email Id is required")
        .isEmail()
        .withMessage("Email Id not valid"),
      check("phoneNo").notEmpty().withMessage("Phone No is required")
      .escape()
      .exists({checkFalsy: true})
      .isLength({min: 10, max:13})
      .matches(/^((0091)|(\+91)|0?)[789]{1}\d{9}$/).withMessage("Phone No is Invalid"),
      check("password")
        .notEmpty()
        .withMessage("password is required")
        .isLength({ min: 8 })
        .withMessage("password must be 8 characters")
    ];
  };

  static updateValidation = () => {
    return [
      check("name").notEmpty().withMessage("name is required"),
      check("emailId")
        .notEmpty()
        .withMessage("Email Id is required")
        .isEmail()
        .withMessage("Email Id not valid"),
      check("phoneNo").notEmpty().withMessage("Phone No is required")
      .escape()
      .exists({checkFalsy: true})
      .isLength({min: 10, max:13})
      .matches(/^((0091)|(\+91)|0?)[789]{1}\d{9}$/).withMessage("Phone No is Invalid"),
    ];
  };

  static loginValidation = () => {
    return [
      check("emailId")
        .notEmpty()
        .withMessage("Email Id is required")
        .isEmail()
        .withMessage("Email Id not valid"),
      check("password").notEmpty().withMessage("password is required"),
    ];
  };
}
