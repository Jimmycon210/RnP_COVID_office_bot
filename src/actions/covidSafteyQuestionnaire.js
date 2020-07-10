async function covidSafteyQuestionnaire ({ ack, body, client, context }) {
    try{
        ack();

        const yesNoOptions = [
            {
                text: {
                    type: 'plain_text',
                    text: 'Yes',
                    emoji: true,
                },
                value: `${true}`,
            },
            {
                text: {
                    type: 'plain_text',
                    text: 'No',
                    emoji: true,
                },
                value: `${false}`,
            }
        ]

        const blocks = [
            {
                type: 'input',
                block_id: 'office_day',
                label: {
                    type: 'plain_text',
                    text: 'What day will you be going into the office?'
                },
                element: {
                    type: 'datepicker',
                    // initial_date: '2020-01-01',
                    placeholder: {
                        type: 'plain_text',
                        text: 'Select a date',
                        emoji: true,
                    }
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
                }
            },
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

        await client.views.open({
            token: process.env.SLACK_BOT_TOKEN,
            trigger_id: body.trigger_id,
            view,
        });
    } catch(error) {
        console.error(error);
    }
}

module.exports = covidSafteyQuestionnaire;