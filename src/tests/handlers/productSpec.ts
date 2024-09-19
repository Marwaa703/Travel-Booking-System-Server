import supertest from "supertest";
import { productsApis, staticProduct } from "../../constants/testing";
import app from "./../../index";

import { Product, Products } from "../../models/product";
import { token } from "./../../constants/auth";
const req = supertest(app);

const store = new Products();

describe("OrderProducts Endpoint:", async () => {
  beforeAll(async () => {
    const products: Product[] | undefined = await store.index();

    products?.map(async (p) => await store.destroy(p.id as number));
  });

  describe("Test UnAuthorized endpoints:", () => {
    productsApis.map(({ auth, code, method, msg, name, path }) => {
      if (auth) {
        it(`${name} endpoint should return status of ${code}, ${msg} [UnAuthorized]`, async () => {
          const res = await req[method](path);
          expect(res.status).toBe(code);
        });
      }
    });
  });

  describe("Test public ednpoints", () => {
    productsApis.map(({ auth, code, method, msg, name, path }) => {
      if (!auth) {
        it(`${name} endpoint should return status of ${code}, ${msg} [Public]`, async () => {
          const res = await req[method](path);
          expect(res.status).toBe(code);
        });
      }
    });
  });
  describe("Test Authorized endpoints(protected):", async () => {
    productsApis.map(({ name, auth, method, msg, path, valid_code }) => {
      if (auth) {
        it(`${name} endpoint should return status of ${200}, ${msg} [Authorized][valid token]`, async () => {
          if (method === "post") {
            const res = await req[method](path)
              .set("Authorization", `JWT ${token}`)
              .send(staticProduct);
            expect(res.status).toBe(valid_code);
          }
          if (method === "put") {
            const res = await req[method](path)
              .set("Authorization", `JWT ${token}`)
              .send({
                id: 5,
                name: "Master Sunglass",
                price: 250,
                quantity: 20,
                category: "Sun",
              });
            expect(res.status).toBe(valid_code);
          }
          const res = await req[method](path).set(
            "Authorization",
            `JWT ${token}`
          );
          expect(res.status).toBe(valid_code);
        });
      }
    });
  });
});
