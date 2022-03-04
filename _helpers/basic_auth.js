const userService = require('../users/user.service');

module.exports = basicAuth;

async function basicAuth(req, res, next) {
    // make authenticate path public
    if (req.path === '/v1/user/self') {
        return next();
    }
   
    // verify auth credentials
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
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

    // attach user to request object
    req.user = user

    next();
}