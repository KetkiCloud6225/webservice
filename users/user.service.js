const bcrypt = require('bcryptjs');
const db = require('_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    authenticateUser,
    uploadPic,
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
}



async function update(params,username) {
    const user = await db.User.findOne({ where: { username: username } })

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

//upload Profile pic 
async function uploadPic(params,file,userId) {

    if(params.username && user.username !==params.username) {
        return {
            status: 400
        }
    }
    const data = {
        file_name: file.originalname,
        url: file.path,
        user_id: userId
    }
    let pic = new db.Pic(data);
    
    // save pic
    pic = await pic.save();
    console.log('Date ');
    console.log(pic.upload_date);
    return {
        data: {
            id: pic.id,
            file_name: pic.file_name,
            url: pic.url,
            user_id: pic.user_id,
            upload_date: pic.upload_date
        },
        status: 201
    }
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