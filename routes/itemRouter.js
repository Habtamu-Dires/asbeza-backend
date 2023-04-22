const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../controllers/item');
const cors = require('../cors');

const itemRouter = express.Router();

itemRouter.use(bodyParser.json());

itemRouter.route('/')
.get(cors.cors, controllers.getAllItems)
.post(cors.cors, controllers.createItem)

//with id
itemRouter.route('/:itemId')
.put(cors.cors, controllers.updateItem)
.delete(cors.cors, controllers.deleteItem)

module.exports = itemRouter;

