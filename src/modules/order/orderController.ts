/**
 *  @Desc This is order controller, As a customer can place order / cancel the order
 *  @Auther Rengaraj
 *  @DevelopedAt 12/2021
 */

import { validationResult } from "express-validator";
import { APIResponse, APIResponseData } from "../../middleware/response";
import { OrderService } from "./orderService";
import { ProductService } from "../product/productService";
import { ICustomerOrder } from "../../models/order";

const orderService = new OrderService();
const productService = new ProductService();

export class OrderController {
  /**
   * @Desc 
  List the all products (Done)
  Option to create / update order
  Option to  Edit the qty
  Option to calcualte the order amount
  Option to delete the product from order
  */

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  /**
   *  @Desc Add / Update Product
   *  * End Point: Post -> /order
   */
  async addUpdateOrder(req, res): Promise<APIResponse> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const result: APIResponseData = APIResponse.error(
          errors["errors"],
          402
        );
        return res.status(402).json(result);
      }
      await orderService.addUpdateOrder(req, res);
    } catch (err) {
      const result: APIResponseData = APIResponse.error(err.message, 402);
      return res.status(500).json(result);
    }
  }

  /**
   *  @Desc  Update Product's Qty
   *  * End Point: Put -> /order
   */

  async updateQty(req, res): Promise<APIResponse> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const result: APIResponseData = APIResponse.error(
          errors["errors"],
          402
        );
        return res.status(402).json(result);
      }
      await orderService.updateQty(req, res);
    } catch (err) {
      const result: APIResponseData = APIResponse.error(err.message, 402);
      return res.status(500).json(result);
    }
  }

  /**
   *  @Desc  Remove Product
   *  * End Point: Delete -> /order
   */

  async removeOrderProduct(req, res): Promise<APIResponse> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const result: APIResponseData = APIResponse.error(
          errors["errors"],
          402
        );
        return res.status(402).json(result);
      }
      await orderService.removeOrderProduct(req, res);
    } catch (err) {
      const result: APIResponseData = APIResponse.error(err.message, 402);
      return res.status(500).json(result);
    }
  }


  /**
   *  @Desc  Get Order Details
   *  * End Point: get -> /order/:id
   */
   async getOrderDetails(req, res): Promise<APIResponse> {
    try {
      await orderService.getOrderDetails(req, res);
    } catch (err) {
      const result: APIResponseData = APIResponse.error(err.message, 500);
      return res.status(500).json(result);
    }
  }


  /**
   *  @Desc  Checkout Order
   *  * End Point: Post -> /order/checkout/:id
   */
  async checkout(req, res): Promise<APIResponse> {
    try {
      await orderService.checkout(req, res);
    } catch (err) {
      const result: APIResponseData = APIResponse.error(err.message, 500);
      return res.status(500).json(result);
    }
  }

  /**
   *  @Desc  List Product for customer 
   *  * End Point: Get -> /order/product
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
