const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../controllers/member');
const cors = require('../cors');

const memberRouter= express.Router();

memberRouter.use(bodyParser.json());

memberRouter.route('/')
.options(cors.corsWithOptions, (req,res)=>{res.sendStatus(200)})
.get(cors.cors, controllers.getAllMembers)
.post(cors.cors, controllers.createMember)
.delete(cors.cors, controllers.deleteMany)

//with id
memberRouter.route('/:memberId')
.options(cors.corsWithOptions, (req,res)=>{res.sendStatus(200)})
.get(cors.cors, controllers.getMember)
.delete(cors.cors, controllers.deleteMember)



module.exports = memberRouter;