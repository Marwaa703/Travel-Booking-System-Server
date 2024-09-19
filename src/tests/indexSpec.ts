import supertest from "supertest";
import app from "../index";

const req = supertest(app);
describe("Main: Testing Endpoints", async () => {
  it("should display response at /", async () => {
    const res = await req.get("/");
    expect(res.status).toBe(200);
  });
});
