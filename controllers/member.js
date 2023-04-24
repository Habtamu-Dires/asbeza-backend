const conn = require('../services/db');

exports.getAllMembers = (req, res, next) =>{
    conn.query("SELECT * FROM members", (err, data, fields)=>{
        if(err) return next(err);
        res.status(200).json({
            status: "success",
            length: data?.length,
            data: data,
        })
    })
}

exports.getMember = (req, res, next) =>{
    if(!req.params.memberId) {
        return next(new Error("not member found"));
    }
    conn.query("SELECT * FROM members WHERE id = ?",
    [req.params.memberId], (err, data, fields) => {
        if(err) return next(err);
        res.status(200).json({
            status: "success",
            length: data?.length,
            data: data
        })
    }
    
    )
}

exports.createMember = (req, res, next) => {
    if(req.body && Object.keys(req.body).length === 0 
            && Object.getPrototypeOf(req.body) === Object.prototype) { 
            return next(new Error("no request body")); 
    }
    let values = [];
    let id;
    if(Array.isArray(req.body)){
        values =req.body.map(obj => Object.values(obj));
        console.log('array' +  values);
        id = values[0][0];
    }
    else{
        values.push(Object.values(req.body));
        console.log('no array' + values);
        console.log(values[0][0])
        id = values[0][0];
    }
    console.log(values);
    conn.query(
        `INSERT INTO members (id, firstName, lastName, address, location) 
            VALUES ?`,
        [values],(err, data) => {
            if(err) return next(err);
            conn.query("SELECT * FROM members WHERE id=?", [id],
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

exports.deleteMember = (req, res, next) => {
    if(!req.params.memberId) {
        return next(new Error("not item id found"));
    }
    conn.query(
        "DELETE FROM members WHERE id=?",
        [req.params.memberId],(err,fields) => {
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
            "DELETE FROM members WHERE id=?",
            [id],(err,fields) => {
                if(err) return next(err); 
            }
        )}
    );
    conn.query("SELECT * FROM members", (err, data,fields)=>{
        if(err) return next(err);
        res.status(200).json({
            status: "success",
            length: data?.length,
            data: data,
        })
    })
}


