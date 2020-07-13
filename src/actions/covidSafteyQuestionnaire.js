const logger = require("../../visualizations/logger");

async function covidSafteyQuestionnaire ({ ack, body, client, context }) {
    try{
        await ack();

        const yesNoOptions = [
            {
                text: {
                    type: 'plain_text',
                    text: 'Yes',
                    emoji: true,
                },
                value: `Yes`,
            },
            {
                text: {
                    type: 'plain_text',
                    text: 'No',
                    emoji: true,
                },
                value: `No`,
            }
        ];

        const officeOptions = [
            {
                text: {
                    type: 'plain_text',
                    text: 'Austin',
                    emoji: true,
                },
                value: 'Austin',
            },
            {
                text: {
                    type: 'plain_text',
                    text: 'Calgary',
                    emoji: true,
                },
                value: 'Calgary',
            },
            {
                text: {
                    type: 'plain_text',
                    text: 'Cleveland',
                    emoji: true,
                },
                value: 'Cleveland',
            },
            {
                text: {
                    type: 'plain_text',
                    text: 'Pittsburgh',
                    emoji: true,
                },
                value: 'Pittsburgh',
            },
        ]

        const timeOptions = [
            {
                text: {
                    type: 'plain_text',
                    text: 'All Day',
                    emoji: true,
                },
                value: 'full day'
            },
            {
                text: {
                    type: 'plain_text',
                    text: 'Half Day – Morning',
                    emoji: true,
                },
                value: 'half day - morning'
            },
            {
                text: {
                    type: 'plain_text',
                    text: 'Half Day – Afternoon',
                    emoji: true,
                },
                value: 'half day - afternoon'
            }
        ]

        const blocks = [
            {
                type: 'input',
                block_id: 'office_picker',
                label: {
                    type: 'plain_text',
                    text: 'Which office will you be visiting?'
                },
                element: {
                    type: 'static_select',
                    placeholder: {
                        type: 'plain_text',
                        text: 'Choose your office',
                        emoji: true,
                    },
                    options: officeOptions,
                    action_id: 'office_value',
                }
            },
            {
                type: 'input',
                block_id: 'office_day',
                label: {
                    type: 'plain_text',
                    text: 'What day will you be going into the office?'
                },
                element: {
                    type: 'datepicker',
                    placeholder: {
                        type: 'plain_text',
                        text: 'Select a date',
                        emoji: true,
                    },
                    action_id: 'date_value'
                }
            },
            {
                type: 'input',
                block_id: 'time_picker',
                label: {
                    type: 'plain_text',
                    text: 'When will you be in the office?'
                },
                element: {
                    type: 'static_select',
                    placeholder: {
                        type: 'plain_text',
                        text: 'Choose when you will be in office',
                        emoji: true,
                    },
                    options: timeOptions,
                    action_id: 'time_value',
                }
            },
            {
                type: 'input',
                block_id: 'covid_symptoms',
                label: {
                    type: 'plain_text',
                    text: 'Do you or anyone you reside with currently have any symptoms related to COVID-19?'
                },
                element: {
                    type: 'static_select',
                    placeholder: {
                        type: 'plain_text',
                        text: 'Choose yes or no',
                        emoji: true,
                    },
                    options: yesNoOptions,
                    action_id: 'symptoms_value',
                }
            },
            {
                type: 'input',
                block_id: 'covid_test_positive',
                label: {
                    type: 'plain_text',
                    text: 'Have you, or anyone in the same household, tested positive for COVID-19 or are waiting for test results for COVID-19?'
                },
                element: {
                    type: 'static_select',
                    placeholder: {
                        type: 'plain_text',
                        text: 'Choose yes or no',
                        emoji: true,
                    },
                    options: yesNoOptions,
                    action_id: 'pos_test_value',
                }
            },
            {
                type: 'input',
                block_id: 'international_travel',
                label: {
                    type: 'plain_text',
                    text: 'Have you traveled internationally in the past 14 days?'
                },
                element: {
                    type: 'static_select',
                    placeholder: {
                        type: 'plain_text',
                        text: 'Choose yes or no',
                        emoji: true,
                    },
                    options: yesNoOptions,
                    action_id: 'travel_value'
                }
            },
            {
                type: 'input',
                block_id: 'self_isolate',
                label: {
                    type: 'plain_text',
                    text: 'Have you been required or asked to self isolate?'
                },
                element: {
                    type: 'static_select',
                    placeholder: {
                        type: 'plain_text',
                        text: 'Choose yes or no',
                        emoji: true,
                    },
                    options: yesNoOptions,
                    action_id: 'isolate_value'
                }
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: '_If you answered “yes” to to any of the questions 4-7, you will not be permitted to enter the office and it is requested to consult your treating physician and/or your State/Provincial Health governing body for further direction._\n_If you answered “no” to all of the questions 4-7, you will be permitted to enter the office and will be required to follow the office safety protocols as outlined and pinned in your respective office channel._\n_Regardless of your answers, please still submit the form_'
                },
            }
        ];

        view = {
            type: 'modal',
            callback_id: 'submitted',
            title: {
                type: 'plain_text',
                text: 'Office COVID-19 Safety',
                emoji: true,
            },
            submit: {
                type: 'plain_text',
                text: 'Submit',
                emoji: true,
            },
            close: {
                type: 'plain_text',
                text: 'Close',
                emoji: true,
            },
            blocks,
        };

        logger.emit('*', 'Questionnaire opened', { user: `${body.user_id}` });

        await client.views.open({
            token: process.env.SLACK_BOT_TOKEN,
            trigger_id: body.trigger_id,
            view,
        });
    } catch(error) {
        logger.emit('*', 'error', error);
        throw error;
    }
}

module.exports = covidSafteyQuestionnaire;