import supertest from "supertest";
import { userApis } from "../../constants/testing";
import app from "./../../index";
import { staticUser } from "./../../constants/testing";

import { Users } from "../../models/user";
import { token } from "./../../constants/auth";

const req = supertest(app);
const store = new Users();
describe("User Endpoint:", async () => {
  beforeAll(async () => {
    const users = await store.index();
    users?.map(
      async (user) => await store.destroy(user.id as unknown as number)
    );
  });

  describe("Test UnAuthorized endpoints:", () => {
    userApis.map((api) => {
      it(`${api.name} endpoint should return status of ${api.error_code}, ${
        api.msg
      } ${api.auth ? "[unAuthorized]" : "Token not required!"} `, async () => {
        try {
          const res = await req[api.method](api.path);

          expect(res.status).toBe(api.error_code);
        } catch (error) {
          console.log({ error });
        }
      });
    });
  });

  describe("Test public ednpoints", () => {
    it("Signup should return  a token with 200 for successfully creating user", async () => {
      const res = await req.post("/api/signup").send(staticUser);
      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
    });
    it("login should return a status of 200 for successfully loing with correct credentils", async () => {
      const res = await req
        .post("/api/login")
        .send({ username: staticUser.username, password: staticUser.password });

      expect(res.status).toBe(200);
    });
  });
  describe("Test Authorized endpoints(protected):", () => {
    userApis.map(({ name, auth, method, msg, path, valid_code }) => {
      if (auth) {
        it(`${name} endpoint should return status of ${valid_code}, ${msg} [Authorized][valid token]`, async () => {
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
