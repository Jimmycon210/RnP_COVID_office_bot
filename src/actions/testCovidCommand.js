async function tester({ command, ack, say }) {
    ack();
    say(
        {
            text: 'Test command works!'
        }
    );
}

module.exports = tester