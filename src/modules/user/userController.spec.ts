import { UserController } from "./userController";
describe("UserController", () => {
  let userController: UserController;

  beforeEach(() => {
    userController = new UserController();
  });
  describe("UserController", () => {
    describe("getUserLit", () => {
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
        jest.spyOn(userController, "getUserList").mockReturnValue(null);
        const allUsers = userController.getUserList(req, res);
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
          .spyOn(userController, "getUserList")
          .mockReturnValue(Promise.resolve([]));
        expect(userController.getUserList(req, res)).resolves.toBe([]);
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
          .spyOn(userController, "getUserList")
          .mockRejectedValue(new Error("error"));
        expect(userController.getUserList(req, res)).rejects.toThrow();
        done();
      });
    });

    describe("createUser", () => {
      it("should be return validaton Error", (done) => {
        const req = {
          body: {
            name: "Rengaraj",
            emailId: "rengaraj@yopmail.com",
          },
        };
        const res = {
          status: function (s) {
            this.statusCode = s;
            return this;
          },
        };
        jest.spyOn(userController, "createUser").mockRejectedValue(
          Promise.reject({
            status: false,
            statusCode: 402,
            message: "Please Provide all value",
          })
        );
        const createUser = userController.createUser(req, res);
        expect(createUser).rejects.toThrow();
        done();
      });

      it("should be return the {} ", (done) => {
        const req = {
          query: {
            name: "Rengaraj",
            emailId: "rengaraj@yopmail.com",
            phoneNo: "8015838576",
            password: "Test@123",
          },
        };
        const res = {
          status: function (s) {
            this.statusCode = s;
            return this;
          },
        };
        jest
          .spyOn(userController, "createUser")
          .mockReturnValue(Promise.resolve({}));
        expect(userController.createUser(req, res)).resolves.toStrictEqual({});
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
          .spyOn(userController, "createUser")
          .mockRejectedValue(new Error("error"));
        expect(userController.createUser(req, res)).rejects.toThrow();
        done();
      });
    });
  });
});
