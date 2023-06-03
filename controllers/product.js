const conn = require('../services/db');

/*exports.getAllProducts = (req, res, next) => {
    conn.query("SELECT * FROM products", (err, data,fields)=>{
        if(err) return next(err);
        res.status(200).json({
            status: "success",
            length: data?.length,
            data: data,
        })
    })
} */
exports.getAllProducts = async (req, res, next) => {
    try {
      const [data, fields] = await conn.query("SELECT * FROM products");
      res.status(200).json({
        status: "success",
        length: data?.length,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  };

  exports.getProduct = async (req, res, next) => {
    try {
      if (!req.params.productId) {
        console.log('no product id');
        throw new Error("no product id found");
      }
      const [data, fields] = await conn.query("SELECT * FROM products WHERE product_id=?", [req.params.productId]);
      res.status(200).json({
        status: "success",
        length: data?.length,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  };
  
  exports.createProduct = async (req, res, next) => {
    try {
      if (!req.body || Object.keys(req.body).length === 0 || Object.getPrototypeOf(req.body) !== Object.prototype) {
        throw new Error("no request body");
      }
      let values = [];
      if (Array.isArray(req.body)) {
        values = req.body.map(obj => {
          obj.timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
          return Object.values(obj);
        });
      } else {
        console.log(req.body);
        req.body.timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        values.push(Object.values(req.body));
      }
  
      const [data] = await conn.query("INSERT INTO products  (product_name, emoji, category, unit, unit_selling_price, unit_buying_price, status, timestamp) VALUES ?", [values]);
      const [productData] = await conn.query("SELECT * FROM products WHERE product_id=?", [data.insertId]);
      res.status(200).json({
        status: "success",
        length: productData?.length,
        data: productData,
      });
    } catch (error) {
      next(error);
    }
  };
  
  exports.updateProduct = async (req, res, next) => {
    try {
      if (!req.params.productId) {
        throw new Error("No product id found");
      }
      console.log(req.body);
      const [data] = await conn.query(
        `UPDATE products SET 
          product_name = COALESCE(${req.body.product_name ? "'" + req.body.product_name + "'" : null}, product_name),
          unit_selling_price = COALESCE(${req.body.unit_selling_price ? Number(req.body.unit_selling_price) : null}, unit_selling_price),
          unit_buying_price = COALESCE(${req.body.unit_buying_price ? Number(req.body.unit_buying_price) : null}, unit_buying_price),
          unit = COALESCE(${req.body.unit ? "'" + req.body.unit + "'" : null}, unit),
          status = COALESCE(${req.body.status ? "'" + req.body.status + "'" : null}, status),    
          emoji = COALESCE(${req.body.emoji ? "'" + req.body.emoji + "'" : null}, emoji),
          category = COALESCE(${req.body.category ? "'" + req.body.category + "'" : null}, category)
        WHERE product_id=?`,
        [req.params.productId]
      );
      const [productData] = await conn.query("SELECT * FROM products WHERE product_id=?", [req.params.productId]);
      res.status(200).json({
        status: "success",
        length: productData?.length,
        data: productData,
      });
    } catch (error) {
      next(error);
    }
  };
  
  exports.deleteProduct = async (req, res, next) => {
    try {
      if (!req.params.productId) {
        throw new Error("no product id found");
      }
      await conn.query("DELETE FROM products WHERE product_id=?", [req.params.productId]);
      res.status(200).json({
        status: "success",
        message: "product deleted!",
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
      for (const id of ids) {
        console.log("the id ", id);
        await conn.query("DELETE FROM products WHERE product_id=?", [id]);
      }
      const [data] = await conn.query("SELECT * FROM products");
      res.status(200).json({
        status: "success",
        length: data?.length,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  };
  

