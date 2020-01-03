const AWS = require('aws-sdk');
const axios = require('axios');
require('dotenv').config();
const AWSConfig = {
    region: 'us-east-1',
    endpoint: 'http://dynamodb.us-east-1.amazonaws.com',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
};
AWS.config.update(AWSConfig);

const docClient = new AWS.DynamoDB.DocumentClient();

class User {

    randomUserCleanUp(obj){
        for (let i in obj) {
            if (typeof obj[i] === 'object') {
                this.randomUserCleanUp(obj[i]);
            }
            else if(obj[i] === '') {
                delete obj[i];
            }
        }
        return obj;
    }

    validateUserInput(body){
        let attributes = ['uuid', 'gender', 'name', 'location', 'email', 'login', 'dob', 'registered', 'phone',
            'cell', 'id', 'picture', 'nat'];
        let valid = true, has_uuid = false;

        for(let i in body){
            if(!attributes.includes(i)){
                valid = false;
            }
            console.log(i+' :'+body[i]);
            if(i === 'uuid' && typeof body[i] === 'string'){
                has_uuid = true;
            }
        }

        return valid && has_uuid;
    }

    /**
     * Random User Generator. Adds user into DB.
     * @returns {Promise<void>}
     */
    async createRandomUser(){
        let resp = await axios.get('https://randomuser.me/api/');
        resp = resp.data.results[0];
        resp.uuid = resp.login.uuid;
        resp = this.randomUserCleanUp(resp);

        const params = {
            TableName: 'users',
            Item: resp,
            ReturnValues: 'NONE'
        };

        return new Promise((resolve, reject) => {
            docClient.put(params, (err, data) => {
                if (err) {
                    console.log(err);
                    resolve({
                        statusCode: 500,
                        body: JSON.stringify({
                            success: false,
                            description: err
                        })
                    });
                }
                else{
                    console.log('Inside Else');
                    resolve({
                        statusCode: 200,
                        body: JSON.stringify({
                                success: true,
                                description: "A new User has been created with uuid:"+resp.uuid,
                                axios: resp
                            },
                            null, 2
                        )});
                }
            });

        });
    }

    readUserInfo(body){
        return new Promise((resolve, reject) => {
            if(!(body.uuid && typeof body.uuid === 'string')){
                reject({
                    statusCode: 400,
                    body: JSON.stringify({
                            success: false,
                            description: 'The given object does not contain the uuid'
                        },
                        null, 2
                    )});
            }
            else{
                let params = {
                    TableName: 'users',
                    Key: {
                        uuid: body.uuid
                    }
                };

                docClient.get(params, (err, data) => {
                    if(err){
                        reject({
                            statusCode: 400,
                            body: JSON.stringify({
                                success: false,
                                description: err
                            },
                            null, 2
                        )});
                    }
                    else{
                        if(data.Item){
                            data = data.Item;
                        }

                        resolve({
                            statusCode: 200,
                            body: JSON.stringify({
                                success: true,
                                data: data
                            })
                        });
                    }
                });
            }
        });
    }

    listUsers(){
        return new Promise((resolve, reject) => {

            let params = {
                TableName: 'users'
            };

            docClient.scan(params, (err, data) => {
                if(err){
                    reject({
                        statusCode: 400,
                        body: JSON.stringify({
                                success: false,
                                description: err
                            },
                            null, 2
                        )});
                }
                else{

                    resolve({
                        statusCode: 200,
                        body: JSON.stringify({
                            success: true,
                            data: data
                        })
                    });
                }
            });

        });
    }

    updateUser(body){
        return new Promise((resolve, reject) => {
            if(!this.validateUserInput(body)){
                reject({
                    statusCode: 400,
                    body: JSON.stringify({
                        success: false,
                        description: 'The given attributes are invalid'
                    },
                    null, 2
                )});
            }
            else{
                let exp = 'set ', values = {};

                for(let i in body){
                    if(i !== 'uuid'){
                        exp = exp + i + ' = :'+ i + ', ';

                        values[':'+i] =  body[i];
                    }
                }
                exp = exp.slice(0, exp.length-2);
                let params = {
                    TableName: 'users',
                    Key: { uuid: body.uuid },
                    UpdateExpression: exp,
                    ExpressionAttributeValues: values,
                    ReturnValues: 'UPDATED_NEW'
                };
                docClient.update(params, (err, data) => {
                    if(err){
                        resolve({
                            statusCode: 500,
                            body: JSON.stringify({
                                success: false,
                                description: err
                            })
                        });
                    }
                    else{
                        resolve({
                            statusCode: 200,
                            body: JSON.stringify({
                                    success: true,
                                    description: "User with uuid:"+body.uuid+'  has been updated',
                                    data: data,
                                exp: exp,
                                values: values
                                },
                                null, 2
                            )});
                    }
                });
            }
        });
    }

    deleteUser(body){
        return new Promise((resolve, reject) => {
            if(!(body.uuid && typeof body.uuid === 'string')){
                reject({
                    statusCode: 400,
                    body: JSON.stringify({
                            success: false,
                            description: 'The given uuid is invalid'
                        },
                        null, 2
                    )});
            }
            else{
                let params = {
                    TableName: 'users',
                    Key: {
                        uuid: body.uuid
                    }
                };

                docClient.delete(params, (err, data) => {
                    if(err){
                        reject({
                            statusCode: 400,
                            body: JSON.stringify({
                                    success: false,
                                    description: err
                                },
                                null, 2
                            )});
                    }
                    else{

                        resolve({
                            statusCode: 200,
                            body: JSON.stringify({
                                success: true,
                                description: 'The specified entry has been deleted'
                            })
                        });
                    }
                });
            }
        });
    }
}

module.exports = new User();

