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

router.post('/self/pic',[basicAuth,upload.single('profilePic')],uploadPic);
router.get('/self', basicAuth,getUser);
router.delete('/self/pic',basicAuth,deletePic);
router.get('/self/pic',basicAuth,getPic);
//router.put('/self/pic',[basicAuth,upload.single('profilePic')],updatePic);

router.get('/self', basicAuth,getUser);
//router.get('/:id', getById);
router.post('/', createSchema, create);
//router.put('/:id', updateSchema, update);
router.put('/self', [basicAuth,updateSchema], update);
//router.delete('/:id', _delete);


module.exports = router;

// route functions


function getUser(req,res, next) {
    userService.getById(req.user.id)
        .then(user => res.json(user))
        .catch(next);
}

function getPic(req,res, next) {
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
    userService.create(req.body)
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

function update(req, res, next) {
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
    console.log("delete called in controller")
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
            console.log("uploadPic return value");
            console.log(user);
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