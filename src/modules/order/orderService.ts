import { Model } from "mongoose";
import dotenv from "dotenv";
import crypto from "crypto";
import { APIResponse, APIResponseData } from "../../middleware/response";
import { IProduct, Product } from "../../models/product";
import {
  Order,
  IOrder,
  ICustomerOrder,
  IOrderItemsBase,
} from "../../models/order";
import { ProductService } from "../product/productService";
import { APIMessages } from "../../utils/constants/APIMessage.constants";
import { find } from "lodash";
import { ObjectId } from "mongodb";
dotenv.config();

const productService = new ProductService();

export class OrderService {
  /**
   * @desc    This class contain Order's Services
   * @author  Rengaraj
   * @since   2021
   */

  private orderModel: Model<IOrder>;
  private productModel: Model<IProduct>;

  constructor() {
    this.orderModel = Order;
    this.productModel = Product;
  }

  /**
   *
   * @param req {body: {productId, Qty, _id}}
   * @param res {Partial<Iorder>}
   * @returns {APIResponse}
   */

  async addUpdateOrder(req, res): Promise<APIResponseData> {
    try {
      // Get customerOrder From request
      const customerOrder: ICustomerOrder = req.body;

      // check Item exist or not
      const product: IProduct | boolean =
        await productService.productAlreadyExist({
          id: customerOrder.productId,
        });
      let orderId: string;
      if (customerOrder._id) {
        orderId = customerOrder._id;
        const orderDetails = await this.getOrder(customerOrder._id);
        if (orderDetails.orderStatus === "COMPLETED")
          throw new Error(APIMessages.successErrorMessage.orderAlreadyPlaced);
        //check the product added already or not
        const isProductExist = await this.orderModel.findOne({
          _id: customerOrder._id,
          "orderItems.productId": customerOrder.productId,
        });

        if (isProductExist) {
          // find product qty
          const orderItem: IOrderItemsBase = find(
            isProductExist.orderItems,
            function (orderItem) {
              return (
                orderItem.productId.toString() ===
                customerOrder.productId.toString()
              );
            }
          );

          // calcualte new qty
          const totalQty: number = customerOrder.qty + orderItem.qty;

          // update qty,rate and net amount
          await this.orderModel.findOneAndUpdate(
            {
              _id: customerOrder._id,
              "orderItems.productId": customerOrder.productId,
            },
            {
              $set: {
                "orderItems.$": {
                  productId: customerOrder.productId,
                  qty: Number(totalQty),
                  rate: Number(product["price"] * totalQty),
                  netAmount: Number(product["price"] * totalQty),
                },
              },
            }
          );
        } else {
          //push new order items and update order
          await this.orderModel.updateOne(
            { _id: customerOrder._id },
            {
              $push: {
                orderItems: {
                  productId: customerOrder.productId,
                  price: Number(product["price"]),
                  qty: Number(customerOrder.qty),
                  rate: Number(product["price"] * customerOrder.qty),
                  netAmount: Number(product["price"] * customerOrder.qty),
                },
              },
            }
          );
        }
      } else {
        //create new order
        const orderData = {
          orderNo: crypto.randomBytes(16).toString("hex"),
          orderItems: [
            {
              productId: customerOrder.productId,
              price: Number(product["price"]),
              qty: Number(customerOrder.qty),
              rate: Number(product["price"] * customerOrder.qty),
              netAmount: Number(product["price"] * customerOrder.qty),
            },
          ],
        };
        const orderDetails: IOrder = await this.orderModel.create(orderData);
        orderId = orderDetails._id;
      }
      // calculate the order amounts
      await this.orderAmountCalculations(orderId);

      // get the order deteails
      const orderDetails = await this.getOrder(orderId);

      const responseData: APIResponseData = APIResponse.success(
        orderDetails,
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
   * @Desc updateQty the Order Product Qty / Remove Product
   * @param req {body: {productId, Qty, _id}}
   * @param res {Partial<Iorder>}
   * @returns {APIResponse}
   */

  async updateQty(req, res): Promise<APIResponseData> {
    try {
      // Get customerOrder From request
      const customerOrder: ICustomerOrder = req.body;
      const orderDetails = await this.getOrder(customerOrder._id);
      if (orderDetails.orderStatus === "COMPLETED")
        throw new Error(APIMessages.successErrorMessage.orderAlreadyPlaced);
      // check Item exist or not
      const product: IProduct | boolean =
        await productService.productAlreadyExist({
          id: customerOrder.productId,
        });

      // Check Product Exist or not in order

      const isProductExist = await this.orderModel.findOne({
        _id: customerOrder._id,
        "orderItems.productId": customerOrder.productId,
      });
      if (!isProductExist)
        throw new Error(APIMessages.successErrorMessage.dataNotFount);

      const orderItem: IOrderItemsBase = find(
        isProductExist.orderItems,
        function (orderItem) {
          return (
            orderItem.productId.toString() ===
            customerOrder.productId.toString()
          );
        }
      );

      if (customerOrder.qty > 0) {
        // Update qty

        await this.orderModel.findOneAndUpdate(
          {
            _id: customerOrder._id,
            "orderItems.productId": customerOrder.productId,
          },
          {
            $set: {
              "orderItems.$": {
                productId: customerOrder.productId,
                qty: Number(customerOrder.qty),
                rate: Number(product["price"] * customerOrder.qty),
                netAmount: Number(product["price"] * customerOrder.qty),
              },
            },
          }
        );
      } else {
        // Remove that Product
        await this.orderModel.findOneAndUpdate(
          {
            _id: customerOrder._id,
            "orderItems.productId": customerOrder.productId,
          },
          {
            $pull: {
              orderItems: {
                _id: orderItem._id,
              },
            },
          }
        );
      }
      // Order amount calculation after after items removed
      await this.orderAmountCalculations(customerOrder._id);
      const orderDetail = await this.getOrder(customerOrder._id);
      const responseData: APIResponseData = APIResponse.success(
        orderDetail,
        APIMessages.successErrorMessage.addedSuccessfully,
        200
      );
      return res.status(200).json(responseData);
    } catch (err) {
      // Get Order Error Response
      const result: APIResponseData = APIResponse.error(err.message, 402);
      // Return Order Error Response
      return res.status(500).json(result);
    }
  }

  /**
   * @Desc Remvoew the Order Product from order
   * @param req {body: {productId, _id}}
   * @param res {Partial<Iorder>}
   * @returns {APIResponse}
   */

  async removeOrderProduct(req, res): Promise<APIResponseData> {
    try {
      // Get customerOrder From request
      const customerOrder: ICustomerOrder = req.body;
      const orderDetails = await this.getOrder(customerOrder._id);
      if (orderDetails.orderStatus === "COMPLETED")
        throw new Error(APIMessages.successErrorMessage.orderAlreadyPlaced);
      // check Item exist or not
      const product: IProduct | boolean =
        await productService.productAlreadyExist({
          id: customerOrder.productId,
        });

      // check product exist or not in order

      const isProductExist = await this.orderModel.findOne({
        _id: customerOrder._id,
        "orderItems.productId": customerOrder.productId,
      });
      if (!isProductExist)
        throw new Error(APIMessages.successErrorMessage.dataNotFount);

      const orderItem: IOrderItemsBase = find(
        isProductExist.orderItems,
        function (orderItem) {
          return (
            orderItem.productId.toString() ===
            customerOrder.productId.toString()
          );
        }
      );
      // Remove that Product
      await this.orderModel.findOneAndUpdate(
        {
          _id: customerOrder._id,
          "orderItems.productId": customerOrder.productId,
        },
        {
          $pull: {
            orderItems: {
              _id: orderItem._id,
            },
          },
        }
      );

      // Calculations
      await this.orderAmountCalculations(customerOrder._id);
      const orderDetail = await this.getOrder(customerOrder._id);
      const responseData: APIResponseData = APIResponse.success(
        orderDetail,
        APIMessages.successErrorMessage.deletedSuccessfully,
        200
      );
      return res.status(200).json(responseData);
    } catch (err) {
      const result: APIResponseData = APIResponse.error(err.message, 402);
      return res.status(500).json(result);
    }
  }

  /**
   * @Desc Send the Order Details on api
   * @param req {params: {_id}}
   * @param res {Partial<Iorder>}
   * @returns {APIResponse}
   */

  async getOrderDetails(req, res): Promise<APIResponseData> {
    try {
      // Get Order Details
      const { id } = req.params;
      const orderDetails = await this.getOrder(id);
      const result: APIResponseData = APIResponse.success(
        orderDetails,
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
   * @Desc Get the Order Details
   * @param id {order->_id}
   */
  async getOrder(id): Promise<IOrder> {
    // Get Order Details
    const orderDetails: IOrder = await this.orderModel.findById(id).populate({
      path: "orderItems.productId",
      select: "name code _id price stock",
    });
    return orderDetails;
  }

  /**
   * @Desc Calculate the order amount after add / update / delete order's product
   * @param id {order->_id}
   */
  async orderAmountCalculations(id): Promise<void> {
    //  Order Amount calculations
    const orderAmount = await this.orderModel.aggregate([
      { $match: { _id: new ObjectId(id) } },
      { $unwind: { path: "$orderItems" } },
      {
        $group: {
          _id: null,
          totalOrderAmount: { $sum: "$orderItems.rate" },
          totaltaxAmount: { $sum: "$orderItems.taxAmount" },
          totalnetAmount: { $sum: "$orderItems.netAmount" },
        },
      },
    ]);
    await this.orderModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          orderAmount: orderAmount[0].totalOrderAmount,
          taxAmount: orderAmount[0].totaltaxAmount,
          netAmount: orderAmount[0].totalnetAmount,
        },
      }
    );
  }

  /**
   * @Desc Checkout the Order 
   * @param req {params: {_id}}
   * @param res {Partial<Iorder>}
   * @returns {APIResponse}
   */

  async checkout(req, res): Promise<APIResponseData> {
    try {
      const { id } = req.params;
      // check the stock
      const orderDetails = await this.getOrder(id);
      if (orderDetails.orderStatus === "COMPLETED")
        throw new Error(APIMessages.successErrorMessage.orderAlreadyPlaced);
      for (const orderItems of orderDetails.orderItems) {
        if (orderItems.qty > orderItems.productId.stock)
          throw new Error(APIMessages.successErrorMessage.stockIsNotAvaliable);
        break;
      }

      // reduce the stock and update the order status
      for (const orderItems of orderDetails.orderItems) {
        const product: IProduct = await this.productModel.findById(
          orderItems.productId._id
        );
        product.stock = Number(product.stock) - Number(orderItems.qty);
        product.save();
      }
      await this.orderModel.findByIdAndUpdate(id, { orderStatus: "COMPLETED" });

      const result: APIResponseData = APIResponse.success(
        orderDetails,
        APIMessages.successErrorMessage.orderPlaced,
        200
      );
      return res.status(200).json(result);
    } catch (err) {
      const result: APIResponseData = APIResponse.error(err.message, 402);
      return res.status(500).json(result);
    }
  }
}
