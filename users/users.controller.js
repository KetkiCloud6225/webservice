const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
//const Role = require('_helpers/role');
const userService = require('./user.service');
const basicAuth = require('../_helpers/basic_auth');
const multer  = require('multer');
//const upload = multer({dest: 'uploads/'});
const path = require('path'); 
const log = require("../logs");
const logger = log.getLogger('logs');
const { v4: uuidv4 } = require("uuid");
const aws = require('aws-sdk');
aws.config.update({region:'us-east-1'});
var docClient = new aws.DynamoDB.DocumentClient();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
    cb(null, file.originalname)
    }
})

const upload = multer({storage: storage})
// routes
var SDC = require('statsd-client'),
	sdc = new SDC({port: 8125});


router.post('/user/self/pic',[basicAuth,upload.single('profilePic')],uploadPic);
router.get('/user/self', basicAuth,getUser);
router.delete('/user/self/pic',basicAuth,deletePic);
router.get('/user/self/pic',basicAuth,getPic);
//router.put('/self/pic',[basicAuth,upload.single('profilePic')],updatePic);

router.get('/user/self', basicAuth,getUser);
//router.get('/:id', getById);
router.post('/user', createSchema, create);
//router.put('/:id', updateSchema, update);
router.put('/user/self', [basicAuth,updateSchema], update);
//router.delete('/:id', _delete);
router.get('/verifyUser',verifyEmail);

module.exports = router;

// route functions


function getUser(req,res, next) {
    logger.info("User fetched"); 
    sdc.increment("User.GET.get_user");
    userService.getById(req.user.id)
        .then(user => res.json(user))
        .catch(next);
}

function getPic(req,res, next) {
    logger.info("Get Pic fetched"); 
    sdc.increment("User.GET.get_pic");
    userService.getPic(req.user.id)
        .then(user => {
            if(user.status === 201) {
                res.status(user.status);
                res.json(user.data);
            }else {
                res.sendStatus(user.status);
            }
        })
        .catch(next);
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function create(req, res, next) {
    let completionTime = new Date();
    let startTime = new Date();
    sdc.timing("User.POST.db_create_user",startTime); 
    logger.info("User created");
    sdc.increment("User.POST.create_user");
    userService.create(req.body)
        .then(user => {
            //verify email
            logger.info("Creation completed. Calling publish");
            const params = {
                Message: JSON.stringify({ username: req.body.username, token : uuidv4()}),
                TopicArn: "arn:aws:sns:us-east-1:257878682470:csye6225-topic",
            };
            const sns = new aws.SNS({ apiVersion: "2010-03-31" })
                .publish(params)
                .promise();
                sns
                .then(function (data) {
                logger.info("Creation completed. Calling publish then " + data.MessageId);
                logger.info(`Message ${params.Message} send sent to the topic ${params.TopicArn}`);
                console.log(
                    `Message ${params.Message} send sent to the topic ${params.TopicArn}`
                );                
                console.log("MessageID is " + data.MessageId);
            })
            .catch(function (err) {
            logger.info("Error in publish " + err);
            console.error(err, err.stack);
            });
                        
            //

            sdc.timing("User.POST.create_user",completionTime); 
            if(user.status === 201) {
                res.status(user.status);
                res.json(user.data);
            }else {
                res.sendStatus(user.status);
            }
        })
        .catch(next);
}


function verifyEmail(req,res,next) {
    logger.info("Verify Email called EMail received" + req.query.email);
    logger.info("Verify Email called token received" + req.query.token);
    if(req){
        let apiResponse = {
            username : req.query.email,
            token : req.query.token
        }
        let table = {
            TableName: "csye6225",
            Key :{
                "username" : {"S":req.query.email},
                "token":{"S":req.query.token}
            }
        }
        docClient.get(table,function (err,data){
            
            if(err){
                logger.info("csye6225::fetchOneByKey::error- "+JSON.stringify(err,null,2));
                console.log("csye6225::fetchOneByKey::error- "+JSON.stringify(err,null,2));
            }
            else{
                logger.info("csye6225::fetchOneByKey::success- "+JSON.stringify(data,null,2));
                console.log("csye6225::fetchOneByKey::success- "+JSON.stringify(data,null,2));
                let ttl = data.Item.TimeToExist
                let verificationEmail = data.Item.username
                console.log("TTL is ::"+ ttl);
                logger.info("TTL is ::"+ ttl); 
                if(data.Item && data.Item.TimeToExist && data.Item.token && data.Item.username){
                    console.log("in first if")
                    if(data.Item.TimeToExist > Math.floor(Date.now() / 1000)){
                        console.log(verificationEmail,"ttl verified")
                        let verifiedDate = new Date();
                        let verifiedUser = {
                            verified : true,
                            verified_on : verifiedDate,
                        }
                        logger.info(verifiedUser, "User verified created")
                        console.log(verifiedUser, "User verified created")
                        userService.verifyUser(verificationEmail).then((data) => {
                            console.log(data,"updated user")     
                            if(data.status == 204){
                                res.status(201).send({
                                    token : req.query.token,
                                    username : req.query.email
                                });
                        }
                    })  
                }else{
                    res.status(400).send({
                        error : "TTL expired"
                    })
                }
            }
        }})
    }
}


function update(req, res, next) {
    logger.info("Update File"); 
    sdc.increment("User.UPDATE.update_user");
    userService.update(req.body,req.user.username)
        .then(user => {
            res.sendStatus(user.status);
        })
        .catch(next);
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted' }))
        .catch(next);
}

function deletePic(req, res, next) {
    logger.info("Delete Pic"); 
    sdc.increment("User.DELETE.delete_PIC");
    userService.deletePic(req.user.id)
        .then((user) => {
            res.sendStatus(user.status);
        })
        .catch(next);
}

//upload ProfilePic
function uploadPic(req,res,next) {
    userService.uploadPic(req.body,req.file,req.user.id)
        .then(user => {            
            if(user.status === 201) {
                res.status(user.status);
                res.json(user.data);
            }else {
                res.sendStatus(user.status);
            }
        })
        .catch(next);
}

// schema functions

function createSchema(req, res, next) {
    const schema = Joi.object({
        
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req,res, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().required()
    }); 
    validateRequest(req, res,next,schema);
}