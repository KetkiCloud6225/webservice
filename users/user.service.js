const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const fs = require('fs');
const AWS = require('aws-sdk');
const moment = require('moment');
const { resolve } = require('path');
// Set the Region 
AWS.config.update({region: 'us-east-1'});

require('dotenv').config();

AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY
  }); 

//   AWS.config.update({
//     accessKeyId: "AKIAZ3ZIQD6VBWR3VGVD",
//     secretAccessKey: "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"
//   });  

module.exports = {
    getAll,
    getById,
    create,
    update,
    authenticateUser,
    uploadPic,
    deletePic,
    getPic,
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

    const existingPic = await db.Pic.findOne({ where: { user_id: userId} });
    if(existingPic) {
        deletePic(userId);
    }

    var s3 = new AWS.S3();

    // Read content from the file
    const fileContent = fs.readFileSync(file.path);

    // Setting up S3 upload parameters
    const s3Params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${userId}/${userId}-img`, // File name you want to save as in S3
            Body: fileContent
        };

    /*const s3Params = {
        Bucket: "bucket.dev.ketkikule.me",
        Key: `${userId}/${file.filename}`, // File name you want to save as in S3
        Body: fileContent
    };*/      
    
    try {

        const data = await s3Upload(s3Params);
    
        const uploadedFile = {
            file_name: data.key,
            url: data.Location,
            user_id: userId
        }
        let pic = new db.Pic(uploadedFile);
        
        pic = await pic.save();
        return {
            data: {
                id: pic.id,
                file_name: pic.file_name,
                url: pic.url,
                user_id: pic.user_id,
                upload_date: moment(pic.createdAt).format('YYYY-MM-DD')
            },
            status: 201
        }
    } catch (e) {
        return {
            status: 400
        }
    }
    


}

function s3Upload(params) {
    var s3 = new AWS.S3();
    const promise = new Promise((resolve,reject) => {

        s3.upload(params,function(err, result) {
            if (err) {
                console.log("Error", err);
                reject(err)
            } else {
                console.log(`File uploaded successfully. ${result.Location}`);
                resolve(result);
            }
        });
    });

    return promise;
    
    
}

//upload Profile pic 
async function deletePic(userId) {
    console.log("DeletePic Called "+userId);

    const existingPic = await db.Pic.findOne({ where: { user_id: userId} });
    console.log(existingPic);
    if(existingPic) {
        var s3 = new AWS.S3();
        const s3Params = {
            Bucket: "bucket.dev.ketkikule.me",
            Key: `${existingPic.file_name}`
        };  

        try {

            const data = await s3Delete(s3Params);
            await existingPic.destroy();
            return {
                status: 204
            }
        } catch (e) {
            return {
                status: 400
            }
        }
    
    }else {
        return { status: 404}
    }

}

function s3Delete(params) {
    var s3 = new AWS.S3();
    const promise = new Promise((resolve,reject) => {

        s3.deleteObject(params,function(err, result) {
            if (err) {
                console.log("Error", err);
                reject(err)
            } else {
                console.log(`File deleted successfully.`);
                resolve(result);
            }
        });
    });

    return promise;
    
}



// helper functions

async function getPic(id) {
    const pic = await db.Pic.findOne({ where: { user_id: id }});
    if (!pic) {
        return {status:400}
    };
    return {
        data: {
        id: pic.id,
        file_name: pic.file_name,
        url: pic.url,
        user_id: pic.user_id,
        upload_date: moment(pic.createdAt).format('YYYY-MM-DD')
        },
        status : 201
    };
}

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