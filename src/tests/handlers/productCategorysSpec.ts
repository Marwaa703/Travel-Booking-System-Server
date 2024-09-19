import supertest from "supertest";
import { categoryProductsApis } from "../../constants/testing";
import app from "../../index";
import { Categorys } from "../../models/category";
import { token } from "./../../constants/auth";
const categoryStore = new Categorys();

const req = supertest(app);

describe("Category Products Endpoint:", async () => {
  beforeAll(async () => {
    await categoryStore.create({ name: "Sun" });
  });

  describe("Test UnAuthorized endpoints:", () => {
    categoryProductsApis.map(({ code, method, msg, name, path }) => {
      it(`${name} endpoint should return status code of ${code}, ${msg} [UnAuthorized]`, async () => {
        const res = await req[method](path);
        expect(res.status).toBe(code);
      });
    });
  });

  describe("Test Authorized endpoints(protected):", () => {
    categoryProductsApis.map(({ valid_code, method, msg, name, path }) => {
      it(`${name} endpoint should return status code of ${valid_code}, ${msg} [Authorized]`, async () => {
        const res = await req[method](path)
          .set("Authorization", `JWT ${token}`)
          .send({
            category_id: 1,
            prodcut_id: 1,
          });
        expect(res.status).toBe(valid_code);
      });
    });
  });
});
