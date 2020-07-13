const { App } = require('@slack/bolt');
require('dotenv').config();
const tester = require('./actions/testCovidCommand');
const covidSafteyQuestionnaire = require('./actions/covidSafteyQuestionnaire');
const submitted = require('./actions/submitted');
const logger = require('../visualizations/logger');

//Init app with token and signing secret
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});


function initListeners() {
    app.command('/test_covid', tester);
    app.command('/covid_safety', covidSafteyQuestionnaire);
    app.view('submitted', submitted);
}

function startServer() {
    (async() => {
        //Start app
        await app.start(process.env.PORT || 3000);
        logger.emit(
            'app_startup',
            'info',
            `Bolt server listening`
        );
    })();
}

initListeners();
startServer();