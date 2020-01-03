'use strict';

const User = require('./User');

module.exports.create = async (event, context, callback) => {

    await User.createRandomUser()
        .then(resp => {
            console.log(resp);
            callback(null, resp);

        })
        .catch(err => {
            console.log(err);
            callback(null, err);
        });
};

module.exports.read = async (event, context, callback) => {

    let body = event.queryStringParameters;
    // console.log(body);

    if(!body){
        await User.listUsers()
            .then(resp => {
                console.log(resp);
                callback(null, resp);
            })
            .catch(err => {
                console.log(err);
                callback(null, err);
            });
    }
    else{
        await User.readUserInfo(body)
            .then(resp => {
                // console.log(resp);
                callback(null, resp);
            })
            .catch(err => {
                console.log(err);
                callback(null, err);
            });
    }

};

module.exports.update = async (event, context, callback) => {

    if(!event.body){
        callback(null, {
            statusCode: 400,
            body: JSON.stringify({
                success: false,
                description: 'No values passed'
            })});
    }
    else{
        let body = event.body;
        body = JSON.parse(body);

        await User.updateUser(body)
            .then(resp => {
                console.log(resp);
                callback(null, resp);
            })
            .catch(err => {
                console.log(err);
                callback(null, err);
            });
    }

};

module.exports.delete = async (event, context, callback) => {

    if(!event.body){
        callback(null, {
            statusCode: 400,
            body: JSON.stringify({
                success: false,
                description: 'No values passed'
            })});
    }
    else{
        let body = event.body;
        body = JSON.parse(body);

        await User.deleteUser(body)
            .then(resp => {
                console.log(resp);
                callback(null, resp);
            })
            .catch(err => {
                console.log(err);
                callback(null, err);
            });
    }
};
