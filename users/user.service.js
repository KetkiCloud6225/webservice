const bcrypt = require('bcryptjs');
const db = require('_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    authenticateUser,
    delete: _delete
};

async function getAll() {
    return await db.User.findAll();
}

async function getById(id) {
    return await getUser(id);
}

async function create(params) {

    // validate
    console.log(params.username + " create")
    const existingUser = await db.User.findOne({ where: { username: params.username } })
    if (existingUser) {
        return { status: 400}
        //Promise.reject({status: 400});
    }

    const user = new db.User(params);
    
    // hash password
    user.password = await bcrypt.hash(params.password, 10);

    // save user
    await user.save();
    return {
        data: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            account_created: user.createdAt,
            account_updated: user.updatedAt 
        },
        status: 200
    }

    // Promise.resolve({
    //     data: {
    //         id: user.id,
    //         first_name: user.first_name,
    //         last_name: user.last_name,
    //         username: user.username,
    //         account_created: user.createdAt,
    //         account_updated: user.updatedAt 
    //     },
    //     status: 200
    // })
}



async function update(params,username) {
    console.log("update called");
    console.log(params);
    const user = await db.User.findOne({ where: { username: username } })
    console.log(user)
    
    // // validate
    // const userNameChanged = params.username && user.username !== params.username;
    // if (userNameChanged && await db.User.findOne({ where: { username: username } })) {
    //     throw 'Username "' + username + '" is already registered';
    // }

    if(params.username && user.username !==params.username) {
        return {
            status: 400
        }
    }
    

    // hash password if it was entered
    if (params.password) {
        params.password = await bcrypt.hash(params.password, 10);
    }
    user.username = params.username;
    user.first_name = params.first_name;
    user.last_name = params.last_name;
    user.password = params.password;
    // copy params to user and save
    //Object.assign(user, params);
    await user.save();
    return {
        status: 204
    }
}

async function authenticateUser({username,password}){
    console.log(username + " authenticateUser")
    const user = await db.User.findOne({ where: { username: username } })
    if (!user || !(await bcrypt.compare(password, user.password))) {

        return { status: 403} ;
    }
    //console.log(user);

    return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt

    }; 
}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

// helper functions

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        account_created: user.createdAt,
        account_updated: user.updatedAt

    };
}