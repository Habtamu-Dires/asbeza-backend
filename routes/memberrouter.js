const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../controllers/member');
const cors = require('../cors');

const memberRouter= express.Router();

memberRouter.use(bodyParser.json());

memberRouter.route('/')
.get(cors.cors, controllers.getAllMembers);

//with id
memberRouter.route('/:memberId')
.get(cors.cors, controllers.getByMemberId);



module.exports = memberRouter;