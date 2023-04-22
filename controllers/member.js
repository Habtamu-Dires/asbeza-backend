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

exports.getByMemberId = (req, res, next) =>{
    if(!req.params.memberId) {
        return next(new Error("not member found"));
    }
    conn.query("SELECT * FROM members WHERE memberId = ?",
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