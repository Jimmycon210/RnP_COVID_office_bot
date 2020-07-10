async function submitted ({ ack, body, view, context }) {
    try {
        await ack();
        console.log('here!');
    } catch(error) {
        console.error(error);
    }
}

module.exports = submitted;