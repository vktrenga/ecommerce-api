import { ProductController } from "./productController";
describe("ProductController", () => {
  let productController: ProductController;

  beforeEach(() => {
    productController = new ProductController();
  });
  describe("ProductController", () => {
    describe("getAll Products", () => {
      it("should get null", (done) => {
        const req = {
          query: {
            limit: 10,
            page: 1,
          },
        };
        const res = {
          status: function (s) {
            this.statusCode = s;
            return this;
          },
        };
        jest.spyOn(productController, "listProduct").mockReturnValue(null);
        const allUsers = productController.listProduct(req, res);
        expect(allUsers).toBeNull();
        done();
      });

      it("should return the array value", (done) => {
        const req = {
          query: {
            limit: 10,
            page: 1,
          },
        };
        const res = {
          status: function (s) {
            this.statusCode = s;
            return this;
          },
        };
        jest
          .spyOn(productController, "listProduct")
          .mockReturnValue(Promise.resolve([]));
        expect(productController.listProduct(req, res)).resolves.toBe([]);
        done();
      });

      it("should be the Error", (done) => {
        const req = {
          query: {
            limit: 10,
            page: 1,
          },
        };
        const res = {
          status: function (s) {
            this.statusCode = s;
            return this;
          },
        };
        jest
          .spyOn(productController, "listProduct")
          .mockRejectedValue(new Error("error"));
        expect(productController.listProduct(req, res)).rejects.toThrow();
        done();
      });
    });

    describe("createProdcut", () => {
      it("should be return validaton Error", (done) => {
        const req = {
          body: {
            name: "pencil",
            code: "pencil-001",
            price: 100,
            stock: 20,
          },
        };
        const res = {
          status: function (s) {
            this.statusCode = s;
            return this;
          },
        };
        jest.spyOn(productController, "addProduct").mockRejectedValue(
          Promise.reject({
            status: false,
            statusCode: 402,
            message: "Please Provide all value",
          })
        );
        const createUser = productController.addProduct(req, res);
        expect(createUser).rejects.toThrow();
        done();
      });

      it("should be return the {} ", (done) => {
        const req = {
          body: {
            name: "pencil",
            code: "pencil-001",
            price: 100,
            stock: 20,
          },
        };
        const res = {
          status: function (s) {
            this.statusCode = s;
            return this;
          },
        };
        jest
          .spyOn(productController, "addProduct")
          .mockReturnValue(Promise.resolve({}));
        expect(productController.addProduct(req, res)).resolves.toStrictEqual(
          {}
        );
        done();
      });

      it("should be the Error", (done) => {
        const req = {
          body: {
            limit: 10,
            page: 1,
          },
        };
        const res = {
          status: function (s) {
            this.statusCode = s;
            return this;
          },
        };
        jest
          .spyOn(productController, "addProduct")
          .mockRejectedValue(new Error("error"));
        expect(productController.addProduct(req, res)).rejects.toThrow();
        done();
      });
    });
  });
});
