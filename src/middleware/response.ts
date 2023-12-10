import { Pagination } from "../utils/commonInterfaces";

export interface APIResponseData {
  status: boolean;
  data?: object;
  statusCode: number | string;
  message: string;
  pagination?: Pagination;
}

export class APIResponse {
  /**
   * @desc    This class contain Success and Error response for sending to client / user
   * @author  Rengaraj
   * @since   2021
   */

  /**
 * @desc    Send any success response
 *  @param  {object} data
 * @param   {string} message
 * @param   {number | string} statusCode
 * @param   {pagination | null } pagination

 */
  static success(
    data: any,
    message: string,
    code: number | string,
    pagination: Pagination = null
  ): APIResponseData {
    if (pagination) {
      pagination.totalPages = Math.ceil(
        pagination.totalRecords / pagination.recordPerPage
      );
      return {
        status: true,
        statusCode: code,
        message: message,
        data: data,
        pagination:pagination
      };
    }
    return {
      status: true,
      statusCode: code,
      message: message,
      data: data,
    };
  }

  static error(message: any, code: number): APIResponseData {
    return {
      status: false,
      statusCode: code,
      message: message,
    };
  }
}
