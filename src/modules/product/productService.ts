import { Model } from "mongoose";
import dotenv from "dotenv";
import { trim } from "lodash";

import { APIResponse, APIResponseData } from "../../middleware/response";
import { IProduct, Product } from "../../models/product";
import { Pagination, QueryFilter } from "../../utils/commonInterfaces";
import { APIMessages } from "../../utils/constants/APIMessage.constants";

dotenv.config();

export interface ProductFilter {
  code?: string;
  id?: string;
}
export class ProductService {
  /**
   * @desc    This class contain Product's Curd Operations' services
   * @author  Rengaraj
   * @since   2021
   */

  private productModel: Model<IProduct>;
  constructor() {
    this.productModel = Product;
  }

  /**
   *
   * @param req {body: {Partial<IProduct>}}
   * @param res {Partial<IProduct>}
   * @returns {APIResponse}
   */
  async addProduct(req, res): Promise<APIResponseData> {
    try {
      const product: IProduct = req.body;

      // Data Already Existing  check
      const productAlredyExisting: boolean | IProduct =
        await this.productAlreadyExist({
          code: req.body.code,
        });

      if (productAlredyExisting)
        throw new Error(APIMessages.successErrorMessage.dataAlreadyExist);
      product.createdBy = req.user._id;
      const productData: IProduct = await this.productModel.create(product);
      const responseData: APIResponseData = APIResponse.success(
        productData,
        APIMessages.successErrorMessage.addedSuccessfully,
        200
      );
      return res.status(200).json(responseData);
    } catch (err) {
      // Get Product Error Response
      const result: APIResponseData = APIResponse.error(err.message, 402);
      // Return Product Error Response
      return res.status(500).json(result);
    }
  }

  /**
   *
   * @param req {body: {Partial<IProduct>}, param: id}
   * @param res {Partial<IProduct>}
   * @returns {APIResponse}
   */
  async editProduct(req, res): Promise<APIResponseData> {
    try {
      const { id } = req.params;
      const productData: IProduct = req.body;
      const productAlreadyExist: IProduct | boolean =
        await this.productAlreadyExist({
          code: productData.code,
        });
      if (productAlreadyExist && productAlreadyExist["_id"].toString() !== id)
        throw new Error(APIMessages.successErrorMessage.dataAlreadyExist);
      productData.updatedBy = req.user._id;
      await this.productModel.findByIdAndUpdate(id, productData);

      const userUpdateData: IProduct = await this.productModel.findById(id, {});
      const result: APIResponseData = APIResponse.success(
        userUpdateData,
        APIMessages.successErrorMessage.updatedSuccessfully,
        200
      );
      return res.status(500).json(result);
    } catch (err) {
      // Get Product Error Response
      const result: APIResponseData = APIResponse.error(err.message, 402);
      // Return Product Error Response
      return res.status(500).json(result);
    }
  }

  /**
   *
   * @param req {param: id}
   * @param res {}
   * @returns {APIResponse}
   */

  async deleteProduct(req, res): Promise<APIResponseData> {
    try {
      const { id } = req.params;
      await this.productModel.findByIdAndUpdate(id, { isActive: false });
      const responseData: APIResponseData = APIResponse.success(
        [],
        APIMessages.successErrorMessage.deletedSuccessfully,
        200
      );
      return res.status(200).json(responseData);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }

  /**
   *
   * @param req {param: Id -> product Id}
   * @param res {IProduct}
   * @returns {APIResponse}
   */
  async getProduct(req, res): Promise<APIResponseData> {
    try {
      const { id } = req.params;
      const product: IProduct = await this.productModel.findById(id);
      const result: APIResponseData = APIResponse.success(
        product,
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
   * @param res {IProduct[]}
   * @returns {APIResponse}
   */

  async listProduct(req, res): Promise<APIResponseData> {
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
      let query: any = { isActive: true };

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
              code: {
                $regex: `.*${trim(queryFilter.search)}.*`,
                $options: "i",
              },
            },
          ],
        };
      }
      const totalRecord: number = await this.productModel.count(query);
      const products: IProduct[] = await this.productModel
        .find(query)
        .sort(sorting)
        .skip(Number(currentPage - 1) * Number(limitCount))
        .limit(Number(limitCount));

      const pagination: Pagination = {
        totalRecords: totalRecord,
        currentPage: Number(currentPage),
        recordPerPage: Number(limitCount),
      };
      const result: APIResponseData = APIResponse.success(
        products,
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

  async productAlreadyExist(
    productFilter: ProductFilter
  ): Promise<IProduct | boolean> {
    try {
      let match: object = {};
      if (productFilter.code) match = { code: productFilter.code, ...match };
      if (productFilter.id) match = { _id: productFilter.id, ...match };

      const product: IProduct = await this.productModel.findOne(match);
      if (product) return product;
      return false;
    } catch (err) {
      return false;
    }
  }
}
