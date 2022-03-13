const express = require('express');
const router = express.Router();
require('dotenv').config();

/**
 * /healthz endpoint
 */

router.get("/",async (req,res)=>   {
    console.log("health.js router.get called")
   
    setSuccessResponse(res);
    
});

const setSuccessResponse = (response) => {  
    response.sendStatus(200);
    response.json(process.env);
    
};


//module.exports.setSuccessResponse = setSuccessResponse;
 //module.exports  = router;

module.exports = {
    setSuccessResponse,
    router,
}