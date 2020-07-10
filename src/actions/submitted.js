const googleSheetCred = require('../../googleAppsScriptCredentials.json');

async function submitted ({ ack, body, view, context, client }) {
    try {
        const {
            state: {
                values: {
                    office_picker: {
                        office_value: {  
                            selected_option: { value: office }
                        },
                    },
                    office_day: {
                        date_value: { selected_date: dayInOffice },
                    },
                    covid_symptoms: {
                        symptoms_value: {
                            selected_option: { value: hasSymptoms },
                        },
                    },
                    covid_test_positive: {
                        pos_test_value: {
                            selected_option: { value: hasPosTest },
                        },
                    },
                    international_travel: {
                        travel_value: {
                            selected_option: { value: hasTraveled },
                        }
                    },
                    self_isolate: {
                        isolate_value: { 
                            selected_option: { value: hasIsolated },
                         },
                    },
                }
            }
        } = view;

        const userInfo = await client.users.info({
            user: body.user.id,
            token: context.botToken
        })

        const usersRealName = userInfo.real_name;

        console.log('here!');

        await ack();
    } catch(error) {
        console.error(error);
    }
}

module.exports = submitted;