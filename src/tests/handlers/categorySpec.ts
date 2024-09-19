import supertest from "supertest";
import { categorysApis } from "../../constants/testing";
import app from "../../index";
import { token } from "./../../constants/auth";

const req = supertest(app);

describe("Category Endpoint:", async () => {
  describe("UnAuthorized endpoints", () => {
    categorysApis.map(({ code, method, msg, name, path }) => {
      it(`${name} endpoint should return status code of ${code}, ${msg} $[UnAuthorized] `, async () => {
        const res = await req[method](path);

        expect(res.status).toBe(code);
      });
    });
  });
  describe("Authorized endpoints(protected)", () => {
    categorysApis.map(({ valid_code, method, msg, name, path }) => {
      it(`${name} endpoint should return status code of ${valid_code}, ${msg} $[Authorized] `, async () => {
        if (method === "post") {
          const res = await req[method](path)
            .set("Authorization", `JWT ${token}`)
            .send({ name: "Sun" });
          expect(res.status).toBe(valid_code);
        } else if (method === "put") {
          const res = await req[method](path)
            .set("Authorization", `JWT ${token}`)
            .send({
              name: "Medical",
            });
          expect(res.status).toBe(valid_code);
        } else {
          const res = await req[method](path).set(
            "Authorization",
            `JWT ${token}`
          );
          expect(res.status).toBe(valid_code);
        }
      });
    });
  });
});
