const AWS = require("aws-sdk")

AWS.config.update({
    region: process.env.REACT_APP_region,
    accessKeyId: process.env.REACT_APP_AWS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_ACCESS_KEY,
})

const dynamoClient = new AWS.DynamoDB.DocumentClient()
const TABLE_NAME = 'Kwani_counties'

export const fetchCounties = async () => {
    const params = {
        TableName: TABLE_NAME,
    }

    let counties = await dynamoClient.scan(params).promise()

    return counties
}

export const fetchCountyByName = async (county_name) => {
    const params = {
        TableName: TABLE_NAME,
        FilterExpression: "#name = :county_name",
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
