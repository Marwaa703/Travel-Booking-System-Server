import { ProductCategorys } from "../../models/productCategorys";

const store = new ProductCategorys();

describe("ProductCategorys Model", () => {
  it("should have addProductToCategorys Method", () => {
    expect(store.addProductToCategorys).toBeDefined();
  });
});
