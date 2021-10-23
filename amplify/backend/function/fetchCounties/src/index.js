const AWS = require("aws-sdk")

AWS.config.update({
    region: process.env.REACT_APP_region,
    accessKeyId: process.env.REACT_APP_AWS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_ACCESS_KEY,
})

const dynamoClient = new AWS.DynamoDB.DocumentClient()
const TABLE_NAME = 'Kwani_counties'


exports.handler = async (event) => {

    const params = {
        TableName: TABLE_NAME,
    }

    let counties = await dynamoClient.scan(params).promise()
    // TODO implement
    const response = {
        statusCode: 200,
        //  Uncomment below to enable CORS requests
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify({ counties }),
    };
    return response;
};
