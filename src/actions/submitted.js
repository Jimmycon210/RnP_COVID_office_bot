const googleSheetCred = require('../../googleAppsScriptCredentials.json');
require('dotenv').config();
const {
    getAuthToken,
    getSpreadSheet,
    getSpreadSheetValues
} = require('../googleapis/googleSheetService');

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
        });

        const auth = await getAuthToken();
        const response = await getSpreadSheetValues({ 
            spreadsheetId: '1IhEnxzkgTHMyFP9Ig1dhL63Douc6qzX9A9EzSpU4V-M',
            sheetName: 'Sheet1',
            auth: auth
        });
        console.log('output for getSpreadSheetValues', JSON.stringify(response.data, null, 2));

        const usersRealName = userInfo.real_name;

        console.log('here!');

        await ack();
    } catch(error) {
        console.error(error);
    }
}

module.exports = submitted;