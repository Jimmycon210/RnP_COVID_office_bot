var Spreadsheet = require('edit-google-spreadsheet');
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

        Spreadsheet.load({
            debug: true,
            spreadsheetName : 'Office Reopening COVID-19 Data',
            worksheetName: 'Sheet1',

            oauth2: {
                client_id: googleSheetCred.web.client_id,
                client_secret: googleSheetCred.web.client_secret,
                refresh_token: 'hmm',
            }
        }, function sheetReady(err, spreadsheet) {
            spreadsheet.add({ 3: { 5: 'hello!' } });
            spreadsheet.send(function(err) {
                if(err) { throw err; }
                console.log('Updated cell at row 3 column 5 to hello!');
            })
        });

        await ack();
    } catch(error) {
        console.error(error);
    }
}

module.exports = submitted;