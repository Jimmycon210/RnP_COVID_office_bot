const { App, ExpressReceiver } = require('@slack/bolt');
require('dotenv').config();
const covidSafteyQuestionnaire = require('./actions/covidSafteyQuestionnaire');
const submitted = require('./actions/submitted');
const shortid = require('shortid');
const logger = require('../visualizations/logger');

//Init app with token and signing secret
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Sets up logging
const onEveryRequest = (args) => {
    const { context, next } = args;
    const logContext = {
        requestId: shortid.generate(),
    };

    Object.assign(logContext, context.user);

    if (args.command) {
        logContext.command = args.command.command;
    } else if (args.action) {
        logContext.action = args.action.action_id || args.action.callback_id;
    } else if (args.view) {
        logContext.callback_id = args.view.callback_id;
    } else if (args.event) {
        logContext.event = args.event.type;
    }

    logger.emit('bolt_request', 'info', logContext);

    next();
};

// Creates listeners
function initListeners() {
    app.command('/covid-questionnarie', covidSafteyQuestionnaire);
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

app.use(onEveryRequest);
initListeners();
startServer();