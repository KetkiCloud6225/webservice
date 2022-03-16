const express = require('express');
const router = express.Router();
const config = require('config.json');

/**
 * /healthz endpoint
 */

router.get("/",async (req,res)=>   {
    console.log("health.js router.get called")
   
    setSuccessResponse(res);
    
});

const setSuccessResponse = (response) => {  
    response.status(200);
    response.json(config.database);
    
};


//module.exports.setSuccessResponse = setSuccessResponse;
 //module.exports  = router;

module.exports = {
    setSuccessResponse,
    router,
}