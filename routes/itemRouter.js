const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../controllers/item');
const cors = require('../cors');

const itemRouter = express.Router();

itemRouter.use(bodyParser.json());

itemRouter.route('/')
.options(cors.corsWithOptions, (req,res)=>{res.sendStatus(200)})
.get(cors.cors, controllers.getAllItems)
.post(cors.cors, controllers.createItem)
.delete(cors.cors, controllers.deleteMany)
//with id
itemRouter.route('/:itemId')
.options(cors.corsWithOptions, (req,res)=>{res.sendStatus(200)})
.get(cors.cors, controllers.getItem)
.put(cors.cors, controllers.updateItem)
.delete(cors.cors, controllers.deleteItem)

module.exports = itemRouter;

