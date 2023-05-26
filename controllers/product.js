const conn = require('../services/db');

exports.getAllProducts = (req, res, next) => {
    conn.query("SELECT * FROM products", (err, data,fields)=>{
        if(err) return next(err);
        res.status(200).json({
            status: "success",
            length: data?.length,
            data: data,
        })
    })
}

exports.getProduct = (req, res, next) => {

    if(!req.params.productId) {
        console.log('no product id')
        return next(new Error("not product id found"));
    }
    conn.query("SELECT * FROM products WHERE product_id=?",
    [req.params.productId] ,
    (err, data, fields)=>{
        if(err) return next(err);
        res.status(200).json({
            status: "success",
            length: data?.length,
            data: data,
        })
    })
}

exports.createProduct = (req, res, next) => {
    
    if(req.body && Object.keys(req.body).length === 0 
            && Object.getPrototypeOf(req.body) === Object.prototype) { 
            return next(new Error("no request body")); 
    }
    let values = [];
    if(Array.isArray(req.body)){
        values =req.body.map(obj => {
            obj.timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
            return Object.values(obj)
        });
    }
    else{
        console.log(req.body);
        req.body.timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        values.push(Object.values(req.body));
    }
   
    conn.query(
        `INSERT INTO products  (product_name, emoji, category, unit, 
            unit_selling_price, unit_buying_price, status, timestamp ) VALUES ?`,
        [values],(err, data) => {
            if(err) return next(err);
            conn.query("SELECT * FROM products WHERE product_id=?", [data.insertId],
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

 exports.updateProduct = (req,res,next) => {
    if(!req.params.productId) {
        return next(new Error("No product id found"));
    }
    /* req.body = req.body= {'category': req.body.category, 'product_name': req.body.product_name, 
                         'emoji': req.body.emoji}; */
    console.log(req.body);
    conn.query(
        `UPDATE products SET 
            product_name = COALESCE(${req.body.product_name ? "'"+req.body.product_name+"'" 
                : null}, product_name),
            unit_selling_price=COALESCE(${req.body.unit_selling_price ? Number(req.body.unit_selling_price) 
                : null}, unit_selling_price),
            unit_buying_price=COALESCE(${req.body.unit_buying_price ? Number(req.body.unit_buying_price) 
                    : null}, unit_buying_price),
            unit=COALESCE(${req.body.unit ? "'"+req.body.unit +"'"
                    : null}, unit),
            status=COALESCE(${req.body.status ? "'"+req.body.status+"'"
                    : null}, status),    
            emoji=COALESCE(${req.body.emoji ? "'"+req.body.emoji+"'"
                    : null}, emoji),
            category=COALESCE(${req.body.category ? "'"+req.body.category+"'"
                    : null}, category)
            WHERE product_id=?`,
            [req.params.productId],(err, data, fields) => {
            if(err) return next(err);
            conn.query("SELECT * FROM products WHERE product_id=?", [req.params.productId],
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
    /**
     * ,
            timestamp=COALESCE(${req.body.timestamp ? "'"+req.body.timestamp+"'"
                    : null}, timestamp)
     */
} 
 
exports.deleteProduct = (req, res, next) => {
    if(!req.params.productId) {
        return next(new Error("not pordcut id found"));
    }
    conn.query(
        "DELETE FROM products WHERE product_id=?",
        [req.params.productId],(err,fields) => {
            if(err) return next(err);
            res.status(200).json({
                status: "success",
                message: "product deleted!"
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
    ids.map(id => {
        console.log("the id " , id);
        conn.query(
            "DELETE FROM products WHERE product_id=?",
            [id],(err,fields) => {
                if(err) return next(err); 
            }
        )}
    );
    conn.query("SELECT * FROM products", (err, data,fields)=>{
        if(err) return next(err);
        res.status(200).json({
            status: "success",
            length: data?.length,
            data: data,
        })
    })
}

