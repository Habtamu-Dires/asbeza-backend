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
    console.log(req.body);
    const parsed = JSON.parse(req.body.orders);
    console.log(parsed)
    const values = parsed.map(obj => Object.values(obj));
    
    
    conn.query(
        `INSERT INTO orders (order_number, member_id, payment_option, transaction_number, 
            datetime, payment_status,delivery_status, remark,comment,total_price, 
            product_id, count ) VALUES ? `, [values],
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
    console.log("The thing is");
    console.log(req.body);
    console.log(req.params.orderId)
    if(!req.params.orderId) {
        return next(new Error("No order id found"));
    }
    const orderNum = req.body.orderId;
    conn.query(
        `UPDATE orders SET 
            payment_status = ${req.body.payment_status ? 1 : 0},
            delivery_status=${req.body.delivery_status ? 1 : 0},
            remark=COALESCE(${req.body.remark 
                ? '"'+req.body.remark+'"' 
                : null}, '')
            WHERE order_number=?`,
            [orderNum],(err, data, fields) => {
            if(err) return next(err);
            conn.query("SELECT * FROM orders WHERE order_number=?", [orderNum],
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
        return next(new Error("not order_number found"));
    }
    const orderNum = req.params.orderId;
    console.log("The order number " + orderNum);
    conn.query(
        "DELETE FROM orders WHERE order_number=?",
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
    console.log("the ids " +  ids);

    try {
        for(let id of ids){
            var order_number;
            console.log(id)
            conn.query(
                "SELECT order_number FROM orders WHERE id=?",
                [id],(err, data,fields) => {
                    if(err) return next(err);
                    order_number = data[0]['order_number'];
                    console.log(data);
                    console.log("order number", order_number)
                    //the 
                     conn.query(
                        "DELETE FROM orders WHERE order_number=?",
                        [order_number],(err,fields) => {
                            if(err) return next(err);
                            
                        }
                    )  
                }
            )
            

            /* 
            conn.query(
                "DELETE FROM orders WHERE order_number=?",
                [order_number],(err,fields) => {
                    if(err) return next(err);
                    res.status(200).json({
                        status: "success",
                        message: "order deleted!"
                    })
                }
            ) 
            */   
        }
    } catch (error) {
            console.log("errorr", error);
    }
    
    conn.query("SELECT * FROM orders", (err, data,fields)=>{
        if(err) return next(err);
        res.status(200).json({
            status: "success",
            length: data?.length,
            data: data,
        })
    })
}
