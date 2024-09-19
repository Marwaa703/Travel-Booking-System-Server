import supertest from "supertest";
import app from "../../index";
import { staticUser } from "./../../constants/testing";
import { orderProductsApis } from "../../constants/testing";
import { Orders } from "../../models/order";
import { token } from "../../constants/auth";
const orderStore = new Orders();
const req = supertest(app);

describe("Order Products Endpoint:", async () => {
  beforeAll(async () => {
    await orderStore.create({ status: "active", user_id: 1 });
  });

  describe("Test UnAuthorized endpoints:", () => {
    orderProductsApis.map(({ code, method, msg, name, path }) => {
      it(`${name} endpoint should return status code of ${code}, ${msg} [UnAuthorized]`, async () => {
        const res = await req[method](path);
        expect(res.status).toBe(code);
      });
    });
  });
  describe("Test Authorized endpoints(protected):", () => {
    orderProductsApis.map(({ auth, method, msg, name, path, valid_code }) => {
      if (auth)
        it(`${name} endpoint should return status code of ${valid_code}, ${msg} [Authorized]`, async () => {
          const res = await req[method](path)
            .set("Authorization", `JWT ${token}`)
            .send({
              product_id: 1,
              order_id: 1,
              user_id: 1,
              product_quantity: 2,
            });

          expect(res.status).toBe(valid_code);
        });
    });
  });
});
