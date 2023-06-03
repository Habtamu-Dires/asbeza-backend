const conn = require('../services/db');

exports.getAllMembers = async (req, res, next) => {
    try {
      const [data, fields] = await conn.query("SELECT * FROM members");
      res.status(200).json({
        status: "success",
        length: data?.length,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  };
  
  exports.getMember = async (req, res, next) => {
    try {
      if (!req.params.memberId) {
        throw new Error("not member found");
      }
      const [data, fields] = await conn.query("SELECT * FROM members WHERE id=?", [req.params.memberId]);
      res.status(200).json({
        status: "success",
        length: data?.length,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  };
  
  exports.createMember = async (req, res, next) => {
    try {
      if (!req.body || Object.keys(req.body).length === 0 || Object.getPrototypeOf(req.body) !== Object.prototype) {
        throw new Error("no request body");
      }
      let values = [];
      let id;
      if (Array.isArray(req.body)) {
        values = req.body.map(obj => Object.values(obj));
        console.log('array' + values);
        id = values[0][0];
      } else {
        values.push(Object.values(req.body));
        console.log('no array' + values);
        console.log(values[0][0]);
        id = values[0][0];
      }
      console.log(values);
  
      await conn.query(
        `INSERT INTO members (id, firstName, lastName, address, location) VALUES ?`,
        [values]
      );
  
      const [data, fields] = await conn.query("SELECT * FROM members WHERE id=?", [id]);
      res.status(200).json({
        status: "success",
        length: data?.length,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  };
  
  exports.deleteMember = async (req, res, next) => {
    try {
      if (!req.params.memberId) {
        throw new Error("not item id found");
      }
      await conn.query("DELETE FROM members WHERE id=?", [req.params.memberId]);
      res.status(200).json({
        status: "success",
        message: "item deleted!",
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
      for (let id of ids) {
        console.log("the id ", id);
        await conn.query("DELETE FROM members WHERE id=?", [id]);
      }
  
      const [data, fields] = await conn.query("SELECT * FROM members");
      res.status(200).json({
        status: "success",
        length: data?.length,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  };
  