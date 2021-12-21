import { Model } from "mongoose";
import dotenv from "dotenv";
import { trim } from "lodash";
import { AuthController } from "../../middleware/auth";
import { APIResponse, APIResponseData } from "../../middleware/response";
import { IUser, User } from "../../models/user";
import { Pagination, QueryFilter } from "../../utils/commonInterfaces";
import { APIMessages } from "../../utils/constants/APIMessage.constants";
dotenv.config();

export interface UserFilter {
  email?: string;
  id?: string;
}

export class UserService {
  /**
   * @desc    This class contain User's Curd Operations' services
   * @author  Rengaraj
   * @since   2021
   */
  private userModel: Model<IUser>;

  constructor() {
    this.userModel = User;
  }

  /**
   *
   * @param req {param: Id -> user Id}
   * @param res {IUser}
   * @returns {APIResponse}
   */
  async getUserDetails(req, res): Promise<APIResponseData> {
    try {
      const { id } = req.params;
      const user: IUser = await this.userModel.findById(id, {
        password: 0,
        __v: 0,
        salt: 0,
      });
      const result: APIResponseData = APIResponse.success(
        user,
        APIMessages.successErrorMessage.details,
        200
      );
      return res.status(200).json(result);
    } catch (err) {
      const result: APIResponseData = APIResponse.error(err.message, 500);
      return res.status(500).json(result);
    }
  }

  /**
   *
   * @param req {query: QueryFilter}
   * @param res {IUser[]}
   * @returns {APIResponse}
   */
  async getUserList(req, res): Promise<APIResponseData> {
    try {
      const queryFilter: QueryFilter = req.query;

      const limitCount: number = queryFilter.limit
        ? queryFilter.limit
        : parseInt(process.env.LIMIT);
      const sortBy = queryFilter.sort_by
        ? queryFilter.sort_by.toString()
        : "_id";
      const sortOrder = queryFilter.sort === "asc" ? 1 : -1;
      const sorting = {
        [sortBy]: sortOrder,
      };

      const currentPage: number | string = queryFilter.page
        ? queryFilter.page
        : 1;
      let query: any = {};
      if (queryFilter.search) {
        query = {
          $or: [
            {
              name: {
                $regex: `.*${trim(queryFilter.search)}.*`,
                $options: "i",
              },
            },
            {
              emailId: {
                $regex: `.*${trim(queryFilter.search)}.*`,
                $options: "i",
              },
            },
          ],
        };
      }
      const totalRecord: number = await this.userModel.count(query);
      const users: IUser[] = await this.userModel
        .find(query, { password: 0, __v: 0, salt: 0 })
        .sort(sorting)
        .skip((currentPage - 1) * limitCount)
        .limit(Number(limitCount));

      const pagination: Pagination = {
        totalRecords: totalRecord,
        currentPage: Number(currentPage),
        recordPerPage: Number(limitCount),
      };
      const result: APIResponseData = APIResponse.success(
        users,
        APIMessages.successErrorMessage.list,
        200,
        pagination
      );
      return res.status(200).json(result);
    } catch (err) {
      const result: APIResponseData = APIResponse.error(err.message, 500);
      return res.status(500).json(result);
    }
  }

  /**
   *
   * @param req {body: {Partial<IUSer>}}
   * @param res {Partial<IUser>}
   * @returns {APIResponse}
   */

  async createUser(req, res): Promise<APIResponseData> {
    try {
      // Get User Data
      const userData: IUser = req.body;

      //User Already Exist
      const userAlreadyExist = await this.userAlreadyExist({
        email: userData.emailId,
      });
      if (userAlreadyExist)
        throw new Error(APIMessages.successErrorMessage.dataAlreadyExist);

      // Create and assign hashPassword and Salt for  User Data
      const { salt, hashPassword } = AuthController.generateHashedPassword(
        userData.password
      );
      userData.password = hashPassword;
      userData.salt = salt;
      // Create User
      const user: IUser = await this.userModel.create(userData);

      const userCreatedData: IUser = await this.userModel.findById(user._id, {
        password: 0,
        __v: 0,
        salt: 0,
      });

      // Get User Response
      const result: APIResponseData = APIResponse.success(
        userCreatedData,
        APIMessages.successErrorMessage.addedSuccessfully,
        200
      );
      // Send User Response
      return res.status(200).json(result);
    } catch (err) {
      // Get User Error Response
      const result: APIResponseData = APIResponse.error(err.message, 500);
      // Return User Error Response
      return res.status(500).json(result);
    }
  }

  /**
   *
   * @param req {body: {Partial<IUSer>}, param: id}
   * @param res {Partial<IUser>}
   * @returns {APIResponse}
   */

  async updateUser(req, res): Promise<APIResponse> {
    try {
      const { id } = req.params;
      const userData: IUser = req.body;
      const userAlreadyExist: IUser | boolean = await this.userAlreadyExist({
        email: userData.emailId,
      });
      if (userAlreadyExist && userAlreadyExist["_id"].toString() !== id)
        throw new Error(APIMessages.successErrorMessage.dataAlreadyExist);

      await this.userModel.findByIdAndUpdate(id, userData);

      const userUpdateData: IUser = await this.userModel.findById(id, {
        password: 0,
        __v: 0,
        salt: 0,
      });
      const result: APIResponseData = APIResponse.success(
        userUpdateData,
        APIMessages.successErrorMessage.updatedSuccessfully,
        200
      );
      return res.status(500).json(result);
    } catch (err) {
      const result: APIResponseData = APIResponse.error(err.message, 500);
      return res.status(500).json(result);
    }
  }

  /**
   *
   * @param req {param: id}
   * @param res {}
   * @returns {APIResponse}
   */

  async deleteUser(req, res): Promise<APIResponseData> {
    try {
      const { id } = req.params;
      await this.userModel.findByIdAndRemove(id);
      const result: APIResponseData = APIResponse.success(
        [],
        APIMessages.successErrorMessage.deletedSuccessfully,
        200
      );
      return res.status(200).json(result);
    } catch (err) {
      const result: APIResponseData = APIResponse.error(err.message, 500);
      return res.status(500).json(result);
    }
  }

  /**
   *
   * @param req {body: { emailId, password }}
   * @param res {toke: string}
   * @returns {APIResponse}
   */

  async login(req, res): Promise<APIResponse> {
    try {
      const { emailId, password } = req.body;
      const user: IUser = await this.userModel.findOne({ emailId: emailId });
      if (!user) {
        throw new Error("User Not Found");
      }
      const passwordStatus: boolean = await AuthController.comparePassword(
        password,
        user.password,
        user.salt
      );
      if (!passwordStatus)
        throw new Error(APIMessages.successErrorMessage.invalidusername);

      const token: string = await AuthController.generateToken({
        _id: user._id,
        emailId: user.emailId,
        isAdmin: user.isAdmin,
      });

      const result: APIResponseData = APIResponse.success(
        { token: token },
        APIMessages.successErrorMessage.loginSuccessfully,
        200
      );

      return res.status(200).json(result);
    } catch (err) {
      const result: APIResponseData = APIResponse.error(err.message, 500);
      return res.status(500).json(result);
    }
  }

  /**
   *
   * @param req {userFilter}
   * @param res {boolean | Iuser}
   * @returns {boolean | Iuser}
   */

  async userAlreadyExist(userFilter: UserFilter): Promise<IUser | boolean> {
    try {
      //match the filter
      let match: object = {};
      if (userFilter.email) match = { emailId: userFilter.email, ...match };
      if (userFilter.id) match = { _id: userFilter.id, ...match };
      // find the user
      const user: IUser = await this.userModel.findOne(match);
      if (user) return user;
      return false;
    } catch (err) {
      return false;
    }
  }

  /**
   *
   * @param req {}
   * @param res {number}
   * @returns {number}
   */
  async findUserCount(): Promise<number> {
    const userCount = await this.userModel.count();
    return userCount;
  }
}
