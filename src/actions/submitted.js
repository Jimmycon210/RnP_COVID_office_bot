const googleSheetCred = require('../../googleAppsScriptCredentials.json');
require('dotenv').config();
const {
    getAuthToken,
    getSpreadSheetValues,
    batchUpdateSpreadSheet
} = require('../googleapis/googleSheetService');

//BELOW IS FOR TESTING, ONLY WORKS IN JAMES CONWAY'S TEST SLACK WORKSPACE
const OFFICE_TO_CHANNEL = {
    'Austin': 'C016TL16G06',
    'Calgary': 'C017Q7YCMC0',
    'Cleveland': 'C016KL999EK',
    'Pittsburgh': 'C017D1P61EV'
};

/*
THIS BELOW IS FOR PRODUCTION, WILL ONLY WORK ON R&P's WORKSPACE
const OFFICE_TO_CHANNEL = {
    'Austin': 'C03K6PVF0',
    'Calgary': 'C029VA4DR',
    'Cleveland': 'C3RJ4C99A',
    'Pittsburgh': 'C3029JY7N'
}
*/

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
                    time_picker: {
                        time_value: {
                            selected_option: { value: officeTime },
                        },
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
                        },
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
        const usersRealName = userInfo.user.real_name;

        const auth = await getAuthToken();
        const response = await getSpreadSheetValues({ 
            spreadsheetId: '1IhEnxzkgTHMyFP9Ig1dhL63Douc6qzX9A9EzSpU4V-M',
            sheetName: 'Sheet1',
            auth: auth
        });

        const rowToFill = response.data.values.length+1;
        const updateData = {
            range: `Sheet1!A${rowToFill}:H${rowToFill}`,
            majorDimension: 'ROWS',
            values: [ [usersRealName, office, dayInOffice, officeTime, hasSymptoms, hasPosTest, hasTraveled, hasIsolated] ]
        }

        const updateResponse = await batchUpdateSpreadSheet({
            spreadsheetId: '1IhEnxzkgTHMyFP9Ig1dhL63Douc6qzX9A9EzSpU4V-M',
            auth
        }, updateData);

        await ack();

        await client.chat.postMessage({
            token: context.botToken,
            channel: userInfo.user.id,
            text: `Thanks for filling out the questionnaire!\nWhile this is reviewed and before you enter the office, be sure to checkout the safety protocols for your office at <#${OFFICE_TO_CHANNEL[office]}>`
        });

        //messages the administrator of the bot (Lara) if someone answers yes to one of the COVID-19 questions
        if(hasSymptoms === 'Yes' || hasPosTest === 'Yes' || hasTraveled === 'Yes' || hasIsolated === 'Yes') {
            let message = `<!here> Hey there R&P safety team! :wave:\n${usersRealName} had some answers on the COVID-19 safety questionnaire that raised some flags :triangular_flag_on_post:. They answered 'Yes' for the following question(s):\n`;
            if(hasSymptoms === 'Yes') { message+=`\t- Do you or anyone you reside with currently have any symptoms related to COVID-19?\n`; }
            if(hasPosTest  === 'Yes') { message+=`\t- Have you, or anyone in the same household, tested positive for COVID-19 or are waiting for test results for COVID-19?\n`; }
            if(hasTraveled === 'Yes') { message+=`\t- Have you traveled internationally in the past 14 days?\n`; }
            if(hasIsolated === 'Yes') { message+=`\t- Have you been required or asked to self isolate?\n`; }
            message+= `${usersRealName} plans on visiting the ${office} office on ${dayInOffice}. They plan on being there for a ${officeTime} The rest of the questionnaire information can be found on the Google Sheet linked here: <https://docs.google.com/spreadsheets/d/1IhEnxzkgTHMyFP9Ig1dhL63Douc6qzX9A9EzSpU4V-M/edit#gid=0> starting on cell A${rowToFill}`;
            await client.chat.postMessage({
                token: context.botToken,
                channel: 'C0170RTSTJ7', 
                text: message,
            });
        }
    } catch(error) {
        console.error(error);
    }
}

module.exports = submitted;

//FOR PRODUCTION QUESTIONNAIRE RESPONSE CHANNEL
//https://robotsandpencils.slack.com/archives/G016Z9EGH5K