import supertest from "supertest";
import { ordersApis } from "../../constants/testing";
import app from "../../index";
import { token } from "./../../constants/auth";

const req = supertest(app);

describe("Order Endpoint:", async () => {
  describe("Test UnAuthorized endpoints", () => {
    ordersApis.map(({ code, method, msg, name, path }) => {
      it(`${name} endpoint should return status code of ${code}, ${msg} request headers missing token [token required]"`, async () => {
        const res = await req[method](path);
        expect(res.status).toBe(code);
      });
    });
  });
  describe("Test Authorized endpoints", () => {
    ordersApis.map(({ valid_code, method, msg, name, path }) => {
      it(`${name} endpoint should return status code of ${valid_code}, ${msg}[Authorized]"`, async () => {
        const res = await req[method](path).set(
          "Authorization",
          `JWT ${token}`
        );
        expect(res.status).toBe(valid_code);
      });
    });
  });
});
