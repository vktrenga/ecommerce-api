import * as jwt from "jsonwebtoken";
import { genSaltSync } from "bcrypt";
import { createHmac } from "crypto";
import { isEmpty } from "lodash";
import { APIResponse, APIResponseData } from "./response";
import { APIMessages } from "../utils/constants/APIMessage.constants";

export class AuthController {
  /**
   * @desc    This class contain auth related functions
   * @author  Rengaraj
   * @since   12/2021
   */

  private JWT_SECRET: string;
  private JWT_EXPIRATION_TIME: string;

  constructor() {
    this.JWT_SECRET = "learning";
    this.JWT_EXPIRATION_TIME = "4h";
  }
  /**
   *
   * @param req  {Header: Authorization: Token}
   * @param res  <boolean>
   * @param next
   * @returns <boolean>
   */
  static authenticate(req, res, next): Promise<boolean> {
    // find the Authorization
    const authHeader: string = req.header("Authorization");
    if (!authHeader) {
      const result: APIResponseData = APIResponse.error(
        APIMessages.successErrorMessage.tokenPresent,
        401
      );
      return res.status(401).send(result);
    }
    // split the Bearer from Authorization
    if (authHeader.startsWith("Bearer")) {
      const token: string = authHeader.substring(7, authHeader.length);
      if (!token) {
        const result: APIResponseData = APIResponse.error(
          APIMessages.successErrorMessage.tokenPresent,
          401
        );
        return res.status(401).send(result);
      }
      // verfiyTokenData the token
      try {
        const verfiyTokenData: string | boolean =
          AuthController.verifyToken(token);
        if (!verfiyTokenData) {
          const result: APIResponseData = APIResponse.error(
            APIMessages.successErrorMessage.invalidToken,
            401
          );
          return res.status(401).send(result);
        }
        req.user = verfiyTokenData;
        next();
      } catch (err) {
        return res.status(401).send({ message: err.message });
      }
    } else {
      const result: APIResponseData = APIResponse.error(
        APIMessages.successErrorMessage.tokenPresent,
        401
      );
      return res.status(401).send(result);
    }
  }

  /**
   * generateHashedPassword genertate  hashbasword from userpassword
   * @param password (User input)
   * @returns salt and hashpassword
   */
  static generateHashedPassword(password: string) {
    const salt = genSaltSync(10);
    const hash = createHmac("sha512", salt);
    hash.update(password);
    const hashPassword = hash.digest("hex");
    return { salt, hashPassword };
  }

  /**
   * @param token (Authentication Token)
   * @returns boolean values
   */
  static verifyToken(token: string): boolean {
    try {
      return jwt.verify(token, "learning", (verifyError, decoded) => {
        if (verifyError) {
          return false;
        }
        return decoded;
      });
    } catch (error) {
      return false;
    }
  }

  /**
   *  This function generate the user token for future access
   * @param data (User Data)
   * @returns
   */
  static generateToken(data: object | string): string {
    return jwt.sign(data, "learning", {
      expiresIn: "4h",
    });
  }

  /**
   *
   * @param password :string
   * @param dbHash   :string
   * @param dbSalt  :string
   * @returns boolean
   */
  static comparePassword(
    password: string,
    dbHash: string,
    dbSalt: string
  ): boolean {
    if (!isEmpty(dbHash)) {
      const hash = createHmac("sha512", dbSalt);
      hash.update(password);
      const value = hash.digest("hex");
      return value === dbHash;
    }
    return false;
  }
}
