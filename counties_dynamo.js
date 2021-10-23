const AWS = require("aws-sdk")

AWS.config.update({
    region: process.env.REACT_APP_region,
    accessKeyId: process.env.REACT_APP_AWS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_ACCESS_KEY,
})

const dynamoClient = new AWS.DynamoDB.DocumentClient()
const TABLE_NAME = 'Kwani_counties'

fetchCounties = async () => {
    const params = {
        TableName: TABLE_NAME,
    }

    let counties = await dynamoClient.scan(params).promise()

    return counties
}


fetchCountyByName = async (county_name) => {
    const params = {
        TableName: TABLE_NAME,
        FilterExpression: "#_ = :county_name",
        ExpressionAttributeValues: {
            ":county_name": county_name
        },
        ExpressionAttributeNames: {
            "#name": "name"
        }
    }

    let counties = await dynamoClient.scan(params).promise()

    return counties
}

module.exports = fetchCounties, fetchCountyByName