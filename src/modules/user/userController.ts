import { validationResult } from "express-validator";
import { APIResponse, APIResponseData } from "../../middleware/response";
import { UserService } from "./userService";
const userService = new UserService();

export class UserController {
  /**
   *
   * @param req
   * @param res
   * @returns
   *
   *
   * End Point: GET -> /user
   */

  async getUserList(req, res) {
    try {
      await userService.getUserList(req, res);
    } catch (err) {
      const result: APIResponseData = APIResponse.error(err.message, 500);
      return res.status(500).json(result);
    }
  }

  /**
   *
   * @param req
   * @param res
   * @returns
   *
   *
   * End Point: Put -> /user:/id
   */

  async updateUserDetails(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const result: APIResponseData = APIResponse.error(
          errors["errors"],
          402
        );
        return res.status(402).json(result);
      }
      await userService.updateUser(req, res);
    } catch (err) {
      const result: APIResponseData = APIResponse.error(err.message, 500);
      return res.status(500).json(result);
    }
  }

  /**
   *
   * @param req
   * @param res
   * @returns
   *
   *
   * End Point: POST -> /user
   */
  async createUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const result: APIResponseData = APIResponse.error(
          errors["errors"],
          402
        );
        return res.status(402).json(result);
      }

      await userService.createUser(req, res);
    } catch (err) {
      const result: APIResponseData = APIResponse.error(err.message, 402);
      return res.status(500).json(result);
    }
  }

  /**
   *
   * @param req
   * @param res
   * @returns
   *
   *
   * End Point: GET -> /user:/id
   */

  async getUserDetails(req, res) {
    try {
      await userService.getUserDetails(req, res);
    } catch (err) {
      const result: APIResponseData = APIResponse.error(err.message, 500);
      return res.status(500).json(result);
    }
  }

  /**
   *
   * @param req
   * @param res
   * @returns
   *
   *
   * End Point: delete -> /user:/id
   */
  async deleteUser(req, res) {
    try {
      await userService.deleteUser(req, res);
    } catch (err) {
      const result: APIResponseData = APIResponse.error(err.message, 500);
      return res.status(500).json(result);
    }
  }

  /**
   *
   * @param req
   * @param res
   * @returns
   *
   * End Point: Post -> /login
   *
   */
  async login(req, res): Promise<APIResponse> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const result: APIResponseData = APIResponse.error(errors, 402);
        return res.status(402).json(result);
      }
      await userService.login(req, res);
    } catch (err) {
      const result: APIResponseData = APIResponse.error(err.message, 500);
      return res.status(500).json(result);
    }
  }

  /**
   *
   * @param req
   * @param res
   * @returns
   *
   * End Point: Post -> /user/initialUser
   *
   */
  async createInitialUserUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const result: APIResponseData = APIResponse.error(
          errors["errors"],
          402
        );
        return res.status(402).json(result);
      }
      const userCount = await userService.findUserCount();
      if (userCount > 0) throw new Error("User Already Created");
      await userService.createUser(req, res);
    } catch (err) {
      const result: APIResponseData = APIResponse.error(err.message, 402);
      return res.status(500).json(result);
    }
  }
}
