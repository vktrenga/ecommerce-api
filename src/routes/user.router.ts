import express from "express";
import { AuthController } from "../middleware/auth";
import { UserController } from "../modules/user/userController";
import { UserValidation } from "../modules/user/validation";

const router = express.Router();
const userController = new UserController();

router.get("/user/", AuthController.authenticate, userController.getUserList);

router.post(
  "/user/initial-user",
  UserValidation.signUpValidation(),
  userController.createInitialUserUser
);

router.get(
  "/user/:id",
  AuthController.authenticate,
  userController.getUserDetails
);

router.post(
  "/user/",
  AuthController.authenticate,
  UserValidation.signUpValidation(),
  userController.createUser
);

router.put(
  "/user/:id",
  AuthController.authenticate,
  UserValidation.updateValidation(),
  userController.updateUserDetails
);

router.delete(
  "/user/:id",
  AuthController.authenticate,
  userController.deleteUser
);

// router.post("/login/", UserValidation.loginValidation(), userController.login);
router.post("/login/", UserValidation.loginValidation(), (req, res) => {
  userController.login(req, res);
});

export default router;
