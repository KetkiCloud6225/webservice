const userService = require('../users/user.service');

module.exports = basicAuth;

async function basicAuth(req, res, next) {
    // make authenticate path public
    if (req.path === '/v1/user/self') {
        return next();
    }


    //check for bas request
    if (req.originalUrl === '/v1/user/self/pic' && req.method === 'POST') {
        console.log('Ketki');
       
    }
   
    // verify auth credentials
    if(req.headers.authorization === undefined){
        return res.sendStatus(401);
    }
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    if(credentials === undefined){
        return res.sendStatus(401);
    }
    const [username, password] = credentials.split(':');
    console.log(username+" "+password);

     // check for basic auth header
     if(!username || !password) {
        console.log("No basicAuth headers");
        return res.sendStatus(401).json({ message: 'Missing Authorization Header' });
    }

    const user = await userService.authenticateUser({ username, password });
   
    if (!user || user.status ===403) {
        return res.sendStatus(403).json({ message: 'Invalid Authentication Credentials' });
    }

    if(user.verified === "false") {
        return res.sendStatus(401).json({ message: 'Email not verified' });
    }

    // attach user to request object
    req.user = user

    next();
}