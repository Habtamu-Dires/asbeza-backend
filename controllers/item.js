const conn = require('../services/db');

exports.getAllItems = (req, res, next) => {
    conn.query("SELECT * FROM items", (err, data,fields)=>{
        if(err) return next(err);
        res.status(200).json({
            status: "success",
            length: data?.length,
            data: data,
        })
    })
}

exports.getItem = (req, res, next) => {

    if(!req.params.itemId) {
        console.log('no item id')
        return next(new Error("not item id found"));
    }
    conn.query("SELECT * FROM items WHERE id=?",
    [req.params.itemId] ,
    (err, data, fields)=>{
        if(err) return next(err);
        res.status(200).json({
            status: "success",
            length: data?.length,
            data: data,
        })
    })
}

exports.createItem = (req, res, next) => {
    
    if(req.body && Object.keys(req.body).length === 0 
            && Object.getPrototypeOf(req.body) === Object.prototype) { 
            return next(new Error("no request body")); 
    }
    let values = [];
    if(Array.isArray(req.body)){
        values =req.body.map(obj => Object.values(obj));
    }
    else{
        values.push(Object.values(req.body));
    }
   
    conn.query(
        "INSERT INTO items (name,price, description, image) VALUES ?",
        [values],(err, data) => {
            if(err) return next(err);
            conn.query("SELECT * FROM items WHERE id=?", [data.insertId],
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

exports.updateItem = (req,res,next) => {
    if(!req.params.itemId) {
        return next(new Error("No item id found"));
    }
    conn.query(
        `UPDATE items SET 
            name = COALESCE(${req.body.name ? '"'+req.body.name+'"' 
                : null}, name),
            price=COALESCE(${req.body.price ? req.body.price 
                : null}, price),
            image=COALESCE(${req.body.image ? '"'+req.body.image+'"' 
                    : null}, image),
            description=COALESCE(${req.body.description ? '"'+req.body.description+'"' 
                    : null}, description)
            WHERE id=?`,
            [req.params.itemId],(err, data, fields) => {
            if(err) return next(err);
            conn.query("SELECT * FROM items WHERE id=?", [req.params.itemId],
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

exports.deleteItem = (req, res, next) => {
    if(!req.params.itemId) {
        return next(new Error("not item id found"));
    }
    conn.query(
        "DELETE FROM items WHERE id=?",
        [req.params.itemId],(err,fields) => {
            if(err) return next(err);
            res.status(200).json({
                status: "success",
                message: "item deleted!"
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
            "DELETE FROM items WHERE id=?",
            [id],(err,fields) => {
                if(err) return next(err); 
            }
        )}
    );
    conn.query("SELECT * FROM items", (err, data,fields)=>{
        if(err) return next(err);
        res.status(200).json({
            status: "success",
            length: data?.length,
            data: data,
        })
    })
}


