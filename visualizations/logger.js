const { LogEmitter, formatters, writers } = require('@polyn/logger');

const logger = new LogEmitter();
const logWriter = new writers.DevConsoleWriter({
  formatter: new formatters.BlockFormatter(),
});

['trace', 'debug', 'info', 'warn', 'error', 'fatal'].forEach((category) =>
  logger.on(category, logWriter.listen)
);

module.exports = logger;
