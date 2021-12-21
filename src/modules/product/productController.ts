/**
 *  @Desc This is product controller, As a user can access crud operations
 *  @Auther Rengaraj
 *  @DevelopedAt 12/2021
 */

import { validationResult } from "express-validator";
import { APIResponse, APIResponseData } from "../../middleware/response";
import { ProductService } from "./productService";

const productService = new ProductService();

export class ProductController {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  /**
   *  @Desc Add Poduct
   *
   */
  async addProduct(req, res): Promise<APIResponse> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const result: APIResponseData = APIResponse.error(
          errors["errors"],
          402
        );
        return res.status(402).json(result);
      }

      await productService.addProduct(req, res);
    } catch (err) {
      const result: APIResponseData = APIResponse.error(err.message, 402);
      return res.status(500).json(result);
    }
  }

  /**
   *  @Desc Edit Poduct
   *
   */
  async editProduct(req, res): Promise<APIResponse> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const result: APIResponseData = APIResponse.error(
          errors["errors"],
          402
        );
        return res.status(402).json(result);
      }
      await productService.editProduct(req, res);
    } catch (err) {
      const result: APIResponseData = APIResponse.error(err.message, 500);
      return res.status(500).json(result);
    }
  }

  /**
   *  @Desc delete Poduct
   *
   */
  async deleteProduct(req, res): Promise<APIResponse> {
    try {
      await productService.deleteProduct(req, res);
    } catch (err) {
      const result: APIResponseData = APIResponse.error(err.message, 500);
      return res.status(500).json(result);
    }
  }

  /**
   *  @Desc Get Poduct
   *
   */
  async getProduct(req, res): Promise<APIResponse> {
    try {
      await productService.getProduct(req, res);
    } catch (err) {
      const result: APIResponseData = APIResponse.error(err.message, 500);
      return res.status(500).json(result);
    }
  }

  /**
   *  @Desc Get Poducts
   *
   */
  async listProduct(req, res): Promise<APIResponse> {
    try {
      await productService.listProduct(req, res);
    } catch (err) {
      const result: APIResponseData = APIResponse.error(err.message, 500);
      return res.status(500).json(result);
    }
  }
}
