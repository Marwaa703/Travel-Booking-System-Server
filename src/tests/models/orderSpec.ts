import { Order, Orders } from "../../models/order";
import { Users } from "../../models/user";
import { crud, staticOrder, staticUser } from "./../../constants/testing";

const orderStore = new Orders();
const userStore = new Users();

describe("Order Model", () => {
  beforeAll(async () => {
    await userStore.create(staticUser);
  });

  crud.map((method) =>
    it(`Should have ${method} Method`, () => {
      expect(orderStore[method]).toBeDefined();
    })
  );

  it("Create Method should return a created Order", async () => {
    const product = await orderStore.create({
      ...staticOrder,
      user_id: 1,
    });
    expect(product?.user_id).toEqual(1);
  });

  it("Index Method should return a list of orders done by a user", async () => {
    const orderProducts: Order[] | undefined = await orderStore.index(1);
    expect(orderProducts?.length).toBeGreaterThan(0);
  });

  it("Show Method should return a single  Order", async () => {
    const orders = await orderStore.index(1);
    const order: Order | undefined = await orderStore.show(
      orders?.[0].id as unknown as number
    );
    expect(order?.user_id).toEqual(1);
  });

  it("Update Method should return a new updated Order", async () => {
    const orders = await orderStore.index(1);
    const updatedOrder: Order | undefined = await orderStore.update({
      id: orders?.[0].id as unknown as number,
      user_id: 1,
      status: "completed",
    });
    expect(updatedOrder?.status).toEqual("completed");
  });

  it("Delete Method should return a deleted Order", async () => {
    const orders = await orderStore.index(1);
    const deletedOrder: Order | undefined = await orderStore.destroy(
      orders?.[0].id as unknown as number
    );
    expect(deletedOrder?.user_id).toEqual(1);
  });
});
