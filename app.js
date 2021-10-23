require('dotenv').config()

// logger
const log = require('signale')
// elarian
const { Elarian } = require('elarian')

// handlers

async function handleUssd(notification, customer, appData, callback) {
    
    const input = notification.input.text

    const customerData = await customer.getState()

    let menu = {
        text: '',
        isTerminal: false,
    }

    if (input === '') {
        menu.text = 'Hi how are you. What is your name?'

        callback(menu, appData)
    } else if (input !== '') {
        let name = input
        menu.text = `Thanks for providing your name, ${name}`
        menu.isTerminal = true

        callback(menu, appData)
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
        .connect()
}

start()