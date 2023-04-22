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

exports.createItem = (req, res, next) => {

    if(req.body && Object.keys(req.body).length === 0 
            && Object.getPrototypeOf(req.body) === Object.prototype) { 
            return next(new Error("no request body")); 
    }
    const values =req.body.map(obj => Object.values(obj));
   
    conn.query(
        "INSERT INTO items (name,price,image, description) VALUES ?",
        [values],(err, data, fields) => {
            if(err) return next(err);
            res.status(201).json({
                status: "success",
               message: "item created!",
            });
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
                res.status(200).json({
                    status: 'success',
                    message: 'items updated'
                });
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
