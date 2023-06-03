const conn = require('../services/db');

exports.getAllOrders = async (req, res, next) => {
    try {
      const [data, fields] = await conn.query("SELECT * FROM orders");
      res.status(200).json({
        status: "success",
        length: data?.length,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  };
  
  exports.getOrderById = async (req, res, next) => {
    try {
      if (!req.params.orderId) {
        throw new Error("not item id found");
      }
      const [data, fields] = await conn.query("SELECT * FROM orders WHERE id=?", [req.params.orderId]);
      res.status(200).json({
        status: "success",
        length: data?.length,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  };
  
  exports.createOrder = async (req, res, next) => {
    try {
      if (!req.body || Object.keys(req.body).length === 0 || Object.getPrototypeOf(req.body) !== Object.prototype) {
        throw new Error("no request body");
      }
      console.log(req.body);
      const parsed = JSON.parse(req.body.orders);
      console.log(parsed);
      const values = parsed.map(obj => Object.values(obj));
  
      await conn.query(
        `INSERT INTO orders (order_number, member_id, payment_option, transaction_number, datetime, payment_status, delivery_status, remark, comment, total_price, product_id, count) VALUES ? `,
        [values]
      );
  
      res.status(200).json({
        status: "success",
        message: "order created",
      });
    } catch (error) {
      next(error);
    }
  };
  
  exports.updaeOrder = async (req, res, next) => {
    try {
      console.log("The thing is");
      console.log(req.body);
      console.log(req.params.orderId);
      if (!req.params.orderId) {
        throw new Error("No order id found");
      }
      const orderNum = req.body.orderId;
      await conn.query(
        `UPDATE orders SET 
          payment_status = ${req.body.payment_status ? 1 : 0},
          delivery_status = ${req.body.delivery_status ? 1 : 0},
          remark = COALESCE(${req.body.remark ? '"' + req.body.remark + '"' : null}, '')
        WHERE order_number=?`,
        [orderNum]
      );
  
      const [data, fields] = await conn.query("SELECT * FROM orders WHERE order_number=?", [orderNum]);
      res.status(200).json({
        status: "success",
        length: data?.length,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  };
  
  exports.deleteOrder = async (req, res, next) => {
    try {
      if (!req.params.orderId) {
        throw new Error("not order_number found");
      }
      const orderNum = req.params.orderId;
      console.log("The order number " + orderNum);
      await conn.query("DELETE FROM orders WHERE order_number=?", [orderNum]);
      res.status(200).json({
        status: "success",
        message: "order deleted!",
      });
    } catch (error) {
      next(error);
    }
  };
  
  exports.deleteMany = async (req, res, next) => {
    try {
      console.log('params');
      console.log(req.query.filter);
      const arrOfid = JSON.parse(req.query.filter);
      console.log(arrOfid.id);
      console.log(arrOfid.id.length);
      const ids = arrOfid.id;
      console.log("the ids " +  ids);
  
      for (let id of ids) {
        let order_number;
        console.log(id);
        const [data, fields] = await conn.query("SELECT order_number FROM orders WHERE id=?", [id]);
        order_number = data[0]['order_number'];
        console.log(data);
        console.log("order number", order_number);
  
        await conn.query("DELETE FROM orders WHERE order_number=?", [order_number]);
      }
  
      const [data, fields] = await conn.query("SELECT * FROM orders");
      res.status(200).json({
        status: "success",
        length: data?.length,
        data: data,
      });
    } catch (error) {
      console.log("errorr", error);
      next(error);
    }
  };
  