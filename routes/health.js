const express = require('express');
const router = express.Router();

/**
 * /healthz endpoint
 */

router.get("/",async (req,res)=>   {
    console.log("health.js router.get called")
   
    setSuccessResponse(res);
    
});

const setSuccessResponse = (response) => {  
    response.sendStatus(200);
    
};


//module.exports.setSuccessResponse = setSuccessResponse;
 //module.exports  = router;

module.exports = {
    setSuccessResponse,
    router,
}