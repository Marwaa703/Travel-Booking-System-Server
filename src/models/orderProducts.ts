import db from "./../database";

export type OrderProduct = {
  id?: number;
  product_id: number;
  order_id: number;
  user_id: number;
  product_quantity: number;
};

export class OrderProducts {
  async addProductsToOrder(
    ops: OrderProduct
  ): Promise<OrderProduct | undefined> {
    // check the status of the order
    try {
      const conn = await db.connect();
      const sql = "SELECT * FROM orders WHERE id=$1";

      const result = await conn.query(sql, [ops.order_id]);
      const order = result.rows[0];
      conn.release();

      if (order.status === "complete") {
        throw new Error(
          `Error adding product with id: ${ops.product_id} to order: ${ops.order_id}  as order's status is ${order.status}`
        );
      }
    } catch (error) {
      throw new Error(`Error adding product to order, error: ${error}`);
    }
    // add products to orderProducts table
    try {
      const conn = await db.connect();
      const sql =
        "INSERT INTO order_products (product_id, order_id, user_id, product_quantity) VALUES($1,$2,$3,$4)";
      const result = await conn.query(sql, [
        ops.product_id,
        ops.order_id,
        ops.user_id,
        ops.product_quantity,
      ]);

      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error adding product to order, error: ${error}`);
    }
  }
  async getOrderProducts(
    order_id: number
  ): Promise<OrderProduct[] | undefined> {
    try {
      const conn = await db.connect();
      const sql =
        "SELECT * FROM order_products INNER JOIN orders ON order_products.order_id = orders.id WHERE order_id=$1";

      const result = await conn.query(sql, [order_id]);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(
        `Error getting product of order with id = ${order_id}, error: ${error}`
      );
    }
  }
}
