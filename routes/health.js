const express = require('express');
const router = express.Router();
require('dotenv').config();

/**
 * /healthz endpoint
 */

router.get("/",async (req,res)=>   {
    console.log("health.js router.get called")
    response.sendStatus(200).json(process.env);
    //setSuccessResponse(res);
    
});

const setSuccessResponse = (response) => {  
    
    
};


//module.exports.setSuccessResponse = setSuccessResponse;
 //module.exports  = router;

module.exports = {
    setSuccessResponse,
    router,
}