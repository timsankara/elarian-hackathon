require('dotenv').config()
const AWS = require("aws-sdk")
var counties = require('./counties_dynamo')

AWS.config.update({
    region: process.env.REACT_APP_region,
    accessKeyId: process.env.REACT_APP_AWS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_ACCESS_KEY,
})
const dynamoClient = new AWS.DynamoDB.DocumentClient()
const TABLE_NAME = 'Kwani_counties'

// logger
const log = require('signale')
// elarian
const { Elarian } = require('elarian')


// define channels

const whatsappChannel = {
    number: '+254725823031',
    channel: 'whatsapp',
}

// handlers

async function handleUssd(notification, customer, appData, callback) {
    console.log(notification)

    const params = {
        TableName: TABLE_NAME,
    }

    let counties = await dynamoClient.scan(params).promise()

    const input = notification.input.text

    const customerData = await customer.getState()

    let menu = {
        text: '',
        isTerminal: false,
    }

    if (input === '') {
        menu.text = 'Hello! Welcome to Kwani Ni Kesho\n Enter your county code'

        callback(menu, appData)

    } else if (input !== '' && typeof (input) !== String) {
        let county_name = input
        // if () {
        menu.text = 'Enter a valid County Name'

        try {
            let county_of_interest = counties.Items.find(county => county.name == county_name)

            let governor = county_of_interest.governor
            let deputy_governor = county_of_interest.deputy_governor
            let senator = county_of_interest.senator
            let women_rep = county_of_interest.women_rep

            menu.text = `${county_of_interest.name}'s leaders are:\n
                            Governor: Hon. ${governor}\n
                            Deputy Governor: Hon. ${deputy_governor}\n
                            Senator: Hon. ${senator}\n
                            Women Rep: Hon. ${women_rep}
                            `
            menu.isTerminal = true
        } catch (e) {
            console.log(e)
            menu.text = 'Enter a valid County Name'
        }

        callback(menu, appData)
    }
}

async function handleWhatsApp(notification, customer, appData, callback) {

    console.log(notification)

    if (notification.text == 'Hi') {
        console.log(notification.text)
        customer.sendMessage(
            whatsappChannel,
            {
                body: {
                    text: 'Welcome to this service'
                }
            }
        )
    }
}

// create a connection

let client
start = () => {
    client = new Elarian({
        appId: process.env.APP_ID,
        orgId: process.env.ORG_ID,
        apiKey: process.env.API_KEY
    })

    // listeners
    client
        .on('error', (err) => {
            console.log(err)
            log.warn(`${error.message} || ${error}.Atttempting to reconnect...`)
            client.connect()
        })
        .on('connected', async () => {
            log.success('App is running!');
        })
        // ussd app
        // 4 params, (notification, customer information, app data which is in memory stuff you may need, callback)
        .on('ussdSession', handleUssd)
        .on('receivedWhatsapp', handleWhatsApp)
        .connect()
}

start()