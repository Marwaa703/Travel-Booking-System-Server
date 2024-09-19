import { Product, Products } from "../../models/product";
import { crud, staticProduct } from "./../../constants/testing";

const store = new Products();

describe("Product Model", () => {
  beforeAll(async () => {
    // remove all products
    const products = await store.index();
    products?.map(
      async (product) => await store.destroy(product.id as unknown as number)
    );
  });

  crud.map((method) =>
    it(`Should have ${method} Method`, () => {
      expect(store[method]).toBeDefined();
    })
  );

  it("Create Method should return a Product", async () => {
    const product = await store.create(staticProduct);

    expect(product?.name).toEqual(staticProduct?.name as unknown as string);
  });

  it("Index Method should return a list of products", async () => {
    const products: Product[] | undefined = await store.index();

    expect(products?.length).toBeGreaterThan(0);
  });
  it("Show Method should return a single  Product", async () => {
    const p: Product[] | undefined = await store.index();

    const product: Product | undefined = await store.show(
      p?.[0].id as unknown as number
    );
    expect(product?.name).toEqual(staticProduct.name);
  });
});
