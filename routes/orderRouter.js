const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../controllers/order');
const cors = require('../cors');

const orderRouter = express.Router();

orderRouter.use(bodyParser.json());

orderRouter.route('/')
.options(cors.corsWithOptions, (req,res)=>{res.sendStatus(200)})
.get(cors.cors, controllers.getAllOrders)
.post(cors.cors, controllers.createOrder)
.delete(cors.cors, controllers.deleteMany)

//with id
orderRouter.route('/:orderId')
.options(cors.corsWithOptions, (req,res)=>{res.sendStatus(200)})
.get(cors.cors, controllers.getOrderById)
.put(cors.cors, controllers.updaeOrder)
.delete(cors.cors, controllers.deleteOrder)


module.exports = orderRouter;
