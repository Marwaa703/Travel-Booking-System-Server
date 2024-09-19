import { OrderProducts } from "../../models/orderProducts";

const store = new OrderProducts();

describe("OrderProducts Model", () => {
  it("should have addProductsToOrder Method", () => {
    expect(store.addProductsToOrder).toBeDefined();
  });
  it("should have getOrderProducts Method", () => {
    expect(store.getOrderProducts).toBeDefined();
  });
});
