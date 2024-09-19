import { Categorys } from "../../models/category";
import { crud } from "./../../constants/testing";

const store = new Categorys();

describe("Category Model", () => {
  crud.map((method) =>
    it(`Should have ${method} Method`, () => {
      expect(store[method]).toBeDefined();
    })
  );
});
