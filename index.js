const express = require("express");
const app = express();
const port = 3000;
const healthzRouter = require("./routes/health");

app.use(express.json());
app.use(express.urlencoded({ extended: false}));

// app.get("/",(req,res)=>{
//     res.json({message:"ok"});
// });

app.use("/healthz",healthzRouter.router);


app.listen(port,()=>{
    console.log(`Example app listening at http://localhost:${port}`);
});