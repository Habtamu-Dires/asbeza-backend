const conn = require('../services/db');


exports.getAllOrders = (req, res, next) => {
    conn.query("SELECT * FROM orders", (err,data,fields)=>{
        if(err) return next(err);
        res.status(200).json({
            status: "success",
            length: data?.length,
            data: data
        })
    })
}

exports.getOrderById = (req, res, next) =>{
    if(!req.params.orderId) {
        return next(new Error("not item id found"));
    }
    conn.query("SELECT * FROM orders WHERE id=(?)",
        [req.params.orderId],(err,data,fields)=>{
            if(err) return next(err);
            res.status(200).json({
                status: "success",
                length: data?.length,
                data: data
            })
        })
}

exports.createOrder = (req, res, next) => {
    if(req.body && Object.keys(req.body).length === 0 
            && Object.getPrototypeOf(req.body) === Object.prototype) { 
            return next(new Error("no request body")); 
    }

    const parsed = JSON.parse(req.body.order);
    const values = parsed.map(obj => Object.values(obj));
    
    conn.query(
        `INSERT INTO orders (orderNum, memberId, paymentOption, transactionNum, 
            datetime, paymentStatus,deliveryStatus, remark,comment,totalPrice, 
            itemId, count ) VALUES ? `, [values],
          (err,data,fields) =>{
            if(err) return next(err)
            res.status(200).json({
                status: "success",
                message: "order created"
            })
         } 
    )    
}

exports.deleteOrder = (req, res, next) => {
    if(!req.params.orderId) {
        return next(new Error("not order id found"));
    }
    conn.query(
        "DELETE FROM orders WHERE id=?",
        [req.params.orderId],(err,fields) => {
            if(err) return next(err);
            res.status(200).json({
                status: "success",
                message: "order deleted!"
            })
        }
    )
    }
