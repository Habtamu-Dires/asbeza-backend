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

exports.updaeOrder = (req, res, next ) => {
    console.log(req.body);
    console.log(req.params.orderId)
    if(!req.params.orderId) {
        return next(new Error("No order id found"));
    }
    const orderNum = req.body.orderNum;
    conn.query(
        `UPDATE orders SET 
            paymentStatus = ${req.body.paymentStatus ? 1 : 0},
            deliveryStatus=${req.body.deliveryStatus ? 1 : 0},
            remark=COALESCE(${req.body.remark 
                ? '"'+req.body.remark+'"' 
                : null}, '')
            WHERE orderNum=?`,
            [orderNum],(err, data, fields) => {
            if(err) return next(err);
            conn.query("SELECT * FROM orders WHERE orderNum=?", [orderNum],
            (err, data,fields)=>{
                if(err) return next(err);
                res.status(200).json({
                    status: "success",
                    length: data?.length,
                    data: data,
                })
            })
            }
    );
}

exports.deleteOrder = (req, res, next) => {
    if(!req.params.orderId) {
        return next(new Error("not orderNum found"));
    }
    const orderNum = req.params.orderId;
    conn.query(
        "DELETE FROM orders WHERE orderNum=?",
        [orderNum],(err,fields) => {
            if(err) return next(err);
            res.status(200).json({
                status: "success",
                message: "order deleted!"
            })
        }
    )
}

exports.deleteMany = (req, res, next) => {
    console.log('params')
    console.log(req.query.filter);
    const arrOfid= JSON.parse(req.query.filter);
    console.log(arrOfid.id)
    console.log(arrOfid.id.length)
    const ids = arrOfid.id;
    /*
    ids.map(id => {
        console.log("the id " , id);
        conn.query(
            "DELETE FROM orders WHERE id=?",
            [id],(err,fields) => {
                if(err) return next(err); 
            }
        )}
    );
    */
    conn.query("SELECT * FROM orders", (err, data,fields)=>{
        if(err) return next(err);
        res.status(200).json({
            status: "success",
            length: data?.length,
            data: data,
        })
    })
}
