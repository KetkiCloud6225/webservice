const express = require('express');
const router = express.Router();

/**
 * /healthz endpoint
 */

router.get("/",async (req,res)=>   {
    setSuccessResponse(res, true);
    
});

const setSuccessResponse = (response) => {
    
        response.status(200);
        response.json({ description: "Healhty" });
    
};


//module.exports.setSuccessResponse = setSuccessResponse;
 //module.exports  = router;

module.exports = {
    setSuccessResponse,
    router,
}