const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../controllers/product');
const cors = require('../cors');

const poductRouter = express.Router();

poductRouter.use(bodyParser.json());

poductRouter.route('/')
.options(cors.corsWithOptions, (req,res)=>{res.sendStatus(200)})
.get(cors.cors, controllers.getAllProducts)
.post(cors.cors, controllers.createProduct)
.delete(cors.cors, controllers.deleteMany)
//with id
poductRouter.route('/:productId')
.options(cors.corsWithOptions, (req,res)=>{res.sendStatus(200)})
.get(cors.cors, controllers.getProduct)
.put(cors.cors, controllers.updateProduct)
.delete(cors.cors, controllers.deleteProduct)

module.exports = poductRouter;

