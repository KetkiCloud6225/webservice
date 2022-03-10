require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const basicAuth = require('_helpers/basic_auth');
const errorHandler = require('_middleware/error-handler');
const healthzRouter = require("./routes/health");
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// use basic HTTP auth to secure the api
//app.use(basicAuth);

// api routes
app.use('/v1/user', require('./users/users.controller'));

//healthz route 
app.use("/healthz",healthzRouter.router);

// global error handler
app.use(errorHandler);

// start server
const port = 8080;
app.listen(port, () => console.log('Server listening on port ' + port));